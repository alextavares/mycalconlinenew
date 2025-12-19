import GPACalculatorClientPage from './gpa-calculator-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'GPACalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/gpa-calculator`,
      languages: {
        'en': `${siteUrl}/en/calculator/gpa-calculator`,
        'es': `${siteUrl}/es/calculator/gpa-calculator`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/gpa-calculator`,
        'x-default': `${siteUrl}/en/calculator/gpa-calculator`,
      },
    },
  };
}

export default function GPACalculatorPageContainer({ params }: Props) {
  return <GPACalculatorClientPage />;
}
