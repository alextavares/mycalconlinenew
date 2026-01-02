import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import AccelerationClientPage from './acceleration-client-page';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'AccelerationCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/acceleration`,
      languages: {
        'en': `${siteUrl}/en/calculator/acceleration`,
        'es': `${siteUrl}/es/calculator/acceleration`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/acceleration`,
        'x-default': `${siteUrl}/en/calculator/acceleration`,
      },
    },
  };
}

export default function AccelerationCalculatorPage() {
  return <AccelerationClientPage />;
}
