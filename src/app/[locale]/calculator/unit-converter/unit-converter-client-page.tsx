'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  ArrowLeftRight,
  Ruler,
  Weight,
  Thermometer,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';

type UnitCategory = 'length' | 'weight' | 'temperature';

interface Unit {
  id: string;
  name: string;
  symbol: string;
  toBase: number; // Multiplier to convert to base unit
  fromBase?: (value: number) => number; // Custom conversion from base (for temperature)
  toBaseCustom?: (value: number) => number; // Custom conversion to base (for temperature)
}

const lengthUnits: Unit[] = [
  { id: 'mm', name: 'Millimeter', symbol: 'mm', toBase: 0.001 },
  { id: 'cm', name: 'Centimeter', symbol: 'cm', toBase: 0.01 },
  { id: 'm', name: 'Meter', symbol: 'm', toBase: 1 },
  { id: 'km', name: 'Kilometer', symbol: 'km', toBase: 1000 },
  { id: 'in', name: 'Inch', symbol: 'in', toBase: 0.0254 },
  { id: 'ft', name: 'Foot', symbol: 'ft', toBase: 0.3048 },
  { id: 'yd', name: 'Yard', symbol: 'yd', toBase: 0.9144 },
  { id: 'mi', name: 'Mile', symbol: 'mi', toBase: 1609.34 },
];

const weightUnits: Unit[] = [
  { id: 'mg', name: 'Milligram', symbol: 'mg', toBase: 0.001 },
  { id: 'g', name: 'Gram', symbol: 'g', toBase: 1 },
  { id: 'kg', name: 'Kilogram', symbol: 'kg', toBase: 1000 },
  { id: 'oz', name: 'Ounce', symbol: 'oz', toBase: 28.3495 },
  { id: 'lb', name: 'Pound', symbol: 'lb', toBase: 453.592 },
  { id: 'ton', name: 'Ton (US)', symbol: 'ton', toBase: 907185 },
];

const temperatureUnits: Unit[] = [
  {
    id: 'c',
    name: 'Celsius',
    symbol: '°C',
    toBase: 1,
    toBaseCustom: (c) => c,
    fromBase: (c) => c
  },
  {
    id: 'f',
    name: 'Fahrenheit',
    symbol: '°F',
    toBase: 1,
    toBaseCustom: (f) => (f - 32) * 5/9,
    fromBase: (c) => c * 9/5 + 32
  },
  {
    id: 'k',
    name: 'Kelvin',
    symbol: 'K',
    toBase: 1,
    toBaseCustom: (k) => k - 273.15,
    fromBase: (c) => c + 273.15
  },
];

export default function UnitConverterClientPage() {
  const t = useTranslations('UnitConverter');

  const [category, setCategory] = useState<UnitCategory>('length');
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howTo: false,
    common: false,
    faq: false
  });

  const units = category === 'length' ? lengthUnits : category === 'weight' ? weightUnits : temperatureUnits;

  const result = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return null;

    const from = units.find(u => u.id === fromUnit);
    const to = units.find(u => u.id === toUnit);

    if (!from || !to) return null;

    // Temperature conversion (special case)
    if (category === 'temperature' && from.toBaseCustom && to.fromBase) {
      const baseValue = from.toBaseCustom(value);
      return to.fromBase(baseValue);
    }

    // Standard conversion
    const baseValue = value * from.toBase;
    return baseValue / to.toBase;
  }, [inputValue, fromUnit, toUnit, category, units]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleClear = () => {
    setInputValue('1');
    if (category === 'length') {
      setFromUnit('m');
      setToUnit('ft');
    } else if (category === 'weight') {
      setFromUnit('kg');
      setToUnit('lb');
    } else {
      setFromUnit('c');
      setToUnit('f');
    }
  };

  const handleCategoryChange = (newCategory: UnitCategory) => {
    setCategory(newCategory);
    if (newCategory === 'length') {
      setFromUnit('m');
      setToUnit('ft');
    } else if (newCategory === 'weight') {
      setFromUnit('kg');
      setToUnit('lb');
    } else {
      setFromUnit('c');
      setToUnit('f');
    }
  };

  const formatNumber = (value: number): string => {
    if (Number.isInteger(value)) return value.toString();
    if (Math.abs(value) >= 1000000) return value.toExponential(4);
    if (Math.abs(value) < 0.0001 && value !== 0) return value.toExponential(4);
    return value.toFixed(6).replace(/\.?0+$/, '');
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
          {/* Category Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('selectCategory')}
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleCategoryChange('length')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                  category === 'length'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Ruler className="w-6 h-6" />
                <span className="text-sm font-medium">{t('length')}</span>
              </button>
              <button
                onClick={() => handleCategoryChange('weight')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                  category === 'weight'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Weight className="w-6 h-6" />
                <span className="text-sm font-medium">{t('weight')}</span>
              </button>
              <button
                onClick={() => handleCategoryChange('temperature')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                  category === 'temperature'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Thermometer className="w-6 h-6" />
                <span className="text-sm font-medium">{t('temperature')}</span>
              </button>
            </div>
          </div>

          {/* From Unit */}
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
                onChange={(e) => setFromUnit(e.target.value)}
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

          {/* To Unit */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('to')}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="px-4 py-3 text-lg border-2 border-gray-200 rounded-xl bg-gray-50 flex items-center">
                <span className="text-2xl font-bold text-blue-600">
                  {result !== null ? formatNumber(result) : '-'}
                </span>
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
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

          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {t('clear')}
          </button>

          {/* Quick Conversions */}
          {result !== null && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">{t('quickConversions')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {units.filter(u => u.id !== fromUnit).slice(0, 4).map(unit => {
                  let convertedValue: number;
                  const value = parseFloat(inputValue);
                  const from = units.find(u => u.id === fromUnit)!;

                  if (category === 'temperature' && from.toBaseCustom && unit.fromBase) {
                    const baseValue = from.toBaseCustom(value);
                    convertedValue = unit.fromBase(baseValue);
                  } else {
                    const baseValue = value * from.toBase;
                    convertedValue = baseValue / unit.toBase;
                  }

                  return (
                    <div key={unit.id} className="p-3 bg-gray-50 rounded-xl text-center">
                      <p className="text-xs text-gray-500 mb-1">{unit.name}</p>
                      <p className="text-sm font-bold text-gray-800">
                        {formatNumber(convertedValue)} {unit.symbol}
                      </p>
                    </div>
                  );
                })}
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

          {/* Common Conversions Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('common')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('common.title')}</h2>
              {expandedSections.common ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.common && (
              <div className="px-6 pb-6">
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('common.content') }}
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
