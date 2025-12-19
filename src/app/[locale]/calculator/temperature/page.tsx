import TemperatureClientPage from './temperature-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'TemperatureConverter' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/temperature`,
      languages: {
        'en': `${siteUrl}/en/calculator/temperature`,
        'es': `${siteUrl}/es/calculator/temperature`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/temperature`,
        'x-default': `${siteUrl}/en/calculator/temperature`,
      },
    },
  };
}

export default function TemperaturePageContainer({ params }: Props) {
  return <TemperatureClientPage />;
}
