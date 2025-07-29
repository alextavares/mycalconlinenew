import PorcentagemClientPage from './porcentagem-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'PercentageCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/porcentagem`,
      languages: {
        'en': `${siteUrl}/en/calculator/porcentagem`,
        'es': `${siteUrl}/es/calculator/porcentagem`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/porcentagem`,
        'x-default': `${siteUrl}/en/calculator/porcentagem`,
      },
    },
    // openGraph: { /* ... Open Graph config ... */ },
  };
}

export default function PorcentagemPageContainer({ params }: Props) {
  return <PorcentagemClientPage />;
}
