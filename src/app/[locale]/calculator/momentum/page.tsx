import { getTranslations } from 'next-intl/server';
import MomentumClientPage from './momentum-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'MomentumCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function MomentumCalculatorPage() {
  return <MomentumClientPage />;
}
