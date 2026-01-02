import ProbabilityClientPage from './probability-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'ProbabilityCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/probability`,
      languages: {
        'en': `${siteUrl}/en/calculator/probability`,
        'es': `${siteUrl}/es/calculator/probability`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/probability`,
        'x-default': `${siteUrl}/en/calculator/probability`,
      },
    },
  };
}

export default function ProbabilityPageContainer({ params }: Props) {
  return <ProbabilityClientPage />;
}
