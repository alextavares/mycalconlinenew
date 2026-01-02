import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import EnergyClientPage from './energy-client-page';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'EnergyCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/energy`,
      languages: {
        'en': `${siteUrl}/en/calculator/energy`,
        'es': `${siteUrl}/es/calculator/energy`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/energy`,
        'x-default': `${siteUrl}/en/calculator/energy`,
      },
    },
  };
}

export default function EnergyCalculatorPage() {
  return <EnergyClientPage />;
}
