import { getTranslations } from 'next-intl/server';
import PendulumClientPage from './pendulum-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'PendulumCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function PendulumCalculatorPage() {
  return <PendulumClientPage />;
}
