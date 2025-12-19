import MortgageClientPage from './mortgage-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'MortgageCalculator' });

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
  };
}

export default async function MortgagePage({ params }: Props) {
  const { locale } = await params;
  // Ensure the locale is valid or handle accordingly
  return <MortgageClientPage locale={locale} />;
}
