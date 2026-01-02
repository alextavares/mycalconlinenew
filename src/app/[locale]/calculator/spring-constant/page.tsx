import { getTranslations } from 'next-intl/server';
import SpringConstantClientPage from './spring-constant-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'SpringConstantCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function SpringConstantCalculatorPage() {
  return <SpringConstantClientPage />;
}
