import { getTranslations } from 'next-intl/server';
import ImpulseClientPage from './impulse-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'ImpulseCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function ImpulseCalculatorPage() {
  return <ImpulseClientPage />;
}
