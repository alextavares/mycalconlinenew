import { getTranslations } from 'next-intl/server';
import InclinedPlaneClientPage from './inclined-plane-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'InclinedPlaneCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function InclinedPlaneCalculatorPage() {
  return <InclinedPlaneClientPage />;
}
