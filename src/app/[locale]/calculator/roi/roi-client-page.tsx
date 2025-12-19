'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calculator,
  PiggyBank,
  Calendar,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Percent,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

type CalculationMode = 'roi' | 'final-value' | 'initial-investment' | 'annualized';

export default function RoiClientPage() {
  const t = useTranslations('RoiCalculator');

  const [mode, setMode] = useState<CalculationMode>('roi');
  const [initialInvestment, setInitialInvestment] = useState<string>('');
  const [finalValue, setFinalValue] = useState<string>('');
  const [roi, setRoi] = useState<string>('');
  const [years, setYears] = useState<string>('1');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howToCalculate: false,
    examples: false,
    tips: false,
    faq: false
  });

  const modes = [
    { id: 'roi' as const, icon: Percent, label: t('modeRoi'), description: t('modeRoiDesc') },
    { id: 'final-value' as const, icon: TrendingUp, label: t('modeFinalValue'), description: t('modeFinalValueDesc') },
    { id: 'initial-investment' as const, icon: PiggyBank, label: t('modeInitial'), description: t('modeInitialDesc') },
    { id: 'annualized' as const, icon: Calendar, label: t('modeAnnualized'), description: t('modeAnnualizedDesc') },
  ];

  const result = useMemo(() => {
    const initial = parseFloat(initialInvestment);
    const final = parseFloat(finalValue);
    const roiPercent = parseFloat(roi);
    const yearsNum = parseFloat(years) || 1;

    switch (mode) {
      case 'roi': {
        if (!initial || !final || initial <= 0) return null;
        const gain = final - initial;
        const roiCalc = (gain / initial) * 100;
        const annualizedRoi = (Math.pow(final / initial, 1 / yearsNum) - 1) * 100;
        return {
          roi: roiCalc,
          annualizedRoi,
          gain,
          initial,
          final,
          years: yearsNum,
          isPositive: roiCalc >= 0
        };
      }
      case 'final-value': {
        if (!initial || roiPercent === undefined || initial <= 0) return null;
        const finalCalc = initial * (1 + roiPercent / 100);
        const gain = finalCalc - initial;
        return {
          roi: roiPercent,
          annualizedRoi: roiPercent / yearsNum,
          gain,
          initial,
          final: finalCalc,
          years: yearsNum,
          isPositive: roiPercent >= 0
        };
      }
      case 'initial-investment': {
        if (!final || roiPercent === undefined || roiPercent <= -100) return null;
        const initialCalc = final / (1 + roiPercent / 100);
        const gain = final - initialCalc;
        return {
          roi: roiPercent,
          annualizedRoi: roiPercent / yearsNum,
          gain,
          initial: initialCalc,
          final,
          years: yearsNum,
          isPositive: roiPercent >= 0
        };
      }
      case 'annualized': {
        if (!initial || !final || initial <= 0 || yearsNum <= 0) return null;
        const totalRoi = ((final - initial) / initial) * 100;
        const annualizedRoi = (Math.pow(final / initial, 1 / yearsNum) - 1) * 100;
        const gain = final - initial;
        return {
          roi: totalRoi,
          annualizedRoi,
          gain,
          initial,
          final,
          years: yearsNum,
          isPositive: totalRoi >= 0
        };
      }
      default:
        return null;
    }
  }, [mode, initialInvestment, finalValue, roi, years]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value) + '%';
  };

  const handleClear = () => {
    setInitialInvestment('');
    setFinalValue('');
    setRoi('');
    setYears('1');
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderInputs = () => {
    switch (mode) {
      case 'roi':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('initialInvestment')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(e.target.value)}
                  placeholder="10,000"
                  className="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('finalValue')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={finalValue}
                  onChange={(e) => setFinalValue(e.target.value)}
                  placeholder="12,000"
                  className="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('investmentPeriod')}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  placeholder="1"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  min="0.1"
                  step="0.1"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{t('years')}</span>
              </div>
            </div>
          </>
        );
      case 'final-value':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('initialInvestment')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(e.target.value)}
                  placeholder="10,000"
                  className="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('expectedRoi')}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={roi}
                  onChange={(e) => setRoi(e.target.value)}
                  placeholder="20"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  step="0.1"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
              </div>
            </div>
          </>
        );
      case 'initial-investment':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('targetFinalValue')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={finalValue}
                  onChange={(e) => setFinalValue(e.target.value)}
                  placeholder="15,000"
                  className="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('expectedRoi')}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={roi}
                  onChange={(e) => setRoi(e.target.value)}
                  placeholder="50"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  step="0.1"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
              </div>
            </div>
          </>
        );
      case 'annualized':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('initialInvestment')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(e.target.value)}
                  placeholder="10,000"
                  className="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('finalValue')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={finalValue}
                  onChange={(e) => setFinalValue(e.target.value)}
                  placeholder="15,000"
                  className="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('investmentPeriod')}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  placeholder="3"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  min="0.1"
                  step="0.1"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{t('years')}</span>
              </div>
            </div>
          </>
        );
    }
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
          {/* Mode Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('selectMode')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {modes.map(({ id, icon: Icon, label, description }) => (
                <button
                  key={id}
                  onClick={() => setMode(id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    mode === id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-2 ${mode === id ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="block text-sm font-medium">{label}</span>
                  <span className="block text-xs text-gray-500 mt-1">{description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {renderInputs()}
          </div>

          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {t('clear')}
          </button>

          {/* Results */}
          {result && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              {/* Main Result */}
              <div className={`p-6 rounded-xl mb-4 ${result.isPositive ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {mode === 'initial-investment' ? t('requiredInvestment') : mode === 'final-value' ? t('expectedFinalValue') : t('totalRoi')}
                    </p>
                    <p className={`text-4xl font-bold ${result.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {mode === 'initial-investment'
                        ? formatCurrency(result.initial)
                        : mode === 'final-value'
                        ? formatCurrency(result.final)
                        : formatPercent(result.roi)
                      }
                    </p>
                  </div>
                  <div className={`p-4 rounded-full ${result.isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
                    {result.isPositive ? (
                      <ArrowUpRight className="w-8 h-8 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-8 h-8 text-red-600" />
                    )}
                  </div>
                </div>
              </div>

              {/* Breakdown Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <PiggyBank className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500">{t('invested')}</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(result.initial)}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500">{t('finalValue')}</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(result.final)}</p>
                </div>

                <div className={`p-4 rounded-xl ${result.isPositive ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {result.isPositive ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-xs text-gray-500">{result.isPositive ? t('profit') : t('loss')}</span>
                  </div>
                  <p className={`text-lg font-bold ${result.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {result.isPositive ? '+' : ''}{formatCurrency(result.gain)}
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-gray-500">{t('annualizedRoi')}</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600">{formatPercent(result.annualizedRoi)}</p>
                </div>
              </div>

              {/* Visual Bar */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-3">{t('investmentBreakdown')}</p>
                <div className="h-8 rounded-full overflow-hidden bg-gray-200 flex">
                  <div
                    className="bg-blue-500 h-full flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${Math.min((result.initial / result.final) * 100, 100)}%` }}
                  >
                    {((result.initial / result.final) * 100).toFixed(0)}%
                  </div>
                  {result.isPositive && result.gain > 0 && (
                    <div
                      className="bg-green-500 h-full flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(result.gain / result.final) * 100}%` }}
                    >
                      +{((result.gain / result.final) * 100).toFixed(0)}%
                    </div>
                  )}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>{t('principal')}: {formatCurrency(result.initial)}</span>
                  <span>{result.isPositive ? t('profit') : t('loss')}: {formatCurrency(Math.abs(result.gain))}</span>
                </div>
              </div>

              {/* Formula */}
              <div className="mt-4 p-4 bg-gray-100 rounded-xl">
                <p className="text-xs text-gray-500 font-mono">
                  ROI = ((Final Value - Initial Investment) / Initial Investment) × 100
                </p>
                <p className="text-xs text-gray-500 font-mono mt-1">
                  ROI = (({formatCurrency(result.final)} - {formatCurrency(result.initial)}) / {formatCurrency(result.initial)}) × 100 = <strong>{formatPercent(result.roi)}</strong>
                </p>
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

          {/* How To Calculate Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('howToCalculate')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('howToCalculate.title')}</h2>
              {expandedSections.howToCalculate ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.howToCalculate && (
              <div className="px-6 pb-6">
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('howToCalculate.content') }}
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

          {/* Tips Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('tips')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('tips.title')}</h2>
              {expandedSections.tips ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.tips && (
              <div className="px-6 pb-6">
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('tips.content') }}
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
