import AverageClientPage from './average-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'AverageCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/average`,
      languages: {
        'en': `${siteUrl}/en/calculator/average`,
        'es': `${siteUrl}/es/calculator/average`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/average`,
        'x-default': `${siteUrl}/en/calculator/average`,
      },
    },
  };
}

export default function AveragePageContainer({ params }: Props) {
  return <AverageClientPage />;
}
