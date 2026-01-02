import RatioClientPage from './ratio-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'RatioCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/ratio`,
      languages: {
        'en': `${siteUrl}/en/calculator/ratio`,
        'es': `${siteUrl}/es/calculator/ratio`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/ratio`,
        'x-default': `${siteUrl}/en/calculator/ratio`,
      },
    },
  };
}

export default function RatioPageContainer({ params }: Props) {
  return <RatioClientPage />;
}
