import CalorieClientPage from './calorie-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'CalorieCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/calorie`,
      languages: {
        'en': `${siteUrl}/en/calculator/calorie`,
        'es': `${siteUrl}/es/calculator/calorie`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/calorie`,
        'x-default': `${siteUrl}/en/calculator/calorie`,
      },
    },
  };
}

export default function CaloriePageContainer({ params }: Props) {
  return <CalorieClientPage />;
}
