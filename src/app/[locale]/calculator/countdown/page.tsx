import CountdownClientPage from './countdown-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'CountdownCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/countdown`,
      languages: {
        'en': `${siteUrl}/en/calculator/countdown`,
        'es': `${siteUrl}/es/calculator/countdown`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/countdown`,
        'x-default': `${siteUrl}/en/calculator/countdown`,
      },
    },
  };
}

export default function CountdownPage() {
  return <CountdownClientPage />;
}
