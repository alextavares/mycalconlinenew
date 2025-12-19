import RegraDe3ClientPage from './regra-de-3-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'RuleOfThreeCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/regra-de-3`,
      languages: {
        'en': `${siteUrl}/en/calculator/regra-de-3`,
        'es': `${siteUrl}/es/calculator/regra-de-3`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/regra-de-3`,
        'x-default': `${siteUrl}/pt-BR/calculator/regra-de-3`,
      },
    },
    openGraph: {
      title: t('metadataTitle'),
      description: t('metadataDescription'),
      url: `${siteUrl}/${params.locale}/calculator/regra-de-3`,
      siteName: 'MyCalcOnline',
      locale: params.locale,
      type: 'website',
    },
  };
}

export default async function RegraDe3Page({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: 'RuleOfThreeCalculator' });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t('metadataTitle'),
    description: t('metadataDescription'),
    url: `https://mycalconline.com/${params.locale}/calculator/regra-de-3`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: params.locale === 'pt-BR' ? 'BRL' : params.locale === 'es' ? 'MXN' : 'USD',
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
      <RegraDe3ClientPage />

      {/* SEO Content */}
      <div className="max-w-3xl mx-auto mt-12 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('howToUseTitle')}</h2>
          <p className="text-muted-foreground">{t('howToUseDetail')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('whatIsTitle')}</h2>
          <p className="text-muted-foreground">{t('whatIsDetail')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('directVsInverseTitle')}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-700 mb-2">{t('directTitle')}</h3>
              <p className="text-sm text-muted-foreground">{t('directExplanation')}</p>
              <p className="mt-2 font-mono text-sm bg-white p-2 rounded">{t('directFormula')}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-700 mb-2">{t('inverseTitle')}</h3>
              <p className="text-sm text-muted-foreground">{t('inverseExplanation')}</p>
              <p className="mt-2 font-mono text-sm bg-white p-2 rounded">{t('inverseFormula')}</p>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('examplesTitle')}</h2>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">{t('example1Title')}</h3>
              <p className="text-sm text-muted-foreground">{t('example1Detail')}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">{t('example2Title')}</h3>
              <p className="text-sm text-muted-foreground">{t('example2Detail')}</p>
            </div>
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
