import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ChevronRight, Calendar, Clock, Briefcase } from 'lucide-react';
import Link from 'next/link';
import AdicionarSubtrairDiasClientPage from './adicionar-subtrair-dias-client-page';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mycalconline.com';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'AddSubtractDaysCalculator' });
  const currentYear = new Date().getFullYear();

  return {
    title: t('metadataTitle', { year: currentYear }),
    description: t('metadataDescription', { year: currentYear }),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/adicionar-subtrair-dias`,
      languages: {
        'pt-BR': `${siteUrl}/pt-BR/calculator/adicionar-subtrair-dias`,
        'es': `${siteUrl}/es/calculator/adicionar-subtrair-dias`,
        'en': `${siteUrl}/en/calculator/adicionar-subtrair-dias`,
      },
    },
    openGraph: {
      title: t('metadataTitle', { year: currentYear }),
      description: t('metadataDescription', { year: currentYear }),
      url: `${siteUrl}/${params.locale}/calculator/adicionar-subtrair-dias`,
      siteName: 'MyCalcOnline',
      locale: params.locale,
      type: 'website',
    },
  };
}

export default async function AdicionarSubtrairDiasPage({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: 'AddSubtractDaysCalculator' });
  const layoutT = await getTranslations({ locale: params.locale, namespace: 'Layout' });
  const currentYear = new Date().getFullYear();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t('title'),
    description: t('description'),
    url: `${siteUrl}/${params.locale}/calculator/adicionar-subtrair-dias`,
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
          {layoutT('categories.calendar')}
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
      <AdicionarSubtrairDiasClientPage />

      {/* SEO Content */}
      <div className="mt-8 space-y-8">
        {/* How to Use */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{t('howToUseTitle')}</h2>
          <p className="text-gray-700 dark:text-gray-300">{t('howToUseDetail')}</p>
        </section>

        {/* What Is */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{t('whatIsTitle')}</h2>
          <p className="text-gray-700 dark:text-gray-300">{t('whatIsDetail')}</p>
        </section>

        {/* Calculation Types */}
        <section>
          <h2 className="text-xl font-semibold mb-4">{t('typesTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <Calendar className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-semibold mb-2">{t('typeCalendarTitle')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('typeCalendarDetail')}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <Briefcase className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-semibold mb-2">{t('typeBusinessTitle')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('typeBusinessDetail')}</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <Clock className="h-8 w-8 text-orange-600 mb-2" />
              <h3 className="font-semibold mb-2">{t('typeSaturdayTitle')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('typeSaturdayDetail')}</p>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section>
          <h2 className="text-xl font-semibold mb-3">{t('useCasesTitle')}</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>{t('useCase1')}</li>
            <li>{t('useCase2')}</li>
            <li>{t('useCase3')}</li>
            <li>{t('useCase4')}</li>
            <li>{t('useCase5')}</li>
          </ul>
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
              href={`/${params.locale}/calculator/dias-entre-datas`}
              className="bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-full text-sm"
            >
              {t('relatedDaysBetween')}
            </Link>
            <Link
              href={`/${params.locale}/calculator/idade`}
              className="bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-full text-sm"
            >
              {t('relatedAge')}
            </Link>
            <Link
              href={`/${params.locale}/calculator/hora-minuto`}
              className="bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-full text-sm"
            >
              {t('relatedHourMinute')}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
