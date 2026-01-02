'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Calculator, Scale, Percent, ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'simplify' | 'equivalent' | 'compare' | 'part';

export default function RatioClientPage() {
  const t = useTranslations('RatioCalculator');

  // State
  const [mode, setMode] = useState<CalculationMode>('simplify');
  const [a, setA] = useState<string>('');
  const [b, setB] = useState<string>('');
  const [c, setC] = useState<string>('');
  const [d, setD] = useState<string>('');
  const [total, setTotal] = useState<string>('');

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howTo: false,
    examples: false,
    faq: false
  });

  const modes = [
    {
      id: 'simplify' as CalculationMode,
      icon: Calculator,
      label: t('simplifyMode'),
      description: t('simplifyDescription')
    },
    {
      id: 'equivalent' as CalculationMode,
      icon: Scale,
      label: t('equivalentMode'),
      description: t('equivalentDescription')
    },
    {
      id: 'compare' as CalculationMode,
      icon: Percent,
      label: t('compareMode'),
      description: t('compareDescription')
    },
    {
      id: 'part' as CalculationMode,
      icon: Calculator,
      label: t('partMode'),
      description: t('partDescription')
    },
  ];

  // GCD calculation for simplification
  const gcd = (x: number, y: number): number => {
    return y === 0 ? x : gcd(y, x % y);
  };

  // Calculate results based on mode
  const result = useMemo(() => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);
    const numD = parseFloat(d);
    const numTotal = parseFloat(total);

    if (mode === 'simplify') {
      if (!numA || !numB || numA <= 0 || numB <= 0) return null;

      const divisor = gcd(Math.round(numA), Math.round(numB));
      const simplifiedA = Math.round(numA) / divisor;
      const simplifiedB = Math.round(numB) / divisor;

      return {
        type: 'simplify',
        original: `${numA}:${numB}`,
        simplified: `${simplifiedA}:${simplifiedB}`,
        divisor,
        decimal: (numA / numB).toFixed(4)
      };
    }

    if (mode === 'equivalent') {
      if (!numA || !numB || !numC) return null;

      // a:b = c:x, solve for x
      const x = (numB * numC) / numA;

      return {
        type: 'equivalent',
        ratio1: `${numA}:${numB}`,
        ratio2: `${numC}:${x.toFixed(2)}`,
        missing: x.toFixed(2),
        formula: `${numA}:${numB} = ${numC}:x`
      };
    }

    if (mode === 'compare') {
      if (!numA || !numB || !numC || !numD) return null;

      const ratio1 = numA / numB;
      const ratio2 = numC / numD;
      const difference = Math.abs(ratio1 - ratio2);
      const percentDiff = ((difference / Math.min(ratio1, ratio2)) * 100).toFixed(2);

      let comparison = '';
      if (Math.abs(ratio1 - ratio2) < 0.0001) {
        comparison = 'equal';
      } else if (ratio1 > ratio2) {
        comparison = 'greater';
      } else {
        comparison = 'less';
      }

      return {
        type: 'compare',
        ratio1: `${numA}:${numB}`,
        ratio2: `${numC}:${numD}`,
        decimal1: ratio1.toFixed(4),
        decimal2: ratio2.toFixed(4),
        comparison,
        percentDiff
      };
    }

    if (mode === 'part') {
      if (!numA || !numB || !numTotal) return null;

      const sum = numA + numB;
      const partA = (numA / sum) * numTotal;
      const partB = (numB / sum) * numTotal;

      return {
        type: 'part',
        ratio: `${numA}:${numB}`,
        total: numTotal,
        partA: partA.toFixed(2),
        partB: partB.toFixed(2),
        percentA: ((numA / sum) * 100).toFixed(1),
        percentB: ((numB / sum) * 100).toFixed(1)
      };
    }

    return null;
  }, [mode, a, b, c, d, total]);

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('h1Title')}</h1>
          <p className="text-gray-600">{t('h1Subtitle')}</p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('selectMode')}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {modes.map(modeOption => (
                <button
                  key={modeOption.id}
                  onClick={() => setMode(modeOption.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    mode === modeOption.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <modeOption.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      mode === modeOption.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium mb-1 ${
                        mode === modeOption.id ? 'text-blue-700' : 'text-gray-900'
                      }`}>
                        {modeOption.label}
                      </div>
                      <div className="text-xs text-gray-600">
                        {modeOption.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs based on mode */}
          <div className="space-y-4">
            {mode === 'simplify' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('firstNumber')}
                  </label>
                  <input
                    type="number"
                    value={a}
                    onChange={(e) => setA(e.target.value)}
                    placeholder="8"
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('secondNumber')}
                  </label>
                  <input
                    type="number"
                    value={b}
                    onChange={(e) => setB(e.target.value)}
                    placeholder="12"
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  />
                </div>
              </div>
            )}

            {mode === 'equivalent' && (
              <div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">A</label>
                    <input
                      type="number"
                      value={a}
                      onChange={(e) => setA(e.target.value)}
                      placeholder="2"
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">B</label>
                    <input
                      type="number"
                      value={b}
                      onChange={(e) => setB(e.target.value)}
                      placeholder="3"
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">C</label>
                    <input
                      type="number"
                      value={c}
                      onChange={(e) => setC(e.target.value)}
                      placeholder="6"
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    />
                  </div>
                </div>
                <div className="text-center text-sm text-gray-600">
                  {t('equivalentFormula')}: A:B = C:X
                </div>
              </div>
            )}

            {mode === 'compare' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('ratio1A')}
                    </label>
                    <input
                      type="number"
                      value={a}
                      onChange={(e) => setA(e.target.value)}
                      placeholder="3"
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('ratio1B')}
                    </label>
                    <input
                      type="number"
                      value={b}
                      onChange={(e) => setB(e.target.value)}
                      placeholder="4"
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('ratio2A')}
                    </label>
                    <input
                      type="number"
                      value={c}
                      onChange={(e) => setC(e.target.value)}
                      placeholder="6"
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('ratio2B')}
                    </label>
                    <input
                      type="number"
                      value={d}
                      onChange={(e) => setD(e.target.value)}
                      placeholder="8"
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {mode === 'part' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('partA')}
                    </label>
                    <input
                      type="number"
                      value={a}
                      onChange={(e) => setA(e.target.value)}
                      placeholder="2"
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('partB')}
                    </label>
                    <input
                      type="number"
                      value={b}
                      onChange={(e) => setB(e.target.value)}
                      placeholder="3"
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('totalAmount')}
                  </label>
                  <input
                    type="number"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="mt-6 p-5 bg-blue-50 rounded-xl border-2 border-blue-200">
              {result.type === 'simplify' && (
                <div>
                  <div className="text-sm text-blue-600 font-medium mb-2">
                    {t('simplifiedRatio')}
                  </div>
                  <div className="text-3xl font-bold text-blue-700 mb-3">
                    {result.simplified}
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>{t('originalRatio')}:</span>
                      <span className="font-medium">{result.original}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('divisor')}:</span>
                      <span className="font-medium">{result.divisor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('decimalForm')}:</span>
                      <span className="font-medium">{result.decimal}</span>
                    </div>
                  </div>
                </div>
              )}

              {result.type === 'equivalent' && (
                <div>
                  <div className="text-sm text-blue-600 font-medium mb-2">
                    {t('missingValue')}
                  </div>
                  <div className="text-3xl font-bold text-blue-700 mb-3">
                    X = {result.missing}
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>{t('formula')}:</span>
                      <span className="font-medium">{result.formula}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('equivalentRatio')}:</span>
                      <span className="font-medium">{result.ratio2}</span>
                    </div>
                  </div>
                </div>
              )}

              {result.type === 'compare' && (
                <div>
                  <div className="text-sm text-blue-600 font-medium mb-2">
                    {t('comparisonResult')}
                  </div>
                  <div className="text-2xl font-bold text-blue-700 mb-3">
                    {result.comparison === 'equal' && t('ratiosEqual')}
                    {result.comparison === 'greater' && t('ratio1Greater')}
                    {result.comparison === 'less' && t('ratio1Less')}
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>{result.ratio1}:</span>
                      <span className="font-medium">{result.decimal1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{result.ratio2}:</span>
                      <span className="font-medium">{result.decimal2}</span>
                    </div>
                    {result.comparison !== 'equal' && (
                      <div className="flex justify-between">
                        <span>{t('difference')}:</span>
                        <span className="font-medium">{result.percentDiff}%</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {result.type === 'part' && (
                <div>
                  <div className="text-sm text-blue-600 font-medium mb-2">
                    {t('dividedParts')}
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">{t('firstPart')}</div>
                      <div className="text-2xl font-bold text-blue-700">
                        {result.partA} <span className="text-sm text-gray-600">({result.percentA}%)</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">{t('secondPart')}</div>
                      <div className="text-2xl font-bold text-green-700">
                        {result.partB} <span className="text-sm text-gray-600">({result.percentB}%)</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-blue-200">
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>{t('ratio')}:</span>
                        <span className="font-medium">{result.ratio}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>{t('total')}:</span>
                        <span className="font-medium">{result.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
              <h2 className="text-lg font-semibold text-gray-900">{t('whatIsTitle')}</h2>
              {expandedSections.whatIs ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.whatIs && (
              <div className="px-6 pb-6">
                <div className="text-gray-600 leading-relaxed">
                  {t('whatIsDetail')}
                </div>
              </div>
            )}
          </div>

          {/* How To */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('howTo')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('howToTitle')}</h2>
              {expandedSections.howTo ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.howTo && (
              <div className="px-6 pb-6">
                <div className="text-gray-600 leading-relaxed">
                  {t('howToDetail')}
                </div>
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
              {expandedSections.examples ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.examples && (
              <div className="px-6 pb-6 space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">{t('example1Title')}</h3>
                  <p className="text-gray-600">{t('example1Detail')}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">{t('example2Title')}</h3>
                  <p className="text-gray-600">{t('example2Detail')}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">{t('example3Title')}</h3>
                  <p className="text-gray-600">{t('example3Detail')}</p>
                </div>
              </div>
            )}
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('faq')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('faqTitle')}</h2>
              {expandedSections.faq ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.faq && (
              <div className="px-6 pb-6 space-y-4">
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <div key={num}>
                    <h3 className="font-medium text-gray-900 mb-2">{t(`faqQ${num}`)}</h3>
                    <p className="text-gray-600">{t(`faqA${num}`)}</p>
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
