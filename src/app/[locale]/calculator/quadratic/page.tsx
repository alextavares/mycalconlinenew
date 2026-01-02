import QuadraticClientPage from './quadratic-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'QuadraticCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/quadratic`,
      languages: {
        'en': `${siteUrl}/en/calculator/quadratic`,
        'es': `${siteUrl}/es/calculator/quadratic`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/quadratic`,
        'x-default': `${siteUrl}/en/calculator/quadratic`,
      },
    },
  };
}

export default function QuadraticPageContainer({ params }: Props) {
  return <QuadraticClientPage />;
}
