import TipClientPage from './tip-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'TipCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/tip`,
      languages: {
        'en': `${siteUrl}/en/calculator/tip`,
        'es': `${siteUrl}/es/calculator/tip`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/tip`,
        'x-default': `${siteUrl}/en/calculator/tip`,
      },
    },
  };
}

export default function TipPageContainer({ params }: Props) {
  return <TipClientPage />;
}
