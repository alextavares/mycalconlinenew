import { getTranslations } from 'next-intl/server';
import AngularVelocityClientPage from './angular-velocity-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'AngularVelocityCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function AngularVelocityCalculatorPage() {
  return <AngularVelocityClientPage />;
}
