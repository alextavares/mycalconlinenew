import SpeedClientPage from './speed-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SpeedCalculator' });

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
  };
}

export default async function SpeedPage({ params }: Props) {
  const { locale } = await params;
  return <SpeedClientPage locale={locale} />;
}
