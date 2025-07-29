'use server';

import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from '@/config/i18n.config';

export default getRequestConfig(async ({ locale }) => {
  // Always ensure we have a valid locale
  if (!locale || !locales.includes(locale as any)) {
    console.warn(`[i18n] Locale not provided or invalid (${locale}), using default: ${defaultLocale}`);
    locale = defaultLocale;
  }

  console.log(`[i18n] Loading messages for locale: ${locale}`);
  
  try {
    const messages = (await import(`../messages/${locale}.json`)).default;
    console.log(`[i18n] Successfully loaded messages for ${locale}`);
    return { messages, locale };
  } catch (error) {
    console.error(`[i18n] Critical error loading messages for ${locale}:`, error);
    // Return empty messages to prevent complete failure
    return { messages: {}, locale: defaultLocale };
  }
});
