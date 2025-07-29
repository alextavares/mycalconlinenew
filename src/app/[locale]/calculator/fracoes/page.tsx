import FracoesClientPage from './fracoes-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'FractionCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/fracoes`,
      languages: {
        'en': `${siteUrl}/en/calculator/fracoes`,
        'es': `${siteUrl}/es/calculator/fracoes`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/fracoes`,
        'x-default': `${siteUrl}/en/calculator/fracoes`,
      },
    },
    // openGraph: { /* ... Open Graph config ... */ },
  };
}

export default function FracoesPageContainer({ params }: Props) {
  return <FracoesClientPage />;
}
