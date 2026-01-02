import { getTranslations } from 'next-intl/server';
import CentripetalForceClientPage from './centripetal-force-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'CentripetalForceCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function CentripetalForceCalculatorPage() {
  return <CentripetalForceClientPage />;
}
