'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from 'lucide-react';

interface NavItem {
  slug: string;
  categoryKey: string;
}

interface StructuredNavData {
  [categoryKey: string]: NavItem[];
}

interface HeaderNavProps {
  navigationData: StructuredNavData | undefined;
  categoryOrder: string[] | undefined;
  currentLocale: string;
}

export default function HeaderNav({ navigationData, categoryOrder, currentLocale }: HeaderNavProps) {
  const tl = useTranslations('Layout');
  const tCalcs = useTranslations('Calculators');

  if (!navigationData || !categoryOrder || categoryOrder.length === 0) {
    console.warn('[HeaderNav] Missing navigation data or category order.');
    return null;
  }

  return (
    <nav className="hidden md:flex items-center space-x-1 overflow-x-auto max-w-full">
      {categoryOrder.map((categoryKey) => {
        const itemsInCategory = navigationData[categoryKey];

        if (!itemsInCategory || itemsInCategory.length === 0) {
          return null;
        }

        return (
          <DropdownMenu key={categoryKey}>
            <DropdownMenuTrigger asChild>
              {/* Explicitly set dark text color for light header */}
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 px-3 py-2 font-medium whitespace-nowrap"
              >
                {tl(`categories.${categoryKey}`)}
                <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-gray-900 border border-gray-200 shadow-md max-h-[70vh] overflow-y-auto" align="start">
              {itemsInCategory.map((item) => (
                <DropdownMenuItem key={item.slug} asChild>
                  <Link href={`/${currentLocale}/calculator/${item.slug}`} className="cursor-pointer px-3 py-1.5 text-sm hover:bg-gray-100 focus:bg-gray-100 w-full">
                    {tCalcs(`${item.slug}.title`)}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </nav>
  );
}
