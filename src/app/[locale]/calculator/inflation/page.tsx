import InflationClientPage from './inflation-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'InflationCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/inflation`,
      languages: {
        'en': `${siteUrl}/en/calculator/inflation`,
        'es': `${siteUrl}/es/calculator/inflation`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/inflation`,
        'x-default': `${siteUrl}/en/calculator/inflation`,
      },
    },
  };
}

export default function InflationPageContainer({ params }: Props) {
  return <InflationClientPage />;
}
