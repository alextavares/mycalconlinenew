import { getTranslations } from 'next-intl/server';
import FreeFallClientPage from './free-fall-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'FreeFallCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function FreeFallCalculatorPage() {
  return <FreeFallClientPage />;
}
