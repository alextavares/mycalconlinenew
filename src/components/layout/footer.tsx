'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Calculator, Mail, Github } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('Layout');
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  const categories = [
    { key: 'mathematics', href: `/${locale}#mathematics` },
    { key: 'finance', href: `/${locale}#finance` },
    { key: 'health', href: `/${locale}#health` },
    { key: 'statistics', href: `/${locale}#statistics` },
    { key: 'geometry', href: `/${locale}#geometry` },
    { key: 'converters', href: `/${locale}#converters` },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <span className="text-2xl">🧮</span>
              MyCalcOnline
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Free online calculators for math, finance, health, and everyday life. Fast, accurate, and easy to use.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map(cat => (
                <li key={cat.key}>
                  <Link
                    href={cat.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {t(`categories.${cat.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Calculators */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/calculator/porcentagem`} className="text-sm text-gray-400 hover:text-white transition-colors">
                  Percentage Calculator
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/calculator/fracoes`} className="text-sm text-gray-400 hover:text-white transition-colors">
                  Fraction Calculator
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/calculator/juros-compostos`} className="text-sm text-gray-400 hover:text-white transition-colors">
                  Compound Interest
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/calculator/idade`} className="text-sm text-gray-400 hover:text-white transition-colors">
                  Age Calculator
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/calculator/mmc`} className="text-sm text-gray-400 hover:text-white transition-colors">
                  LCM Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              {t('footerCopyright', { year: currentYear })}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-600">
                Made with precision for your calculations
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
