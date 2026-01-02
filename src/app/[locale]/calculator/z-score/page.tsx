import ZScoreClientPage from './z-score-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'ZScoreCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/z-score`,
      languages: {
        'en': `${siteUrl}/en/calculator/z-score`,
        'es': `${siteUrl}/es/calculator/z-score`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/z-score`,
        'x-default': `${siteUrl}/en/calculator/z-score`,
      },
    },
  };
}

export default function ZScorePageContainer({ params }: Props) {
  return <ZScoreClientPage />;
}
