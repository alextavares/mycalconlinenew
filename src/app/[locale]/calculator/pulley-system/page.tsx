import { getTranslations } from 'next-intl/server';
import PulleySystemClientPage from './pulley-system-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'PulleySystemCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function PulleySystemCalculatorPage() {
  return <PulleySystemClientPage />;
}
