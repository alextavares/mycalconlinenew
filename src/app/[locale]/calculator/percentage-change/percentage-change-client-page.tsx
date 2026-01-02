'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { TrendingUp, TrendingDown, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

export default function PercentageChangeClientPage() {
  const t = useTranslations('PercentageChangeCalculator');

  const [oldValue, setOldValue] = useState<string>('100');
  const [newValue, setNewValue] = useState<string>('150');

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howTo: false,
    examples: false,
    faq: false
  });

  const result = useMemo(() => {
    const old = parseFloat(oldValue);
    const newVal = parseFloat(newValue);

    if (isNaN(old) || isNaN(newVal) || old === 0) {
      return null;
    }

    const change = newVal - old;
    const percentageChange = (change / Math.abs(old)) * 100;
    const isIncrease = change > 0;
    const isDecrease = change < 0;

    return {
      oldValue: old,
      newValue: newVal,
      absoluteChange: change,
      percentageChange: percentageChange,
      isIncrease,
      isDecrease,
      isNoChange: change === 0
    };
  }, [oldValue, newValue]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const setQuickExample = (old: string, newVal: string) => {
    setOldValue(old);
    setNewValue(newVal);
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
          <div className="space-y-4">
            {/* Old Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('oldValue')}
              </label>
              <input
                type="number"
                value={oldValue}
                onChange={(e) => setOldValue(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                placeholder={t('oldValuePlaceholder')}
                step="any"
              />
            </div>

            {/* Arrow Icon */}
            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-gray-400" />
            </div>

            {/* New Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('newValue')}
              </label>
              <input
                type="number"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                placeholder={t('newValuePlaceholder')}
                step="any"
              />
            </div>

            {/* Quick Examples */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('quickExamples')}
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setQuickExample('100', '150')}
                  className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  100 → 150 (+50%)
                </button>
                <button
                  onClick={() => setQuickExample('200', '150')}
                  className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  200 → 150 (-25%)
                </button>
                <button
                  onClick={() => setQuickExample('50', '100')}
                  className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  50 → 100 (+100%)
                </button>
                <button
                  onClick={() => setQuickExample('80', '20')}
                  className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  80 → 20 (-75%)
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="mt-6 space-y-4">
              {/* Main Result */}
              <div className={`p-5 rounded-xl border-2 ${
                result.isIncrease ? 'bg-green-50 border-green-200' :
                result.isDecrease ? 'bg-red-50 border-red-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {result.isIncrease && <TrendingUp className="w-6 h-6 text-green-600" />}
                  {result.isDecrease && <TrendingDown className="w-6 h-6 text-red-600" />}
                  <div className={`text-sm font-medium ${
                    result.isIncrease ? 'text-green-600' :
                    result.isDecrease ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {result.isIncrease && t('increase')}
                    {result.isDecrease && t('decrease')}
                    {result.isNoChange && t('noChange')}
                  </div>
                </div>
                <div className={`text-4xl font-bold mb-2 ${
                  result.isIncrease ? 'text-green-900' :
                  result.isDecrease ? 'text-red-900' :
                  'text-gray-900'
                }`}>
                  {result.isIncrease && '+'}
                  {result.percentageChange.toFixed(2)}%
                </div>
                <div className={`text-sm ${
                  result.isIncrease ? 'text-green-700' :
                  result.isDecrease ? 'text-red-700' :
                  'text-gray-700'
                }`}>
                  {t('absoluteChange')}: {result.isIncrease && '+'}
                  {result.absoluteChange.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Original Value */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1">{t('originalValue')}</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.oldValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                </div>

                {/* New Value */}
                <div className={`p-4 rounded-xl border ${
                  result.isIncrease ? 'bg-green-50 border-green-200' :
                  result.isDecrease ? 'bg-red-50 border-red-200' :
                  'bg-gray-50 border-gray-200'
                }`}>
                  <div className={`text-xs mb-1 ${
                    result.isIncrease ? 'text-green-600' :
                    result.isDecrease ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {t('finalValue')}
                  </div>
                  <div className={`text-2xl font-bold ${
                    result.isIncrease ? 'text-green-900' :
                    result.isDecrease ? 'text-red-900' :
                    'text-gray-900'
                  }`}>
                    {result.newValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Formula */}
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="text-sm text-purple-600 font-medium mb-2">{t('formula')}</div>
                <div className="text-sm text-purple-900 font-mono">
                  ({result.newValue} - {result.oldValue}) / {Math.abs(result.oldValue)} × 100 = {result.percentageChange.toFixed(2)}%
                </div>
              </div>
            </div>
          )}

          {!result && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-center">
              <p className="text-sm text-yellow-800">{t('invalidInput')}</p>
            </div>
          )}
        </div>

        {/* SEO Content Sections */}
        <div className="space-y-4">
          {/* What Is */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('whatIs')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('whatIs')}</h2>
              {expandedSections.whatIs ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.whatIs && (
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">
                  {t('whatIsContent')}
                </p>
              </div>
            )}
          </div>

          {/* How To Calculate */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('howTo')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('howToCalculate')}</h2>
              {expandedSections.howTo ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.howTo && (
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">
                  {t('howToCalculateContent')}
                </p>
              </div>
            )}
          </div>

          {/* Examples */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('examples')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('commonUses')}</h2>
              {expandedSections.examples ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.examples && (
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">
                  {t('commonUsesContent')}
                </p>
              </div>
            )}
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('faq')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('faq')}</h2>
              {expandedSections.faq ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.faq && (
              <div className="px-6 pb-6 space-y-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i}>
                    <h3 className="font-medium text-gray-900 mb-1">{t(`faqQ${i}`)}</h3>
                    <p className="text-gray-600 text-sm">{t(`faqA${i}`)}</p>
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
