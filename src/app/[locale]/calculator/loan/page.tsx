import LoanClientPage from './loan-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'LoanCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/loan`,
      languages: {
        'en': `${siteUrl}/en/calculator/loan`,
        'es': `${siteUrl}/es/calculator/loan`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/loan`,
        'x-default': `${siteUrl}/en/calculator/loan`,
      },
    },
  };
}

export default function LoanPageContainer({ params }: Props) {
  return <LoanClientPage />;
}
