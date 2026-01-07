'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import {
  Search,
  Calculator,
  TrendingUp,
  HeartPulse,
  CalendarDays,
  Ruler,
  ArrowLeftRight,
  BarChart3,
  MoreHorizontal,
  ChevronRight,
} from 'lucide-react';
import { calculators } from '@/config/calculators';

// Derive slugs dynamically from the single source of truth
const calculatorSlugs = Object.keys(calculators);

// Category mapping is now derived directly from the calculator object in `allCalculators` logic below.
// We remove the hardcoded map.

const categoryOrder = [
  'mathematics', 'math', 'finance', 'health', 'fitness', 'physics', 'statistics',
  'geometry', 'calendar', 'conversion', 'everyday', 'other', 'others'
];

// Category icons mapping
const categoryIcons: { [key: string]: React.ElementType } = {
  mathematics: Calculator,
  math: Calculator,
  finance: TrendingUp,
  health: HeartPulse,
  fitness: HeartPulse,
  statistics: BarChart3,
  geometry: Ruler,
  calendar: CalendarDays,
  converters: ArrowLeftRight,
  conversion: ArrowLeftRight,
  physics: MoreHorizontal,
  chemistry: MoreHorizontal,
  construction: MoreHorizontal,
  food: MoreHorizontal,
  everyday: MoreHorizontal,
  sports: MoreHorizontal,
  ecology: MoreHorizontal,
  biology: HeartPulse,
  education: Calculator,
  other: MoreHorizontal,
  others: MoreHorizontal,
};

// Category colors (matching Omni Calculator style)
const categoryColors: { [key: string]: { bg: string; text: string; border: string } } = {
  mathematics: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  math: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  finance: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  health: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
  fitness: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  statistics: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200' },
  geometry: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  calendar: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
  converters: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  conversion: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  physics: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
  everyday: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200' },
  other: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
  others: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
};

// Category card component
const CategoryCard = ({
  categoryKey,
  count,
  locale
}: {
  categoryKey: string;
  count: number;
  locale: string;
}) => {
  const tl = useTranslations('Layout');
  const Icon = categoryIcons[categoryKey] || Calculator;
  const colors = categoryColors[categoryKey] || categoryColors.others;

  return (
    <Link
      href={`/${locale}#${categoryKey}`}
      className={`group flex items-center gap-4 p-5 rounded-xl border ${colors.border} ${colors.bg} hover:shadow-md transition-all duration-200`}
    >
      <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${colors.bg} ${colors.text}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{tl(`categories.${categoryKey}`)}</h3>
        <p className="text-sm text-gray-500">{count} calculators</p>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
    </Link>
  );
};

// Calculator list item component (cleaner design)
const CalculatorListItem = ({
  title,
  description,
  link,
  categoryKey,
}: {
  title: string;
  description: string;
  link: string;
  categoryKey: string;
}) => {
  const colors = categoryColors[categoryKey] || categoryColors.others;

  return (
    <Link
      href={link}
      className="group block p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors truncate">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {description}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary flex-shrink-0 mt-1 transition-colors" />
      </div>
    </Link>
  );
};

export default function HomePage() {
  const t = useTranslations('HomePage');
  const tc = useTranslations('Calculators');
  const tl = useTranslations('Layout');
  const locale = useLocale();
  const [searchTerm, setSearchTerm] = useState('');

  // Build calculator data from config
  const allCalculators = useMemo(() => {
    return calculatorSlugs.map(slug => {
      const config = calculators[slug];
      if (!config) return null;

      // Use config title/desc as fallback, try to translate if needed
      let title = config.title;
      let description = config.description;

      // Try translations but fallback to English config
      try {
        const translatedTitle = tc.raw(`${slug}.title`);
        // STRICTER CHECK: Reject if it looks like a key (has dots, no spaces) or contains 'Calculators.'
        const isSuspiciousKey = (text: string) => {
          return text.includes('Calculators.') ||
            text.endsWith('.title') ||
            text.endsWith('.description') ||
            (!text.includes(' ') && text.includes('.'));
        };

        if (translatedTitle &&
          typeof translatedTitle === 'string' &&
          translatedTitle !== slug &&
          !isSuspiciousKey(translatedTitle) &&
          translatedTitle.length > 0) {
          title = translatedTitle;
        }

        const translatedDesc = tc.raw(`${slug}.description`);
        if (translatedDesc &&
          typeof translatedDesc === 'string' &&
          !isSuspiciousKey(translatedDesc) &&
          translatedDesc.length > 0) {
          description = translatedDesc;
        }
      } catch { }

      return {
        slug,
        title,
        description,
        link: `/${locale}/calculator/${slug}`,
        categoryKey: config.category
      };
    }).filter(c => c !== null).sort((a, b) => a!.title.localeCompare(b!.title, locale, { sensitivity: 'base' }));
  }, [locale, tc]);

  // Filter calculators
  const filteredCalculators = useMemo(() => {
    if (!searchTerm) return allCalculators;
    const lower = searchTerm.toLowerCase();
    return allCalculators.filter(calc =>
      calc.title.toLowerCase().includes(lower) ||
      calc.description.toLowerCase().includes(lower)
    );
  }, [searchTerm, allCalculators]);

  // Group by category
  const calculatorsByCategory = useMemo(() => {
    const grouped: { [key: string]: typeof allCalculators } = {};
    filteredCalculators.forEach(calc => {
      if (!grouped[calc.categoryKey]) grouped[calc.categoryKey] = [];
      grouped[calc.categoryKey].push(calc);
    });
    return grouped;
  }, [filteredCalculators]);

  // Count calculators per category (for category cards)
  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    allCalculators.forEach(calc => {
      counts[calc.categoryKey] = (counts[calc.categoryKey] || 0) + 1;
    });
    return counts;
  }, [allCalculators]);

  const totalCalculators = allCalculators.length;
  const categoriesToDisplay = categoryOrder.filter(cat => calculatorsByCategory[cat]?.length > 0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-white py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('description')}
          </p>

          {/* Search Bar - Prominent */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-primary shadow-sm focus:shadow-md transition-all"
            />
          </div>

          {/* Stats */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <strong className="text-gray-900">{totalCalculators}</strong> calculators
            </span>
            <span className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <strong className="text-gray-900">{categoryOrder.length}</strong> categories
            </span>
          </div>
        </div>
      </section>

      {/* Category Grid - Only show when not searching */}
      {!searchTerm && (
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Browse by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryOrder.map(categoryKey => (
                <CategoryCard
                  key={categoryKey}
                  categoryKey={categoryKey}
                  count={categoryCounts[categoryKey] || 0}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Calculators List */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          {categoriesToDisplay.length > 0 ? (
            categoriesToDisplay.map(categoryKey => {
              const Icon = categoryIcons[categoryKey] || Calculator;
              const colors = categoryColors[categoryKey] || categoryColors.others;

              return (
                <div key={categoryKey} id={categoryKey} className="mb-10 scroll-mt-20">
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${colors.bg} ${colors.text}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {tl(`categories.${categoryKey}`)}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {calculatorsByCategory[categoryKey]?.length || 0} calculators
                      </p>
                    </div>
                  </div>

                  {/* Calculator Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {calculatorsByCategory[categoryKey]?.map(calc => (
                      <CalculatorListItem
                        key={calc.slug}
                        title={calc.title}
                        description={calc.description}
                        link={calc.link}
                        categoryKey={calc.categoryKey}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          ) : searchTerm ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t('noResultsFound', { searchTerm })}</p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
