import { getTranslations } from 'next-intl/server';
import ProjectileClientPage from './projectile-client-page';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'ProjectileCalculator' });
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
  };
}

export default function ProjectileCalculatorPage() {
  return <ProjectileClientPage />;
}
