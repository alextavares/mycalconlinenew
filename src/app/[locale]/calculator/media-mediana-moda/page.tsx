import MediaMedianaModaClientPage from './media-mediana-moda-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'MeanMedianModeCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/media-mediana-moda`,
      languages: {
        'en': `${siteUrl}/en/calculator/media-mediana-moda`,
        'es': `${siteUrl}/es/calculator/media-mediana-moda`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/media-mediana-moda`,
        'x-default': `${siteUrl}/es/calculator/media-mediana-moda`,
      },
    },
    openGraph: {
      title: t('metadataTitle'),
      description: t('metadataDescription'),
      url: `${siteUrl}/${params.locale}/calculator/media-mediana-moda`,
      siteName: 'MyCalcOnline',
      locale: params.locale,
      type: 'website',
    },
  };
}

export default async function MediaMedianaModaPage({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: 'MeanMedianModeCalculator' });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t('metadataTitle'),
    description: t('metadataDescription'),
    url: `https://mycalconline.com/${params.locale}/calculator/media-mediana-moda`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: params.locale === 'es' ? 'MXN' : params.locale === 'pt-BR' ? 'BRL' : 'USD',
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: t('faqQ1'),
        acceptedAnswer: { '@type': 'Answer', text: t('faqA1') },
      },
      {
        '@type': 'Question',
        name: t('faqQ2'),
        acceptedAnswer: { '@type': 'Answer', text: t('faqA2') },
      },
      {
        '@type': 'Question',
        name: t('faqQ3'),
        acceptedAnswer: { '@type': 'Answer', text: t('faqA3') },
      },
    ],
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
      <MediaMedianaModaClientPage />

      {/* SEO Content */}
      <div className="max-w-3xl mx-auto mt-12 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('howToUseTitle')}</h2>
          <p className="text-muted-foreground">{t('howToUseDetail')}</p>
        </section>

        {/* Definitions */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('definitionsTitle')}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-700 mb-2">{t('meanDefinitionTitle')}</h3>
              <p className="text-sm text-muted-foreground">{t('meanDefinition')}</p>
              <p className="mt-2 font-mono text-sm bg-white p-2 rounded">{t('meanFormula')}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h3 className="font-semibold text-purple-700 mb-2">{t('medianDefinitionTitle')}</h3>
              <p className="text-sm text-muted-foreground">{t('medianDefinition')}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-700 mb-2">{t('modeDefinitionTitle')}</h3>
              <p className="text-sm text-muted-foreground">{t('modeDefinition')}</p>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('exampleTitle')}</h2>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="font-mono mb-2">{t('exampleData')}</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>{t('exampleMean')}</li>
              <li>{t('exampleMedian')}</li>
              <li>{t('exampleMode')}</li>
            </ul>
          </div>
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
