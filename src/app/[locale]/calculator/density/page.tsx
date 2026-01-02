import { getTranslations } from 'next-intl/server';
import DensityClientPage from './density-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'DensityCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function DensityCalculatorPage() {
  return <DensityClientPage />;
}
