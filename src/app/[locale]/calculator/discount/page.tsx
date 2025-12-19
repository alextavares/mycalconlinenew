import DiscountClientPage from './discount-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'DiscountCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/discount`,
      languages: {
        'en': `${siteUrl}/en/calculator/discount`,
        'es': `${siteUrl}/es/calculator/discount`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/discount`,
        'x-default': `${siteUrl}/en/calculator/discount`,
      },
    },
  };
}

export default function DiscountPageContainer({ params }: Props) {
  return <DiscountClientPage />;
}
