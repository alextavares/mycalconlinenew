import CompoundInterestClientPage from './compound-interest-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'CompoundInterestCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/compound-interest`,
      languages: {
        'en': `${siteUrl}/en/calculator/compound-interest`,
        'es': `${siteUrl}/es/calculator/compound-interest`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/compound-interest`,
        'x-default': `${siteUrl}/en/calculator/compound-interest`,
      },
    },
  };
}

export default function CompoundInterestPageContainer({ params }: Props) {
  return <CompoundInterestClientPage />;
}
