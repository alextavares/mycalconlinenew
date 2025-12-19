'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Scale,
  ArrowLeftRight,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

type WeightUnit = 'mg' | 'g' | 'kg' | 'oz' | 'lb' | 'st' | 'ton' | 'tonne';

interface Unit {
  id: WeightUnit;
  name: string;
  symbol: string;
  toGrams: number;
}

const weightUnits: Unit[] = [
  { id: 'mg', name: 'Milligram', symbol: 'mg', toGrams: 0.001 },
  { id: 'g', name: 'Gram', symbol: 'g', toGrams: 1 },
  { id: 'kg', name: 'Kilogram', symbol: 'kg', toGrams: 1000 },
  { id: 'oz', name: 'Ounce', symbol: 'oz', toGrams: 28.3495 },
  { id: 'lb', name: 'Pound', symbol: 'lb', toGrams: 453.592 },
  { id: 'st', name: 'Stone', symbol: 'st', toGrams: 6350.29 },
  { id: 'ton', name: 'US Ton', symbol: 'ton', toGrams: 907185 },
  { id: 'tonne', name: 'Metric Tonne', symbol: 't', toGrams: 1000000 },
];

export default function WeightClientPage() {
  const t = useTranslations('WeightConverter');

  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<WeightUnit>('kg');
  const [toUnit, setToUnit] = useState<WeightUnit>('lb');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howTo: false,
    references: false,
    faq: false
  });

  const getUnit = (id: WeightUnit): Unit => {
    return weightUnits.find(u => u.id === id) || weightUnits[2];
  };

  const convert = (value: number, from: Unit, to: Unit): number => {
    const grams = value * from.toGrams;
    return grams / to.toGrams;
  };

  const result = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return null;

    const from = getUnit(fromUnit);
    const to = getUnit(toUnit);
    const converted = convert(value, from, to);

    // Calculate all conversions
    const allConversions: Record<WeightUnit, number> = {} as Record<WeightUnit, number>;
    weightUnits.forEach(unit => {
      allConversions[unit.id] = convert(value, from, unit);
    });

    return {
      value: converted,
      from,
      to,
      allConversions
    };
  }, [inputValue, fromUnit, toUnit]);

  const formatNumber = (value: number): string => {
    if (Math.abs(value) < 0.0001 || Math.abs(value) >= 1000000) {
      return value.toExponential(4);
    }
    if (Number.isInteger(value)) return value.toString();

    // Smart decimal places based on magnitude
    if (Math.abs(value) < 0.01) return value.toFixed(6);
    if (Math.abs(value) < 1) return value.toFixed(4);
    if (Math.abs(value) < 100) return value.toFixed(2);
    return value.toFixed(1);
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const quickWeights = [
    { label: '1 oz', value: 1, unit: 'oz' as WeightUnit },
    { label: '1 lb', value: 1, unit: 'lb' as WeightUnit },
    { label: '1 kg', value: 1, unit: 'kg' as WeightUnit },
    { label: '100 kg', value: 100, unit: 'kg' as WeightUnit },
  ];

  // Common conversions display
  const commonConversions = [
    { from: 'kg', to: 'lb' },
    { from: 'lb', to: 'kg' },
    { from: 'oz', to: 'g' },
    { from: 'g', to: 'oz' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-green-100 rounded-2xl mb-4">
            <Scale className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Quick Weight Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('quickWeights')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {quickWeights.map((qw, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputValue(qw.value.toString());
                    setFromUnit(qw.unit);
                  }}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  {qw.label}
                </button>
              ))}
            </div>
          </div>

          {/* From Weight */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('from')}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-colors"
                placeholder="0"
                step="any"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value as WeightUnit)}
                className="px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-colors"
              >
                {weightUnits.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center my-4">
            <button
              onClick={handleSwap}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              title={t('swap')}
            >
              <ArrowLeftRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* To Weight */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('to')}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="px-4 py-3 text-lg border-2 border-gray-200 rounded-xl bg-gray-50 flex items-center">
                <span className="text-2xl font-bold text-green-600">
                  {result !== null ? formatNumber(result.value) : '-'}
                </span>
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value as WeightUnit)}
                className="px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-colors"
              >
                {weightUnits.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* All Conversions */}
          {result && (
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">{t('allConversions')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {weightUnits.slice(0, 6).map(unit => (
                  <div
                    key={unit.id}
                    className={`p-3 rounded-xl border-2 ${
                      unit.id === toUnit
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div className="text-xs text-gray-500 mb-1">{unit.name}</div>
                    <div className={`text-lg font-bold ${
                      unit.id === toUnit ? 'text-green-600' : 'text-gray-700'
                    }`}>
                      {formatNumber(result.allConversions[unit.id])} {unit.symbol}
                    </div>
                  </div>
                ))}
              </div>

              {/* Formula */}
              <div className="mt-4 p-3 bg-green-50 rounded-xl">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-700">
                    <p className="font-medium mb-1">{t('formula')}:</p>
                    <p className="font-mono text-xs">
                      1 {result.from.symbol} = {formatNumber(result.from.toGrams / result.to.toGrams)} {result.to.symbol}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content Sections */}
        <div className="space-y-4">
          {/* What Is Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('whatIs')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('whatIs.title')}</h2>
              {expandedSections.whatIs ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.whatIs && (
              <div className="px-6 pb-6">
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('whatIs.content') }}
                />
              </div>
            )}
          </div>

          {/* How To Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('howTo')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('howTo.title')}</h2>
              {expandedSections.howTo ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.howTo && (
              <div className="px-6 pb-6">
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('howTo.content') }}
                />
              </div>
            )}
          </div>

          {/* Reference Weights Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('references')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('references.title')}</h2>
              {expandedSections.references ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.references && (
              <div className="px-6 pb-6">
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('references.content') }}
                />
              </div>
            )}
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('faq')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('faq.title')}</h2>
              {expandedSections.faq ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.faq && (
              <div className="px-6 pb-6 space-y-4">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num} className="border-b border-gray-100 pb-4 last:border-0">
                    <h3 className="font-medium text-gray-900 mb-2">{t(`faq.q${num}`)}</h3>
                    <p className="text-gray-600 text-sm">{t(`faq.a${num}`)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}