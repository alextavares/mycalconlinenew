'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button'; // Import Button
import { ClickFeedbackButton } from '@/components/ui/click-feedback-button';
import {
  ArrowRight,
  Percent,
  Calculator,
  TrendingUp,
  HeartPulse,
  CalendarDays,
  Divide,
  Ruler,
  Sigma,
  ArrowLeftRight,
  Hash,
  MousePointerClick,
  Binary,
  Clock,
  Car,
  Text,
  CalendarPlus,
  CalendarMinus,
  Scale,
  Square,
  Circle,
  Pyramid,
  Globe,
  Parentheses, // Placeholder for Fractions
  SquareFunction, // Placeholder for Square Area types
  Users, // Placeholder for Age
  Fuel, // Placeholder for Gasoline
  ScanText, // Placeholder for Word Counter
  BookType, // Placeholder for Roman Numerals
  Baseline, // Placeholder for Mean/Median/Mode, StdDev, Variance
  DollarSign // Added for Currency Converter
} from 'lucide-react';

// Define the types for calculator data
interface CalculatorInfo {
  slug: string;
  title: string;
  description: string;
  link: string;
  categoryKey: string;
}

// --- Data Generation Constants ---
const calculatorSlugs = [
  "adicionar-subtrair-dias", "area-cilindro", "area-circulo", "area-cubo",
  "area-esfera", "area-quadrado", "area-quadrado-imagem", "area-quadrado-nova",
  "binario", "click-counter", "como-calcular-horas-extras", "currency-converter", // Added currency-converter
  "desvio-padrao", "dias-entre-datas", "fracoes", "gasto-gasolina",
  "gerador-escala-notas", "gordura-corporal", "hexadecimal", "hora-minuto",
  "horas-trabalhadas", "idade", "juros-compostos", "juros-simples",
  "media-mediana-moda", "media-ponderada", "mmc", "porcentagem", "regra-de-3",
  "relacao-pf", "romano-decimal", "taxa-metabolica-basal",
  "variancia-estatistica", "word-counter"
];

const categoryMap: { [key: string]: string } = {
  'fracoes': 'mathematics', 'mmc': 'mathematics', 'porcentagem': 'mathematics',
  'regra-de-3': 'mathematics', 'media-ponderada': 'mathematics',
  'area-cilindro': 'geometry', 'area-circulo': 'geometry', 'area-cubo': 'geometry',
  'area-esfera': 'geometry', 'area-quadrado': 'geometry',
  'area-quadrado-imagem': 'geometry', 'area-quadrado-nova': 'geometry',
  'desvio-padrao': 'statistics', 'media-mediana-moda': 'statistics',
  'variancia-estatistica': 'statistics',
  'juros-compostos': 'finance', 'juros-simples': 'finance',
  'gordura-corporal': 'health', 'taxa-metabolica-basal': 'health',
  'relacao-pf': 'health',
  'adicionar-subtrair-dias': 'calendar', 'dias-entre-datas': 'calendar',
  'hora-minuto': 'calendar', 'horas-trabalhadas': 'calendar', 'idade': 'calendar',
  'como-calcular-horas-extras': 'calendar', // Keep in calendar for now
  'binario': 'converters', 'hexadecimal': 'converters', 'romano-decimal': 'converters',
  'currency-converter': 'converters', // Added currency-converter to converters category
  'click-counter': 'others', 'gasto-gasolina': 'others',
  'gerador-escala-notas': 'others', 'word-counter': 'others',
};

const categoryOrder = [
  'mathematics', 'geometry', 'statistics', 'finance',
  'health', 'calendar', 'converters', 'others'
];

// Map calculator slugs to icons
const iconMap: { [key: string]: React.ElementType } = {
  'media-ponderada': Scale,
  'porcentagem': Percent,
  'regra-de-3': Calculator, // Or possibly Scale3d
  'mmc': Hash,
  'fracoes': Parentheses, // Placeholder
  'binario': Binary,
  'hexadecimal': Hash, // Could use a different one, maybe Binary again?
  'area-cilindro': Pyramid, // Placeholder
  'area-circulo': Circle,
  'area-cubo': Square, // Placeholder for cube
  'area-esfera': Globe,
  'area-quadrado': SquareFunction,
  'area-quadrado-imagem': SquareFunction,
  'area-quadrado-nova': SquareFunction,
  'taxa-metabolica-basal': HeartPulse,
  'gordura-corporal': HeartPulse, // Or Scale
  'relacao-pf': HeartPulse,
  'dias-entre-datas': CalendarDays,
  'idade': Users,
  'adicionar-subtrair-dias': CalendarPlus,
  'hora-minuto': Clock,
  'horas-trabalhadas': Clock, // Or CalendarClock
  'gerador-escala-notas': Ruler,
  'gasto-gasolina': Fuel,
  'word-counter': ScanText,
  'romano-decimal': BookType,
  'click-counter': MousePointerClick,
  'como-calcular-horas-extras': Clock, // Relates to hours
  'desvio-padrao': Baseline, // Placeholder
  'juros-compostos': TrendingUp,
  'juros-simples': TrendingUp,
  'media-mediana-moda': Baseline, // Placeholder
  'variancia-estatistica': Baseline, // Placeholder
  'currency-converter': DollarSign, // Added icon for currency converter
  'default': Calculator // Default icon if none specific
};

