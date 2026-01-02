'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Layers, Shuffle, ChevronDown, ChevronUp, Calculator } from 'lucide-react';

type CalculationMode = 'combination' | 'permutation' | 'factorial';

export default function CombinationsPermutationsClientPage() {
  const t = useTranslations('CombinationsPermutationsCalculator');

  const [mode, setMode] = useState<CalculationMode>('combination');
  const [n, setN] = useState<string>('10');
  const [r, setR] = useState<string>('3');
  const [withRepetition, setWithRepetition] = useState<boolean>(false);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    formulas: false,
    examples: false,
    faq: false
  });

  const modes = [
    { id: 'combination', icon: Layers, label: t('modeCombination'), desc: 'C(n,r)' },
    { id: 'permutation', icon: Shuffle, label: t('modePermutation'), desc: 'P(n,r)' },
    { id: 'factorial', icon: Calculator, label: t('modeFactorial'), desc: 'n!' },
  ];

  // Factorial function with BigInt for large numbers
  const factorial = (num: number): bigint => {
    if (num < 0) return BigInt(0);
    if (num <= 1) return BigInt(1);
    let result = BigInt(1);
    for (let i = 2; i <= num; i++) {
      result *= BigInt(i);
    }
    return result;
  };

  const result = useMemo(() => {
    const nVal = parseInt(n);
    const rVal = parseInt(r);

    if (mode === 'factorial') {
      if (isNaN(nVal) || nVal < 0 || nVal > 170) {
        return null;
      }
      const factorialResult = factorial(nVal);
      return {
        value: factorialResult,
        formula: `${nVal}!`,
        description: t('factorialDesc'),
      };
    }

    if (isNaN(nVal) || isNaN(rVal) || nVal < 0 || rVal < 0) {
      return null;
    }

    if (!withRepetition && rVal > nVal) {
      return null;
    }

    if (nVal > 170 || rVal > 170) {
      return null;
    }

    if (mode === 'combination') {
      let resultValue: bigint;
      let formula: string;

      if (withRepetition) {
        // C(n+r-1, r) = (n+r-1)! / (r! × (n-1)!)
        const nPlusRMinus1 = nVal + rVal - 1;
        resultValue = factorial(nPlusRMinus1) / (factorial(rVal) * factorial(nVal - 1));
        formula = `C(${nVal}+${rVal}-1, ${rVal}) = (${nPlusRMinus1})! / (${rVal}! × ${nVal - 1}!)`;
      } else {
        // C(n, r) = n! / (r! × (n-r)!)
        resultValue = factorial(nVal) / (factorial(rVal) * factorial(nVal - rVal));
        formula = `C(${nVal}, ${rVal}) = ${nVal}! / (${rVal}! × ${nVal - rVal}!)`;
      }

      return {
        value: resultValue,
        formula,
        description: withRepetition ? t('combinationRepDesc') : t('combinationDesc'),
      };
    }

    if (mode === 'permutation') {
      let resultValue: bigint;
      let formula: string;

      if (withRepetition) {
        // P(n, r) with repetition = n^r
        resultValue = BigInt(nVal) ** BigInt(rVal);
        formula = `P(${nVal}, ${rVal}) = ${nVal}^${rVal}`;
      } else {
        // P(n, r) = n! / (n-r)!
        resultValue = factorial(nVal) / factorial(nVal - rVal);
        formula = `P(${nVal}, ${rVal}) = ${nVal}! / ${nVal - rVal}!`;
      }

      return {
        value: resultValue,
        formula,
        description: withRepetition ? t('permutationRepDesc') : t('permutationDesc'),
      };
    }

    return null;
  }, [mode, n, r, withRepetition, t]);

  const formatBigInt = (num: bigint): string => {
    const str = num.toString();
    if (str.length > 20) {
      return str.slice(0, 6) + '...' + str.slice(-6) + ` (${str.length} digits)`;
    }
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
          {/* Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('selectMode')}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as CalculationMode)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    mode === m.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <m.icon className={`w-6 h-6 mx-auto mb-2 ${mode === m.id ? 'text-indigo-600' : 'text-gray-500'}`} />
                  <div className="text-sm font-medium">{m.label}</div>
                  <div className="text-xs text-gray-500 font-mono">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <div className={`grid ${mode === 'factorial' ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {mode === 'factorial' ? t('numberN') : t('totalItems')} (n)
                </label>
                <input
                  type="number"
                  value={n}
                  onChange={(e) => setN(e.target.value)}
                  min="0"
                  max="170"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors"
                  placeholder="10"
                />
              </div>
              {mode !== 'factorial' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('itemsToChoose')} (r)
                  </label>
                  <input
                    type="number"
                    value={r}
                    onChange={(e) => setR(e.target.value)}
                    min="0"
                    max="170"
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors"
                    placeholder="3"
                  />
                </div>
              )}
            </div>

            {mode !== 'factorial' && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="withRepetition"
                  checked={withRepetition}
                  onChange={(e) => setWithRepetition(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded"
                />
                <label htmlFor="withRepetition" className="text-sm text-gray-700">
                  {t('allowRepetition')}
                </label>
              </div>
            )}
          </div>

          {/* Formula Display */}
          {result && (
            <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-200 text-center">
              <div className="text-sm text-indigo-600 mb-1">{t('formula')}</div>
              <div className="text-lg font-mono text-indigo-800">{result.formula}</div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="mt-6 space-y-4">
              <div className="p-5 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">{t('result')}</span>
                </div>
                <div className="text-3xl font-bold text-green-700 font-mono break-all">
                  {formatBigInt(result.value)}
                </div>
                <div className="text-sm text-green-600 mt-2">
                  {result.description}
                </div>
              </div>

              {/* Quick Info Cards */}
              {mode !== 'factorial' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
                    <div className="text-xs text-blue-600 mb-1">{t('totalItems')}</div>
                    <div className="text-lg font-bold text-blue-700">{n}</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-center">
                    <div className="text-xs text-purple-600 mb-1">{t('itemsToChoose')}</div>
                    <div className="text-lg font-bold text-purple-700">{r}</div>
                  </div>
                </div>
              )}
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
              {expandedSections.whatIs ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {expandedSections.whatIs && (
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">{t('whatIsContent')}</p>
              </div>
            )}
          </div>

          {/* Formulas */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('formulas')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('formulasTitle')}</h2>
              {expandedSections.formulas ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {expandedSections.formulas && (
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">{t('formulasContent')}</p>
              </div>
            )}
          </div>

          {/* Examples */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('examples')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('examplesTitle')}</h2>
              {expandedSections.examples ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {expandedSections.examples && (
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">{t('examplesContent')}</p>
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
              {expandedSections.faq ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
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
