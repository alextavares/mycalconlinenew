'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('Layout');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-center p-4 bg-gray-200 text-gray-600 text-sm mt-8 w-full">
      <div className="container mx-auto px-4 max-w-full">
        <p className="mb-2">
          {t('footerCopyright', { year: currentYear })}
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/about" passHref legacyBehavior>
            <a className="hover:underline">About Us</a>
          </Link>
          <Link href="/privacy" passHref legacyBehavior>
            <a className="hover:underline">Privacy Policy</a>
          </Link>
        </div>
      </div>
    </footer>
  );
}
