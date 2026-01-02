import { getTranslations } from 'next-intl/server';
import MomentOfInertiaClientPage from './moment-of-inertia-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'MomentOfInertiaCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function MomentOfInertiaCalculatorPage() {
  return <MomentOfInertiaClientPage />;
}
