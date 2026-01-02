import { getTranslations } from 'next-intl/server';
import GravityClientPage from './gravity-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'GravityCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function GravityCalculatorPage() {
  return <GravityClientPage />;
}
