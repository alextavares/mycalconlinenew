import { getTranslations } from 'next-intl/server';
import WorkClientPage from './work-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'WorkCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function WorkCalculatorPage() {
  return <WorkClientPage />;
}
