import BodyFatClientPage from './body-fat-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'BodyFatCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/body-fat`,
      languages: {
        'en': `${siteUrl}/en/calculator/body-fat`,
        'es': `${siteUrl}/es/calculator/body-fat`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/body-fat`,
        'x-default': `${siteUrl}/en/calculator/body-fat`,
      },
    },
  };
}

export default function BodyFatPageContainer({ params }: Props) {
  return <BodyFatClientPage />;
}
