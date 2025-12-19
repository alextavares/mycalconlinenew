'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Thermometer,
  Snowflake,
  Flame,
  Sun,
  ChevronDown,
  ChevronUp,
  ArrowLeftRight,
  Info
} from 'lucide-react';

type TempUnit = 'celsius' | 'fahrenheit' | 'kelvin';

interface Temperature {
  value: number;
  unit: TempUnit;
}

interface TempReference {
  celsius: number;
  label: string;
  category: 'extreme-cold' | 'cold' | 'cool' | 'moderate' | 'warm' | 'hot' | 'extreme-hot';
}

const tempReferences: TempReference[] = [
  { celsius: -273.15, label: 'Absolute Zero', category: 'extreme-cold' },
  { celsius: -40, label: 'Extremely Cold', category: 'extreme-cold' },
  { celsius: 0, label: 'Water Freezes', category: 'cold' },
  { celsius: 10, label: 'Cool Day', category: 'cool' },
  { celsius: 20, label: 'Room Temperature', category: 'moderate' },
  { celsius: 37, label: 'Body Temperature', category: 'warm' },
  { celsius: 100, label: 'Water Boils', category: 'hot' },
  { celsius: 150, label: 'Oven Temperature', category: 'extreme-hot' },
];

export default function TemperatureClientPage() {
  const t = useTranslations('TemperatureConverter');

  const [inputValue, setInputValue] = useState<string>('25');
  const [fromUnit, setFromUnit] = useState<TempUnit>('celsius');
  const [toUnit, setToUnit] = useState<TempUnit>('fahrenheit');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howTo: false,
    references: false,
    faq: false
  });

  const units = [
    { id: 'celsius', name: 'Celsius', symbol: '°C', icon: Thermometer, color: 'blue' },
    { id: 'fahrenheit', name: 'Fahrenheit', symbol: '°F', icon: Thermometer, color: 'red' },
    { id: 'kelvin', name: 'Kelvin', symbol: 'K', icon: Snowflake, color: 'purple' },
  ];

  // Convert to Celsius as base
  const toCelsius = (value: number, unit: TempUnit): number => {
    switch (unit) {
      case 'celsius':
        return value;
      case 'fahrenheit':
        return (value - 32) * 5/9;
      case 'kelvin':
        return value - 273.15;
    }
  };

  // Convert from Celsius to target unit
  const fromCelsius = (celsius: number, unit: TempUnit): number => {
    switch (unit) {
      case 'celsius':
        return celsius;
      case 'fahrenheit':
        return celsius * 9/5 + 32;
      case 'kelvin':
        return celsius + 273.15;
    }
  };

  const result = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return null;

    const celsius = toCelsius(value, fromUnit);
    const converted = fromCelsius(celsius, toUnit);

    // Get all conversions
    const allConversions = {
      celsius: fromCelsius(celsius, 'celsius'),
      fahrenheit: fromCelsius(celsius, 'fahrenheit'),
      kelvin: fromCelsius(celsius, 'kelvin'),
    };

    // Find category
    let category: TempReference['category'] = 'moderate';
    if (celsius < -40) category = 'extreme-cold';
    else if (celsius < 0) category = 'cold';
    else if (celsius < 15) category = 'cool';
    else if (celsius < 25) category = 'moderate';
    else if (celsius < 35) category = 'warm';
    else if (celsius < 80) category = 'hot';
    else category = 'extreme-hot';

    // Find nearest reference
    const nearest = tempReferences.reduce((prev, curr) =>
      Math.abs(curr.celsius - celsius) < Math.abs(prev.celsius - celsius) ? curr : prev
    );

    return {
      value: converted,
      celsius,
      allConversions,
      category,
      nearest
    };
  }, [inputValue, fromUnit, toUnit]);

  const formatNumber = (value: number): string => {
    if (Number.isInteger(value)) return value.toString();
    return value.toFixed(2).replace(/\.?0+$/, '');
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const getCategoryColor = (category: TempReference['category']): string => {
    const colors = {
      'extreme-cold': 'bg-blue-900 text-blue-100',
      'cold': 'bg-blue-600 text-white',
      'cool': 'bg-blue-400 text-white',
      'moderate': 'bg-green-500 text-white',
      'warm': 'bg-orange-400 text-white',
      'hot': 'bg-red-500 text-white',
      'extreme-hot': 'bg-red-900 text-white',
    };
    return colors[category];
  };

  const getCategoryIcon = (category: TempReference['category']) => {
    if (category.includes('cold')) return <Snowflake className="w-5 h-5" />;
    if (category.includes('hot') || category === 'warm') return <Flame className="w-5 h-5" />;
    return <Sun className="w-5 h-5" />;
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const quickTemps = [
    { label: 'Freezing', celsius: 0 },
    { label: 'Room Temp', celsius: 20 },
    { label: 'Body Temp', celsius: 37 },
    { label: 'Boiling', celsius: 100 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Quick Temperature Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('quickTemperatures')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {quickTemps.map(temp => (
                <button
                  key={temp.label}
                  onClick={() => {
                    setInputValue(fromCelsius(temp.celsius, fromUnit).toString());
                  }}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  {temp.label}
                </button>
              ))}
            </div>
          </div>

          {/* From Temperature */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('from')}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                placeholder="0"
                step="any"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value as TempUnit)}
                className="px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
              >
                {units.map(unit => (
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

          {/* To Temperature */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('to')}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="px-4 py-3 text-lg border-2 border-gray-200 rounded-xl bg-gray-50 flex items-center">
                <span className="text-2xl font-bold text-blue-600">
                  {result !== null ? formatNumber(result.value) : '-'}
                </span>
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value as TempUnit)}
                className="px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
              >
                {units.map(unit => (
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
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getCategoryColor(result.category)}`}>
                  {getCategoryIcon(result.category)}
                  <span className="text-sm font-medium">{result.nearest.label}</span>
                </div>
              </div>

              {/* All Units */}
              <h3 className="text-sm font-medium text-gray-700 mb-3">{t('allConversions')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Celsius</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatNumber(result.allConversions.celsius)}°C
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-red-700">Fahrenheit</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    {formatNumber(result.allConversions.fahrenheit)}°F
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Snowflake className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">Kelvin</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatNumber(result.allConversions.kelvin)} K
                  </p>
                </div>
              </div>

              {/* Formula */}
              <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">{t('formula')}:</p>
                    <p className="font-mono text-xs">
                      {fromUnit === 'celsius' && toUnit === 'fahrenheit' && '°F = °C × 9/5 + 32'}
                      {fromUnit === 'fahrenheit' && toUnit === 'celsius' && '°C = (°F - 32) × 5/9'}
                      {fromUnit === 'celsius' && toUnit === 'kelvin' && 'K = °C + 273.15'}
                      {fromUnit === 'kelvin' && toUnit === 'celsius' && '°C = K - 273.15'}
                      {fromUnit === 'fahrenheit' && toUnit === 'kelvin' && 'K = (°F - 32) × 5/9 + 273.15'}
                      {fromUnit === 'kelvin' && toUnit === 'fahrenheit' && '°F = (K - 273.15) × 9/5 + 32'}
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

          {/* Reference Temperatures Section */}
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
