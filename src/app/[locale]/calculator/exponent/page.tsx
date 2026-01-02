import ExponentClientPage from './exponent-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'ExponentCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/exponent`,
      languages: {
        'en': `${siteUrl}/en/calculator/exponent`,
        'es': `${siteUrl}/es/calculator/exponent`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/exponent`,
        'x-default': `${siteUrl}/en/calculator/exponent`,
      },
    },
  };
}

export default function ExponentPageContainer({ params }: Props) {
  return <ExponentClientPage />;
}
