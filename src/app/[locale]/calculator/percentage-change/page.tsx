import PercentageChangeClientPage from './percentage-change-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'PercentageChangeCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/percentage-change`,
      languages: {
        'en': `${siteUrl}/en/calculator/percentage-change`,
        'es': `${siteUrl}/es/calculator/percentage-change`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/percentage-change`,
        'x-default': `${siteUrl}/en/calculator/percentage-change`,
      },
    },
  };
}

export default function PercentageChangePageContainer({ params }: Props) {
  return <PercentageChangeClientPage />;
}
