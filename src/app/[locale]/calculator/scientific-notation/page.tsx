import ScientificNotationClientPage from './scientific-notation-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'ScientificNotationCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/scientific-notation`,
      languages: {
        'en': `${siteUrl}/en/calculator/scientific-notation`,
        'es': `${siteUrl}/es/calculator/scientific-notation`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/scientific-notation`,
        'x-default': `${siteUrl}/en/calculator/scientific-notation`,
      },
    },
  };
}

export default function ScientificNotationPageContainer({ params }: Props) {
  return <ScientificNotationClientPage />;
}
