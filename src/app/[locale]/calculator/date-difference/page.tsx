import DateDifferenceClientPage from './date-difference-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'DateDifferenceCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/date-difference`,
      languages: {
        'en': `${siteUrl}/en/calculator/date-difference`,
        'es': `${siteUrl}/es/calculator/date-difference`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/date-difference`,
        'x-default': `${siteUrl}/en/calculator/date-difference`,
      },
    },
  };
}

export default function DateDifferencePageContainer({ params }: Props) {
  return <DateDifferenceClientPage />;
}
