import SalaryClientPage from './salary-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'SalaryCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/salary`,
      languages: {
        'en': `${siteUrl}/en/calculator/salary`,
        'es': `${siteUrl}/es/calculator/salary`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/salary`,
        'x-default': `${siteUrl}/en/calculator/salary`,
      },
    },
  };
}

export default function SalaryPageContainer({ params }: Props) {
  return <SalaryClientPage />;
}
