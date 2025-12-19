import RandomNumberClientPage from './random-number-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'RandomNumberGenerator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/random-number`,
      languages: {
        'en': `${siteUrl}/en/calculator/random-number`,
        'es': `${siteUrl}/es/calculator/random-number`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/random-number`,
        'x-default': `${siteUrl}/en/calculator/random-number`,
      },
    },
  };
}

export default function RandomNumberPageContainer({ params }: Props) {
  return <RandomNumberClientPage />;
}
