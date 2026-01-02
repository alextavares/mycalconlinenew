import { getTranslations } from 'next-intl/server';
import WavelengthClientPage from './wavelength-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'WavelengthCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function WavelengthCalculatorPage() {
  return <WavelengthClientPage />;
}
