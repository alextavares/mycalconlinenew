import IdadeClientPage from './idade-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'AgeCalculator' });
  const siteUrl = 'https://mycalconline.com';
  const currentYear = new Date().getFullYear();

  return {
    title: t('metadataTitle', { year: currentYear }),
    description: t('metadataDescription', { year: currentYear }),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/idade`,
      languages: {
        'en': `${siteUrl}/en/calculator/idade`,
        'es': `${siteUrl}/es/calculator/idade`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/idade`,
        'x-default': `${siteUrl}/pt-BR/calculator/idade`,
      },
    },
    openGraph: {
      title: t('metadataTitle', { year: currentYear }),
      description: t('metadataDescription', { year: currentYear }),
      url: `${siteUrl}/${params.locale}/calculator/idade`,
      siteName: 'MyCalcOnline',
      locale: params.locale,
      type: 'website',
    },
  };
}

export default async function IdadeCalculatorPage({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: 'AgeCalculator' });
  const currentYear = new Date().getFullYear();

  // JSON-LD Schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t('metadataTitle', { year: currentYear }),
    description: t('metadataDescription', { year: currentYear }),
    url: `https://mycalconline.com/${params.locale}/calculator/idade`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: t('faqQ1'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('faqA1'),
        },
      },
      {
        '@type': 'Question',
        name: t('faqQ2'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('faqA2'),
        },
      },
      {
        '@type': 'Question',
        name: t('faqQ3'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('faqA3'),
        },
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

      {/* Breadcrumb for SEO */}
      <nav className="text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li><a href={`/${params.locale}`} className="hover:underline">Home</a></li>
          <li>/</li>
          <li className="text-foreground font-medium">{t('breadcrumbTitle')}</li>
        </ol>
      </nav>

      {/* Main H1 - Critical for SEO */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
        {t('h1Title', { year: currentYear })}
      </h1>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
        {t('h1Subtitle', { year: currentYear })}
      </p>

      {/* Calculator Component */}
      <IdadeClientPage />

      {/* SEO Content Section */}
      <div className="mt-12 space-y-8 max-w-4xl mx-auto">
        {/* How to use */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('howToUseTitle')}</h2>
          <div className="prose prose-gray max-w-none">
            <p>{t('howToUseDetail')}</p>
          </div>
        </section>

        {/* What is age calculator */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('whatIsTitle')}</h2>
          <div className="prose prose-gray max-w-none">
            <p>{t('whatIsDetail')}</p>
          </div>
        </section>

        {/* Common calculations with current year */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('commonCalculationsTitle', { year: currentYear })}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1990, 1995, 2000, 2005, 2010, 2015, 2020, 1985].map((birthYear) => (
              <div key={birthYear} className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">{t('bornIn')} {birthYear}</p>
                <p className="text-xl font-bold">{currentYear - birthYear} {t('yearsOld')}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
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
            <details className="border rounded-lg p-4 cursor-pointer">
              <summary className="font-medium">{t('faqQ4')}</summary>
              <p className="mt-2 text-muted-foreground">{t('faqA4')}</p>
            </details>
          </div>
        </section>

        {/* Additional SEO content */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('useCasesTitle')}</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t('useCase1')}</li>
            <li>{t('useCase2')}</li>
            <li>{t('useCase3')}</li>
            <li>{t('useCase4')}</li>
            <li>{t('useCase5')}</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
