import BmiClientPage from './bmi-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'BmiCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/bmi`,
      languages: {
        'en': `${siteUrl}/en/calculator/bmi`,
        'es': `${siteUrl}/es/calculator/bmi`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/bmi`,
        'x-default': `${siteUrl}/en/calculator/bmi`,
      },
    },
  };
}

export default function BmiPageContainer({ params }: Props) {
  return <BmiClientPage />;
}
