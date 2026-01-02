import { getTranslations } from 'next-intl/server';
import SpeedClientPage from './speed-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'SpeedCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function SpeedCalculatorPage() {
  return <SpeedClientPage />;
}
