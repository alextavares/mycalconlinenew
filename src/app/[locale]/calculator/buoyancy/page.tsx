import { getTranslations } from 'next-intl/server';
import BuoyancyClientPage from './buoyancy-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'BuoyancyCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function BuoyancyCalculatorPage() {
  return <BuoyancyClientPage />;
}
