import { getTranslations } from 'next-intl/server';
import PressureClientPage from './pressure-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'PressureCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function PressureCalculatorPage() {
  return <PressureClientPage />;
}
