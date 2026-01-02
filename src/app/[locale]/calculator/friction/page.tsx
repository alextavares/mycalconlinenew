import { getTranslations } from 'next-intl/server';
import FrictionClientPage from './friction-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'FrictionCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function FrictionCalculatorPage() {
  return <FrictionClientPage />;
}
