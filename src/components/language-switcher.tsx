'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales, localeNames } from '@/config/i18n.config';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguagesIcon } from 'lucide-react';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('LanguageSwitcher');

    const handleLocaleChange = (newLocale: string) => {
        console.log(`[LangSwitcher] Changing locale. Current: ${locale}, New: ${newLocale}, Pathname: ${pathname}`);

        const pathSegments = pathname.split('/');
        const firstSegmentIsLocale = pathSegments.length > 1 && locales.includes(pathSegments[1] as any);

        if (firstSegmentIsLocale) {
            pathSegments[1] = newLocale;
        } else {
             console.warn(`[LangSwitcher] Pathname "${pathname}" did not start with expected locale prefix. Inserting locale.`);
             pathSegments.splice(1, 0, newLocale);
        }

        let finalUrl = pathSegments.join('/');
         finalUrl = finalUrl.replace(/\/+/g, '/');

         if (finalUrl === `/${newLocale}/` && pathSegments.length <= 3) {
             finalUrl = `/${newLocale}`;
         } else if (finalUrl !== `/${newLocale}` && finalUrl.endsWith('/') && finalUrl.length > 1) {
             finalUrl = finalUrl.slice(0, -1);
         }

         if (!finalUrl || finalUrl === '/') {
             finalUrl = `/${newLocale}`;
         }

        console.log(`[LangSwitcher] Attempting to navigate to: ${finalUrl}`);
        router.push(finalUrl);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {/* Set text color for light background and adjust hover */}
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100">
                    <LanguagesIcon className="h-5 w-5" />
                    <span className="sr-only">{t('changeLanguage')}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white text-gray-900 border border-gray-200 shadow-md">
                {locales.map((loc) => (
                    <DropdownMenuItem
                        key={loc}
                        disabled={locale === loc}
                        onSelect={() => handleLocaleChange(loc)}
                        className={`${locale === loc ? "font-semibold bg-gray-100" : ""} cursor-pointer px-3 py-1.5 text-sm hover:bg-gray-100 focus:bg-gray-100`}
                    >
                        {localeNames[loc]}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
