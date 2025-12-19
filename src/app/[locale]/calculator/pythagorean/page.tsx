import PythagoreanClientPage from './pythagorean-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'PythagoreanCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/pythagorean`,
      languages: {
        'en': `${siteUrl}/en/calculator/pythagorean`,
        'es': `${siteUrl}/es/calculator/pythagorean`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/pythagorean`,
        'x-default': `${siteUrl}/en/calculator/pythagorean`,
      },
    },
  };
}

export default function PythagoreanPageContainer({ params }: Props) {
  return <PythagoreanClientPage />;
}
