import {MetadataRoute} from 'next';
import {Locale} from 'next-intl';
import {routing} from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';

const host = 'https://mycalconline.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    '/',
    '/calculator/adicionar-subtrair-dias',
    '/calculator/area-cilindro',
    '/calculator/area-circulo',
    '/calculator/area-cubo',
    '/calculator/area-esfera',
    '/calculator/area-quadrado',
    '/calculator/area-quadrado-imagem',
    '/calculator/area-quadrado-nova',
    '/calculator/binario',
    '/calculator/click-counter',
    '/calculator/como-calcular-horas-extras',
    '/calculator/currency-converter',
    '/calculator/desvio-padrao',
    '/calculator/dias-entre-datas',
    '/calculator/fracoes',
    '/calculator/gasto-gasolina',
    '/calculator/gerador-escala-notas',
    '/calculator/gordura-corporal',
    '/calculator/hexadecimal',
    '/calculator/hora-minuto',
    '/calculator/horas-trabalhadas',
    '/calculator/idade',
    '/calculator/juros-compostos',
    '/calculator/juros-simples',
    '/calculator/media-mediana-moda',
    '/calculator/media-ponderada',
    '/calculator/mmc',
    '/calculator/porcentagem',
    '/calculator/regra-de-3',
    '/calculator/relacao-pf',
    '/calculator/romano-decimal',
    '/calculator/taxa-metabolica-basal',
    '/calculator/variancia-estatistica',
    '/calculator/word-counter'
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
  const pathname = getPathname({locale, href});
  return host + pathname;
}