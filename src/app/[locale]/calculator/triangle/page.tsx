import TriangleClientPage from './triangle-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'TriangleCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/triangle`,
      languages: {
        'en': `${siteUrl}/en/calculator/triangle`,
        'es': `${siteUrl}/es/calculator/triangle`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/triangle`,
        'x-default': `${siteUrl}/en/calculator/triangle`,
      },
    },
  };
}

export default function TrianglePageContainer({ params }: Props) {
  return <TriangleClientPage />;
}
