import MMCClientPage from './mmc-client-page';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'MMCCalculator' });
  const siteUrl = 'https://mycalconline.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    keywords: t('metadataKeywords'),
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/mmc`,
      languages: {
        'en': `${siteUrl}/en/calculator/mmc`,
        'es': `${siteUrl}/es/calculator/mmc`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/mmc`,
        'x-default': `${siteUrl}/es/calculator/mmc`,
      },
    },
    openGraph: {
      title: t('metadataTitle'),
      description: t('metadataDescription'),
      url: `${siteUrl}/${params.locale}/calculator/mmc`,
      siteName: 'MyCalcOnline',
      locale: params.locale,
      type: 'website',
    },
  };
}

export default async function MMCCalculatorPageContainer({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: 'MMCCalculator' });

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t('metadataTitle'),
    description: t('metadataDescription'),
    url: `https://mycalconline.com/${params.locale}/calculator/mmc`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: params.locale === 'pt-BR' ? 'BRL' : params.locale === 'es' ? 'MXN' : 'USD',
    },
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb for SEO */}
      <nav className="text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li><a href={`/${params.locale}`} className="hover:underline">Home</a></li>
          <li>/</li>
          <li className="text-foreground font-medium">{t('breadcrumbTitle')}</li>
        </ol>
      </nav>

      {/* Calculator Component */}
      <MMCClientPage />

      {/* SEO Content - Common examples with server-side rendering */}
      <div className="max-w-3xl mx-auto mt-8 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">{t('commonExamplesTitle')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { nums: [2, 3], mmc: 6 },
              { nums: [4, 6], mmc: 12 },
              { nums: [3, 5], mmc: 15 },
              { nums: [6, 8], mmc: 24 },
              { nums: [12, 18], mmc: 36 },
              { nums: [15, 20], mmc: 60 },
              { nums: [2, 3, 4], mmc: 12 },
              { nums: [3, 4, 5], mmc: 60 },
              { nums: [6, 8, 12], mmc: 24 },
            ].map(({ nums, mmc }) => (
              <div key={nums.join('-')} className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-sm text-muted-foreground">
                  {params.locale === 'es' ? 'MCM' : 'MMC'}({nums.join(', ')})
                </p>
                <p className="text-lg font-bold">{mmc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Additional SEO content about LCM/MCM */}
        <section>
          <h2 className="text-xl font-semibold mb-4">{t('methodsTitle')}</h2>
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p>{t('methodsDetail')}</p>
          </div>
        </section>

        {/* Use cases */}
        <section>
          <h2 className="text-xl font-semibold mb-4">{t('useCasesTitle')}</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t('useCase1')}</li>
            <li>{t('useCase2')}</li>
            <li>{t('useCase3')}</li>
            <li>{t('useCase4')}</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
