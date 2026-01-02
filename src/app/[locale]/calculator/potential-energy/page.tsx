import { getTranslations } from 'next-intl/server';
import PotentialEnergyClientPage from './potential-energy-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'PotentialEnergyCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function PotentialEnergyCalculatorPage() {
  return <PotentialEnergyClientPage />;
}
