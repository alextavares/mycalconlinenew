import CircleClientPage from './circle-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'CircleCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/circle`,
      languages: {
        'en': `${siteUrl}/en/calculator/circle`,
        'es': `${siteUrl}/es/calculator/circle`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/circle`,
        'x-default': `${siteUrl}/en/calculator/circle`,
      },
    },
  };
}

export default function CirclePageContainer({ params }: Props) {
  return <CircleClientPage />;
}
