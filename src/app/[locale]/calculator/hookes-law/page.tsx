import { getTranslations } from 'next-intl/server';
import HookesLawClientPage from './hookes-law-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'HookesLawCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function HookesLawCalculatorPage() {
  return <HookesLawClientPage />;
}
