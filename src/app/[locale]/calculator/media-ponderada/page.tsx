import MediaPonderadaClientPage from './media-ponderada-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ChevronRight, GraduationCap, Calculator, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mycalconline.com';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'WeightedAverageCalculator' });
  const currentYear = new Date().getFullYear();

  return {
    title: t('metadataTitle', { year: currentYear }),
    description: t('metadataDescription', { year: currentYear }),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/media-ponderada`,
      languages: {
        'en': `${siteUrl}/en/calculator/media-ponderada`,
        'es': `${siteUrl}/es/calculator/media-ponderada`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/media-ponderada`,
        'x-default': `${siteUrl}/en/calculator/media-ponderada`,
      },
    },
    openGraph: {
      title: t('metadataTitle', { year: currentYear }),
      description: t('metadataDescription', { year: currentYear }),
      url: `${siteUrl}/${params.locale}/calculator/media-ponderada`,
      siteName: 'MyCalcOnline',
      locale: params.locale,
      type: 'website',
    },
  };
}

export default async function MediaPonderadaPage({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: 'WeightedAverageCalculator' });
  const layoutT = await getTranslations({ locale: params.locale, namespace: 'Layout' });
  const currentYear = new Date().getFullYear();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t('title'),
    description: t('description'),
    url: `${siteUrl}/${params.locale}/calculator/media-ponderada`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    inLanguage: params.locale,
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
    <div className="container mx-auto p-4 max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <Link href={`/${params.locale}`} className="hover:text-primary">
          {layoutT('siteName')}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href={`/${params.locale}`} className="hover:text-primary">
          {layoutT('categories.statistics')}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-900 dark:text-gray-100">{t('breadcrumbTitle')}</span>
      </nav>

      {/* H1 Title */}
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {t('h1Title', { year: currentYear })}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('h1Subtitle')}
        </p>
      </header>

      {/* Calculator Component */}
      <MediaPonderadaClientPage />

      {/* SEO Content */}
      <div className="mt-8 space-y-8">
        {/* What is */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{t('whatIsTitle')}</h2>
          <p className="text-gray-700 dark:text-gray-300">{t('whatIsDetail')}</p>
        </section>

        {/* Formula */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{t('formulaTitle')}</h2>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="font-mono text-lg text-center mb-2">{t('formulaText')}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">{t('formulaExplanation')}</p>
          </div>
        </section>

        {/* How to Use */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{t('howToUseTitle')}</h2>
          <p className="text-gray-700 dark:text-gray-300">{t('howToUseDetail')}</p>
        </section>

        {/* Use Cases */}
        <section>
          <h2 className="text-xl font-semibold mb-4">{t('useCasesTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <GraduationCap className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-semibold mb-2">{t('useCaseSchoolTitle')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('useCaseSchoolDetail')}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-semibold mb-2">{t('useCaseFinanceTitle')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('useCaseFinanceDetail')}</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <Calculator className="h-8 w-8 text-orange-600 mb-2" />
              <h3 className="font-semibold mb-2">{t('useCaseResearchTitle')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('useCaseResearchDetail')}</p>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section>
          <h2 className="text-xl font-semibold mb-4">{t('examplesTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{t('example1Title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('example1Detail')}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{t('example2Title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('example2Detail')}</p>
            </div>
          </div>
        </section>

        {/* Difference from simple average */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{t('differenceTitle')}</h2>
          <p className="text-gray-700 dark:text-gray-300">{t('differenceDetail')}</p>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-semibold mb-4">{t('faqTitle')}</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{t('faqQ1')}</h3>
              <p className="text-gray-700 dark:text-gray-300">{t('faqA1')}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{t('faqQ2')}</h3>
              <p className="text-gray-700 dark:text-gray-300">{t('faqA2')}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{t('faqQ3')}</h3>
              <p className="text-gray-700 dark:text-gray-300">{t('faqA3')}</p>
            </div>
          </div>
        </section>

        {/* Related Calculators */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{t('relatedTitle')}</h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/${params.locale}/calculator/media-mediana-moda`}
              className="bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-full text-sm"
            >
              {t('relatedMeanMedianMode')}
            </Link>
            <Link
              href={`/${params.locale}/calculator/porcentagem`}
              className="bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-full text-sm"
            >
              {t('relatedPercentage')}
            </Link>
            <Link
              href={`/${params.locale}/calculator/desvio-padrao`}
              className="bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-full text-sm"
            >
              {t('relatedStandardDeviation')}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
