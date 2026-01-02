'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  TrendingUp,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  DollarSign,
  Calendar
} from 'lucide-react';

type CalculationMode = 'future' | 'past' | 'rate';

export default function InflationClientPage() {
  const t = useTranslations('InflationCalculator');

  const [mode, setMode] = useState<CalculationMode>('future');
  const [amount, setAmount] = useState<string>('1000');
  const [startYear, setStartYear] = useState<string>('2020');
  const [endYear, setEndYear] = useState<string>('2025');
  const [inflationRate, setInflationRate] = useState<string>('3');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howTo: false,
    examples: false,
    faq: false
  });

  const modes = [
    { id: 'future', label: t('modeFuture'), description: t('modeFutureDesc') },
    { id: 'past', label: t('modePast'), description: t('modePastDesc') },
    { id: 'rate', label: t('modeRate'), description: t('modeRateDesc') },
  ];

  const quickRates = [2, 3, 5, 7, 10];
  const currentYear = new Date().getFullYear();

  const result = useMemo(() => {
    const amountValue = parseFloat(amount) || 0;
    const rate = parseFloat(inflationRate) || 0;
    const start = parseInt(startYear) || currentYear;
    const end = parseInt(endYear) || currentYear;

    if (amountValue <= 0) return null;

    const years = Math.abs(end - start);

    switch (mode) {
      case 'future': {
        // Calculate future value with inflation
        if (rate <= 0 || end <= start) return null;
        const futureValue = amountValue * Math.pow(1 + rate / 100, years);
        const totalIncrease = futureValue - amountValue;
        const percentageIncrease = ((futureValue - amountValue) / amountValue) * 100;

        return {
          type: 'future',
          originalAmount: amountValue,
          adjustedAmount: futureValue,
          difference: totalIncrease,
          percentageChange: percentageIncrease,
          years,
          rate,
          yearlyBreakdown: Array.from({ length: years + 1 }, (_, i) => ({
            year: start + i,
            value: amountValue * Math.pow(1 + rate / 100, i)
          }))
        };
      }

      case 'past': {
        // Calculate past value (what money was worth before)
        if (rate <= 0 || start <= end) return null;
        const pastValue = amountValue / Math.pow(1 + rate / 100, years);
        const totalDecrease = amountValue - pastValue;
        const percentageDecrease = ((amountValue - pastValue) / amountValue) * 100;

        return {
          type: 'past',
          originalAmount: amountValue,
          adjustedAmount: pastValue,
          difference: totalDecrease,
          percentageChange: percentageDecrease,
          years,
          rate,
          yearlyBreakdown: Array.from({ length: years + 1 }, (_, i) => ({
            year: start - i,
            value: amountValue / Math.pow(1 + rate / 100, i)
          }))
        };
      }

      case 'rate': {
        // Calculate inflation rate between two amounts
        if (end <= start || amountValue <= 0) return null;

        // Using the formula: rate = ((futureValue / presentValue) ^ (1/years)) - 1
        const endAmount = parseFloat(endYear) || 0; // In this mode, endYear field is used for end amount
        if (endAmount <= 0) return null;

        const calculatedRate = (Math.pow(endAmount / amountValue, 1 / years) - 1) * 100;

        return {
          type: 'rate',
          originalAmount: amountValue,
          adjustedAmount: endAmount,
          difference: endAmount - amountValue,
          percentageChange: ((endAmount - amountValue) / amountValue) * 100,
          years,
          rate: calculatedRate,
          yearlyBreakdown: []
        };
      }

      default:
        return null;
    }
  }, [mode, amount, startYear, endYear, inflationRate, currentYear, t]);

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatPercent = (value: number): string => {
    return value.toFixed(2);
  };

  const handleReset = () => {
    setAmount('');
    setStartYear('');
    setEndYear('');
    setInflationRate('');
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
          <div className="inline-flex p-3 bg-blue-100 rounded-2xl mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('selectMode')}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {modes.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as CalculationMode)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    mode === m.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className={`block font-medium ${mode === m.id ? 'text-blue-700' : 'text-gray-700'}`}>
                    {m.label}
                  </span>
                  <span className="text-xs text-gray-500">{m.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Fields - Future Value */}
          {mode === 'future' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('currentAmount')}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1000"
                    step="any"
                    min="0"
                    className="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('startYear')}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={startYear}
                      onChange={(e) => setStartYear(e.target.value)}
                      placeholder={currentYear.toString()}
                      min="1900"
                      max="2100"
                      className="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('endYear')}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={endYear}
                      onChange={(e) => setEndYear(e.target.value)}
                      placeholder={(currentYear + 5).toString()}
                      min="1900"
                      max="2100"
                      className="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inflationRate')} (%)
                </label>
                <input
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(e.target.value)}
                  placeholder="3"
                  step="0.1"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {quickRates.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setInflationRate(rate.toString())}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Input Fields - Past Value */}
          {mode === 'past' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('currentAmount')}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1000"
                    step="any"
                    min="0"
                    className="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('currentYear')}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={startYear}
                      onChange={(e) => setStartYear(e.target.value)}
                      placeholder={currentYear.toString()}
                      min="1900"
                      max="2100"
                      className="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('pastYear')}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={endYear}
                      onChange={(e) => setEndYear(e.target.value)}
                      placeholder={(currentYear - 10).toString()}
                      min="1900"
                      max="2100"
                      className="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inflationRate')} (%)
                </label>
                <input
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(e.target.value)}
                  placeholder="3"
                  step="0.1"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Input Fields - Calculate Rate */}
          {mode === 'rate' && (
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('startAmount')}
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="1000"
                      step="any"
                      min="0"
                      className="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('endAmount')}
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={endYear}
                      onChange={(e) => setEndYear(e.target.value)}
                      placeholder="1500"
                      step="any"
                      min="0"
                      className="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('numberOfYears')}
                </label>
                <input
                  type="number"
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  placeholder="5"
                  min="1"
                  max="100"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {t('reset')}
          </button>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Main Result */}
              <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                <h3 className="text-sm font-medium text-blue-700 mb-3">
                  {result.type === 'future' ? t('futureValue') :
                   result.type === 'past' ? t('pastValue') :
                   t('calculatedRate')}
                </h3>
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  ${formatCurrency(result.adjustedAmount)}
                </p>
                {result.type !== 'rate' && (
                  <p className="text-sm text-blue-600">
                    {t('over')} {result.years} {result.years === 1 ? t('year') : t('years')} @ {formatPercent(result.rate)}% {t('inflation')}
                  </p>
                )}
                {result.type === 'rate' && (
                  <p className="text-sm text-blue-600">
                    {t('averageAnnualRate')}: {formatPercent(result.rate)}%
                  </p>
                )}
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500 block mb-1">
                    {result.type === 'rate' ? t('startAmount') : t('originalAmount')}
                  </span>
                  <p className="text-xl font-bold text-gray-900">${formatCurrency(result.originalAmount)}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <span className="text-xs text-gray-500 block mb-1">{t('difference')}</span>
                  <p className="text-xl font-bold text-green-700">${formatCurrency(result.difference)}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <span className="text-xs text-gray-500 block mb-1">{t('percentageChange')}</span>
                  <p className="text-xl font-bold text-purple-700">{formatPercent(result.percentageChange)}%</p>
                </div>
              </div>

              {/* Yearly Breakdown Table */}
              {result.yearlyBreakdown && result.yearlyBreakdown.length > 0 && result.yearlyBreakdown.length <= 20 && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">{t('yearlyBreakdown')}</h3>
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="text-left p-2 font-medium text-gray-700">{t('year')}</th>
                          <th className="text-right p-2 font-medium text-gray-700">{t('value')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.yearlyBreakdown.map((item, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="p-2">{item.year}</td>
                            <td className="text-right p-2 font-mono">${formatCurrency(item.value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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

          {/* Examples Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('examples')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('examples.title')}</h2>
              {expandedSections.examples ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.examples && (
              <div className="px-6 pb-6">
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('examples.content') }}
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
