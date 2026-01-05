import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import Link from 'next/link';
import { locales, defaultLocale } from '@/config/i18n.config';
import LanguageSwitcher from '@/components/language-switcher';
import { SidebarProvider, Sidebar, SidebarTrigger } from '@/components/ui/sidebar';
import Footer from '@/components/layout/footer';
import HeaderNav from '@/components/layout/HeaderNav';
import { GlobalSearch } from '@/components/layout/GlobalSearch';

const inter = Inter({ subsets: ["latin"] });

// Re-use data logic from HomePage to avoid duplication
import { calculators } from '@/config/calculators';
const calculatorSlugs = Object.keys(calculators);
// No categoryMap needed, we derive it from the calculator config itself


const categoryOrder = [
  'mathematics', 'math', 'finance', 'health', 'fitness', 'physics', 'statistics',
  'geometry', 'calendar', 'construction', 'biology', 'chemistry', 'ecology', 'education', 'text', 'sports', 'electronics', 'web', 'marketing', 'conversion', 'converters', 'everyday', 'other', 'others'
];

// Interface for individual calculator items within a category
interface NavItem {
  slug: string;
  categoryKey: string;
}

// Interface for the structured navigation data passed to HeaderNav
interface StructuredNavData {
  [categoryKey: string]: NavItem[];
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {

  const validLocale = locales.includes(locale as any) ? locale as 'en' | 'pt-BR' : defaultLocale;
  if (locale !== validLocale) {
    console.warn(`Invalid locale "${locale}", using ${validLocale} instead`);
  }

  let messages;
  try {
    messages = await getMessages({ locale: validLocale });
    console.log(`[LocaleLayout] Successfully loaded ${Object.keys(messages).length} message keys for locale: ${validLocale}`);
  } catch (error) {
    console.error(`Failed to load messages for locale ${validLocale}:`, error);
    try {
      messages = await getMessages({ locale: defaultLocale });
      console.warn(`Fell back to default locale messages (${defaultLocale})`);
    } catch (fallbackError) {
      console.error('Failed to load default locale messages:', fallbackError);
      messages = {};
    }
  }

  const finalLocale = validLocale;

  // Prepare structured navigation data (grouped by category)
  const structuredNavigationData: StructuredNavData = {};
  categoryOrder.forEach(catKey => {
    structuredNavigationData[catKey] = [];
  });

  calculatorSlugs.forEach(slug => {
    const config = calculators[slug];
    if (config) {
      const categoryKey = config.category || 'others';
      // Only add if category is in our order list (or maybe add logic to auto-add?)
      // For now, map to 'others' if not found in order, OR just push it.
      // But HeaderNav relies on keys in navigationData.
      if (structuredNavigationData[categoryKey]) {
        structuredNavigationData[categoryKey].push({ slug, categoryKey });
      } else {
        // Init if missing (e.g. for new dynamic categories not in fixed list??)
        // Better to rely on categoryOrder driving the UI
        if (!structuredNavigationData['others']) structuredNavigationData['others'] = [];
        structuredNavigationData['others'].push({ slug, categoryKey });
      }
    }
  });

  return (
    <NextIntlClientProvider
      key={finalLocale}
      locale={finalLocale}
      messages={messages}
      now={new Date()}
      timeZone="UTC"
    >
      <Head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-EY57J6B0Z3"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-EY57J6B0Z3');
            `
        }} />
      </Head>
      <SidebarProvider>
        <div className={`flex min-h-screen w-full overflow-x-hidden ${inter.className}`}>
          {/* Mobile sidebar - hidden on md screens and above */}
          <div className="md:hidden">
            <Sidebar>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Menu</h2>
                {/* Dashboard Link */}
                <div className="mb-4">
                  <Link
                    href={`/${finalLocale}/dashboard`}
                    className="block px-2 py-2 text-sm font-medium rounded hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                </div>
                {/* Mobile navigation using structuredNavigationData */}
                <div className="space-y-4 overflow-y-auto max-h-[70vh]">
                  {categoryOrder.map((categoryKey) => {
                    const itemsInCategory = structuredNavigationData[categoryKey];

                    if (!itemsInCategory || itemsInCategory.length === 0) {
                      return null;
                    }

                    return (
                      <div key={categoryKey} className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-700">{categoryKey}</h3>
                        <ul className="space-y-1">
                          {itemsInCategory.map((item) => (
                            <li key={item.slug}>
                              <Link
                                href={`/${finalLocale}/calculator/${item.slug}`}
                                className="block px-2 py-1 text-sm rounded hover:bg-gray-100"
                              >
                                {item.slug.replace(/-/g, ' ')}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Sidebar>
          </div>

          <main className="flex-1 flex flex-col w-full max-w-full">
            {/* Clean Header - Omni Calculator Style */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                  {/* Left: Logo & Mobile Trigger */}
                  <div className="flex items-center gap-3">
                    <SidebarTrigger className="md:hidden text-gray-600 hover:text-primary" />
                    <Link
                      href={`/${finalLocale}`}
                      className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-80 transition-opacity"
                    >
                      <span className="text-2xl">🧮</span>
                      <span className="hidden sm:inline">MyCalcOnline</span>
                    </Link>
                  </div>

                  {/* Center: Navigation */}
                  <HeaderNav
                    navigationData={structuredNavigationData}
                    categoryOrder={categoryOrder}
                    currentLocale={finalLocale}
                  />

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2">
                    <GlobalSearch />
                    <Link
                      href={`/${finalLocale}/dashboard`}
                      className="hidden md:inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                    >
                      Dashboard
                    </Link>
                    <LanguageSwitcher />
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-grow bg-background w-full overflow-x-hidden">
              {children}
            </div>

            <Footer />
          </main>
        </div>
      </SidebarProvider>
    </NextIntlClientProvider>
  );
}
