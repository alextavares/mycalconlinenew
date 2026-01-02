import { getTranslations } from 'next-intl/server';
import ElasticCollisionClientPage from './elastic-collision-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'ElasticCollisionCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function ElasticCollisionCalculatorPage() {
  return <ElasticCollisionClientPage />;
}
