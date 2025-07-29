import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from '@/config/i18n.config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Add any pathnames configuration here if needed
  // pathnames: {
  //   '/': '/',
  //   '/about': {
  //     en: '/about',
  //     es: '/acerca',
  //     'pt-BR': '/sobre'
  //   }
  // }
});