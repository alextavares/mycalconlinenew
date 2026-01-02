import GcdLcmClientPage from './gcd-lcm-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'GcdLcmCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/gcd-lcm`,
      languages: {
        'en': `${siteUrl}/en/calculator/gcd-lcm`,
        'es': `${siteUrl}/es/calculator/gcd-lcm`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/gcd-lcm`,
        'x-default': `${siteUrl}/en/calculator/gcd-lcm`,
      },
    },
  };
}

export default function GcdLcmPageContainer({ params }: Props) {
  return <GcdLcmClientPage />;
}
