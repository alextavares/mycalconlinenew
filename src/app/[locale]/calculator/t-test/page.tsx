import TTestClientPage from './t-test-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'TTestCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/t-test`,
      languages: {
        'en': `${siteUrl}/en/calculator/t-test`,
        'es': `${siteUrl}/es/calculator/t-test`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/t-test`,
        'x-default': `${siteUrl}/en/calculator/t-test`,
      },
    },
  };
}

export default function TTestPageContainer({ params }: Props) {
  return <TTestClientPage />;
}