// --- End Data Generation Constants ---

// Component for rendering each calculator item with title, description, icon, and button
const CalculatorItem = ({ title, description, link, categoryKey, slug, buttonText }: {
  title: string;
  description: string;
  link: string;
  categoryKey: string;
  slug: string;
  buttonText: string;
}) => {
  let borderClass = 'border-l-red-500'; // Default red from example
  let iconColorClass = 'text-red-500';
  let iconBgClass = 'bg-red-500/10'; // Use opacity for background
  let buttonBgClass = 'bg-red-500 hover:bg-red-600';

  switch (categoryKey) {
    case 'mathematics':
      // Uses red/orange from example for specific math calculators
      if (slug === 'mmc') {
        borderClass = 'border-l-blue-500';
        iconColorClass = 'text-blue-500';
        iconBgClass = 'bg-blue-500/10';
        buttonBgClass = 'bg-blue-500 hover:bg-blue-600';
      } else if (slug === 'porcentagem') {
        borderClass = 'border-l-green-500';
        iconColorClass = 'text-green-500';
        iconBgClass = 'bg-green-500/10';
        buttonBgClass = 'bg-green-500 hover:bg-green-600';
      } else if (slug === 'regra-de-3') {
        borderClass = 'border-l-purple-500';
        iconColorClass = 'text-purple-500';
        iconBgClass = 'bg-purple-500/10';
        buttonBgClass = 'bg-purple-500 hover:bg-purple-600';
      } else if (slug === 'media-ponderada') {
        borderClass = 'border-l-yellow-500';
        iconColorClass = 'text-yellow-500';
        iconBgClass = 'bg-yellow-500/10';
        buttonBgClass = 'bg-yellow-500 hover:bg-yellow-600';
      } else { // Default for other math (like fractions)
        borderClass = 'border-l-red-500';
        iconColorClass = 'text-red-500';
        iconBgClass = 'bg-red-500/10';
        buttonBgClass = 'bg-red-500 hover:bg-red-600';
      }
      break;
    case 'geometry':
      borderClass = 'border-l-indigo-500'; // Choose a color for geometry
      iconColorClass = 'text-indigo-500';
      iconBgClass = 'bg-indigo-500/10';
      buttonBgClass = 'bg-indigo-500 hover:bg-indigo-600';
      break;
    case 'statistics':
      borderClass = 'border-l-pink-500'; // Choose a color for statistics
      iconColorClass = 'text-pink-500';
      iconBgClass = 'bg-pink-500/10';
      buttonBgClass = 'bg-pink-500 hover:bg-pink-600';
      break;
    case 'finance':
      borderClass = 'border-l-teal-500'; // Choose a color for finance
      iconColorClass = 'text-teal-500';
      iconBgClass = 'bg-teal-500/10';
      buttonBgClass = 'bg-teal-500 hover:bg-teal-600';
      break;
    case 'health':
      borderClass = 'border-l-green-500'; // Use green similar to percentage
      iconColorClass = 'text-green-500';
      iconBgClass = 'bg-green-500/10';
      buttonBgClass = 'bg-green-500 hover:bg-green-600';
      break;
    case 'calendar':
      borderClass = 'border-l-blue-500'; // Use blue similar to MMC
      iconColorClass = 'text-blue-500';
      iconBgClass = 'bg-blue-500/10';
      buttonBgClass = 'bg-blue-500 hover:bg-blue-600';
      break;
    case 'converters':
      borderClass = 'border-l-purple-500'; // Use purple similar to rule-of-three
      iconColorClass = 'text-purple-500';
      iconBgClass = 'bg-purple-500/10';
      buttonBgClass = 'bg-purple-500 hover:bg-purple-600';
      break;
    case 'others':
      borderClass = 'border-l-gray-500'; // Default gray for others
      iconColorClass = 'text-gray-500';
      iconBgClass = 'bg-gray-500/10';
      buttonBgClass = 'bg-gray-500 hover:bg-gray-600';
      break;
    default:
      // Keep default red
      break;
  }

  const IconComponent = iconMap[slug] || iconMap['default'];

  return (
    <div className={`calculator-card flex flex-col bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out border-l-4 ${borderClass} group hover:-translate-y-1 cursor-pointer`}>
      <div className="flex items-center mb-4 calculator-header">
        <div className={`flex items-center justify-center w-14 h-14 rounded-full mr-4 ${iconBgClass} calculator-icon transition-transform duration-300 group-hover:scale-110`}>
          <IconComponent className={`w-7 h-7 ${iconColorClass} transition-transform duration-300 group-hover:rotate-12`} />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 calculator-title">{title}</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6 flex-grow calculator-description">{description}</p>
      <ClickFeedbackButton
        href={link}
        variant="default"
        className={`w-full justify-center text-white font-medium py-2.5 px-4 rounded-lg text-xs uppercase tracking-wider mt-auto transition-colors duration-200 ease-in-out ${buttonBgClass} calculator-button`}
      >
        {buttonText}
      </ClickFeedbackButton>
    </div>
  );
}

