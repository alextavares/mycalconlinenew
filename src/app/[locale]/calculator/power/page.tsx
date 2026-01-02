import { getTranslations } from 'next-intl/server';
import PowerClientPage from './power-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'PowerCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function PowerCalculatorPage() {
  return <PowerClientPage />;
}
