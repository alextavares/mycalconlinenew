import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import ForceClientPage from './force-client-page';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'ForceCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/force`,
      languages: {
        'en': `${siteUrl}/en/calculator/force`,
        'es': `${siteUrl}/es/calculator/force`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/force`,
        'x-default': `${siteUrl}/en/calculator/force`,
      },
    },
  };
}

export default function ForceCalculatorPage() {
  return <ForceClientPage />;
}
