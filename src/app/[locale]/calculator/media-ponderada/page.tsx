import MediaPonderadaClientPage from './media-ponderada-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'WeightedAverageCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/media-ponderada`,
      languages: {
        'en': `${siteUrl}/en/calculator/media-ponderada`,
        'es': `${siteUrl}/es/calculator/media-ponderada`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/media-ponderada`,
        'x-default': `${siteUrl}/en/calculator/media-ponderada`,
      },
    },
    // openGraph: { /* ... Open Graph config ... */ },
  };
}

export default function MediaPonderadaPageContainer({ params }: Props) {
  return <MediaPonderadaClientPage />;
}
