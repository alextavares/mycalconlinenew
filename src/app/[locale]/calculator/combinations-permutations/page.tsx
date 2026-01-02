import CombinationsPermutationsClientPage from './combinations-permutations-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'CombinationsPermutationsCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/combinations-permutations`,
      languages: {
        'en': `${siteUrl}/en/calculator/combinations-permutations`,
        'es': `${siteUrl}/es/calculator/combinations-permutations`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/combinations-permutations`,
        'x-default': `${siteUrl}/en/calculator/combinations-permutations`,
      },
    },
  };
}

export default function CombinationsPermutationsPageContainer({ params }: Props) {
  return <CombinationsPermutationsClientPage />;
}
