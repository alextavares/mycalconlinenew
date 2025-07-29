// REMOVE 'use client' from here if it exists

import MMCClientPage from './mmc-client-page'; // Importe o novo componente cliente
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server'; // Para generateMetadata

type Props = {
  params: { locale: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'MMCCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/mmc`,
      languages: {
        'en': `${siteUrl}/en/calculator/mmc`,
        'es': `${siteUrl}/es/calculator/mmc`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/mmc`,
        'x-default': `${siteUrl}/en/calculator/mmc`,
      },
    },
    // openGraph: { /* ... seu openGraph config ... */ },
  };
}

// Este é o Server Component da página
export default function MMCCalculatorPageContainer({ params }: Props) {
  // Você pode buscar traduções aqui com getTranslations e passá-las como props
  // para MMCClientPage se ele não usar useTranslations internamente para tudo.
  // No entanto, como MMCClientPage já usa useTranslations, não é estritamente necessário
  // passar traduções daqui, a menos que haja algo específico que só o servidor possa buscar.
  return <MMCClientPage />;
}
