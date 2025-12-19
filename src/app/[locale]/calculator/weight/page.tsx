import WeightClientPage from './weight-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'WeightConverter' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/weight`,
      languages: {
        'en': `${siteUrl}/en/calculator/weight`,
        'es': `${siteUrl}/es/calculator/weight`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/weight`,
        'x-default': `${siteUrl}/en/calculator/weight`,
      },
    },
  };
}

export default function WeightPageContainer({ params }: Props) {
  return <WeightClientPage />;
}
