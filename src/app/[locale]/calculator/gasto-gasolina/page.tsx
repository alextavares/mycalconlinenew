import GastoGasolinaClientPage from './gasto-gasolina-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'GasCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/gasto-gasolina`,
      languages: {
        'en': `${siteUrl}/en/calculator/gasto-gasolina`,
        'es': `${siteUrl}/es/calculator/gasto-gasolina`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/gasto-gasolina`,
        'x-default': `${siteUrl}/es/calculator/gasto-gasolina`,
      },
    },
    openGraph: {
      title: t('metadataTitle'),
      description: t('metadataDescription'),
      url: `${siteUrl}/${params.locale}/calculator/gasto-gasolina`,
      siteName: 'MyCalcOnline',
      locale: params.locale,
      type: 'website',
    },
  };
}

export default async function GastoGasolinaPage({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: 'GasCalculator' });

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t('metadataTitle'),
    description: t('metadataDescription'),
    url: `https://mycalconline.com/${params.locale}/calculator/gasto-gasolina`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: params.locale === 'es' ? 'MXN' : params.locale === 'pt-BR' ? 'BRL' : 'USD',
    },
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li><a href={`/${params.locale}`} className="hover:underline">Home</a></li>
          <li>/</li>
          <li className="text-foreground font-medium">{t('breadcrumbTitle')}</li>
        </ol>
      </nav>

      {/* H1 for SEO */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">{t('h1Title')}</h1>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">{t('h1Subtitle')}</p>

      {/* Calculator */}
      <GastoGasolinaClientPage />

      {/* SEO Content */}
      <div className="max-w-3xl mx-auto mt-12 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('howToUseTitle')}</h2>
          <p className="text-muted-foreground">{t('howToUseDetail')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('formulaTitle')}</h2>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="font-mono text-center text-lg">{t('formulaText')}</p>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{t('formulaExplanation')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('tipsTitle')}</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t('tip1')}</li>
            <li>{t('tip2')}</li>
            <li>{t('tip3')}</li>
            <li>{t('tip4')}</li>
          </ul>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('faqTitle')}</h2>
          <div className="space-y-4">
            <details className="border rounded-lg p-4 cursor-pointer">
              <summary className="font-medium">{t('faqQ1')}</summary>
              <p className="mt-2 text-muted-foreground">{t('faqA1')}</p>
            </details>
            <details className="border rounded-lg p-4 cursor-pointer">
              <summary className="font-medium">{t('faqQ2')}</summary>
              <p className="mt-2 text-muted-foreground">{t('faqA2')}</p>
            </details>
            <details className="border rounded-lg p-4 cursor-pointer">
              <summary className="font-medium">{t('faqQ3')}</summary>
              <p className="mt-2 text-muted-foreground">{t('faqA3')}</p>
            </details>
          </div>
        </section>
      </div>
    </div>
  );
}
