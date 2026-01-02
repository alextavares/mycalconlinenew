import { getTranslations } from 'next-intl/server';
import KineticEnergyClientPage from './kinetic-energy-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'KineticEnergyCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function KineticEnergyCalculatorPage() {
  return <KineticEnergyClientPage />;
}