export default function HomePage() {
  const t = useTranslations('HomePage');
  const tc = useTranslations('Calculators');
  const tl = useTranslations('Layout');
  const locale = useLocale();
  const [searchTerm, setSearchTerm] = useState('');

  const allCalculators = useMemo(() => {
    return calculatorSlugs
      .map(slug => {
        const categoryKey = categoryMap[slug] || 'others';
        const titleKey = `${slug}.title`;
        const descriptionKey = `${slug}.description`;

        // Try fetching translation, fallback to formatted slug
        let title = slug.replace(/-/g, ' ');
        try {
          const translatedTitle = tc.raw(titleKey);
          if (typeof translatedTitle === 'string' && translatedTitle !== titleKey) {
            title = translatedTitle;
          }
        } catch (e) {
          // console.warn(`Missing translation for title: Calculators.${titleKey}`);
        }

        // Try fetching translation, fallback to placeholder
        let description = 'Calculator description missing.';
        try {
          const translatedDescription = tc.raw(descriptionKey);
          if (typeof translatedDescription === 'string' && translatedDescription !== descriptionKey) {
            description = translatedDescription;
          }
        } catch (e) {
          // console.warn(`Missing translation for description: Calculators.${descriptionKey}`);
        }

        return {
          slug,
          title,
          description,
          link: `/${locale}/calculator/${slug}`,
          categoryKey,
        };
      })
      .sort((a, b) => {
        return a.title.localeCompare(b.title, locale, { sensitivity: 'base' });
      });
  }, [locale, tc]);


  const filteredCalculators = useMemo(() => {
      if (!searchTerm) return allCalculators;
      const lowerSearchTerm = searchTerm.toLowerCase();
      return allCalculators.filter(calc =>
          calc.title.toLowerCase().includes(lowerSearchTerm) ||
          calc.description.toLowerCase().includes(lowerSearchTerm)
      );
  }, [searchTerm, allCalculators]);

  const calculatorsByCategory = useMemo(() => {
      const grouped: { [key: string]: CalculatorInfo[] } = {};
      filteredCalculators.forEach(calc => {
          if (!grouped[calc.categoryKey]) {
              grouped[calc.categoryKey] = [];
          }
          grouped[calc.categoryKey].push(calc);
      });
      return grouped;
  }, [filteredCalculators]);

  const categoriesToDisplay = categoryOrder.filter(categoryKey => calculatorsByCategory[categoryKey]?.length > 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center text-gray-800">{t('title')}</h1>
      <p className="text-center text-gray-600 mb-6 text-sm md:text-base">{t('description')}</p>

      <div className="mb-8 max-w-lg mx-auto">
        <Input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {categoriesToDisplay.length > 0 ? (
        categoriesToDisplay.map(categoryKey => (
          <div key={categoryKey} className="mb-10">
            {/* Adjusted category title styling */}
            <h2 className="text-2xl font-semibold mb-5 text-gray-700 border-b-2 border-gray-300 pb-2">{tl(`categories.${categoryKey}`)}</h2>
            {/* Grid using Tailwind classes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {calculatorsByCategory[categoryKey].map((calc) => (
                <CalculatorItem
                  key={calc.slug}
                  slug={calc.slug}
                  title={calc.title}
                  description={calc.description}
                  link={calc.link}
                  categoryKey={calc.categoryKey}
                  buttonText={t('useCalculatorButton')} // Pass translated button text
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        searchTerm && (
          <p className="text-center text-gray-500 col-span-full">
            {t('noResultsFound', { searchTerm: searchTerm })}
          </p>
        )
      )}

      {!searchTerm && filteredCalculators.length === 0 && (
        <p className="text-center text-gray-500 col-span-full">
          {t('noCalculatorsAvailable')}
        </p>
      )}
    </div>
  );
}
