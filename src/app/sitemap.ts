import { MetadataRoute } from 'next';
import { Locale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { calculators } from '@/config/calculators';

const host = 'https://mycalconline.com';

export default function sitemap(): MetadataRoute.Sitemap {
  // Dynamic Calculator Paths
  const calculatorPaths = Object.keys(calculators).map(slug => `/calculator/${slug}`);

  const staticPaths = [
    '/',
    ...calculatorPaths
  ];

  const sitemapEntries = staticPaths.flatMap(getEntries);
  console.log('Sitemap entries:', sitemapEntries);
  return sitemapEntries;
}

type Href = Parameters<typeof getPathname>[0]['href'];

function getEntries(href: Href) {
  return routing.locales.map((locale: Locale) => ({
    url: getUrl(href, locale),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((cur: Locale) => [cur, getUrl(href, cur)])
      )
    }
  }));
}

function getUrl(href: Href, locale: Locale) {
  const pathname = getPathname({ locale, href });
  return host + pathname;
}