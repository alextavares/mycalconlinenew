import { getTranslations } from 'next-intl/server';
import TorqueClientPage from './torque-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'TorqueCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function TorqueCalculatorPage() {
  return <TorqueClientPage />;
}
