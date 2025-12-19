import RoiClientPage from './roi-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'RoiCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/roi`,
      languages: {
        'en': `${siteUrl}/en/calculator/roi`,
        'es': `${siteUrl}/es/calculator/roi`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/roi`,
        'x-default': `${siteUrl}/en/calculator/roi`,
      },
    },
  };
}

export default function RoiPageContainer({ params }: Props) {
  return <RoiClientPage />;
}
