import OhmsLawClientPage from './ohms-law-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'OhmsLawCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/ohms-law`,
      languages: {
        'en': `${siteUrl}/en/calculator/ohms-law`,
        'es': `${siteUrl}/es/calculator/ohms-law`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/ohms-law`,
        'x-default': `${siteUrl}/en/calculator/ohms-law`,
      },
    },
  };
}

export default function OhmsLawPageContainer({ params }: Props) {
  return <OhmsLawClientPage />;
}
