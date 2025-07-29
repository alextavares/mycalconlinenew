// src/config/i18n.config.ts

export const locales = ['en', 'pt-BR', 'es'] as const; // Use 'as const' for stricter typing

export const localeNames: { [key: string]: string } = {
  'en': 'English',
  'pt-BR': 'Português (Brasil)',
  'es': 'Español',
};

export const defaultLocale = 'pt-BR';
