import UnitConverterClientPage from './unit-converter-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'UnitConverter' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/unit-converter`,
      languages: {
        'en': `${siteUrl}/en/calculator/unit-converter`,
        'es': `${siteUrl}/es/calculator/unit-converter`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/unit-converter`,
        'x-default': `${siteUrl}/en/calculator/unit-converter`,
      },
    },
  };
}

export default function UnitConverterPageContainer({ params }: Props) {
  return <UnitConverterClientPage />;
}
