'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { BarChart3, ChevronDown, ChevronUp, Calculator, ArrowRight } from 'lucide-react';

type CalculationMode = 'zFromX' | 'xFromZ' | 'probability';

export default function ZScoreClientPage() {
  const t = useTranslations('ZScoreCalculator');

  const [mode, setMode] = useState<CalculationMode>('zFromX');
  const [xValue, setXValue] = useState<string>('85');
  const [mean, setMean] = useState<string>('100');
  const [stdDev, setStdDev] = useState<string>('15');
  const [zValue, setZValue] = useState<string>('1.5');

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    formula: false,
    examples: false,
    faq: false
  });

  const modes = [
    { id: 'zFromX', label: t('modeZFromX'), desc: 'X → Z' },
    { id: 'xFromZ', label: t('modeXFromZ'), desc: 'Z → X' },
    { id: 'probability', label: t('modeProbability'), desc: 'Z → P' },
  ];

  // Standard normal CDF approximation using error function
  const normalCDF = (z: number): number => {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = z < 0 ? -1 : 1;
    z = Math.abs(z) / Math.sqrt(2);

    const t = 1.0 / (1.0 + p * z);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);

    return 0.5 * (1.0 + sign * y);
  };

  const result = useMemo(() => {
    const meanVal = parseFloat(mean);
    const stdVal = parseFloat(stdDev);

    if (isNaN(meanVal) || isNaN(stdVal) || stdVal <= 0) {
      return null;
    }

    if (mode === 'zFromX') {
      const x = parseFloat(xValue);
      if (isNaN(x)) return null;

      const z = (x - meanVal) / stdVal;
      const percentile = normalCDF(z) * 100;

      return {
        z,
        x,
        percentile,
        aboveBelow: z >= 0 ? 'above' : 'below',
        stdDevsAway: Math.abs(z),
      };
    }

    if (mode === 'xFromZ') {
      const z = parseFloat(zValue);
      if (isNaN(z)) return null;

      const x = meanVal + z * stdVal;
      const percentile = normalCDF(z) * 100;

      return {
        z,
        x,
        percentile,
        aboveBelow: z >= 0 ? 'above' : 'below',
        stdDevsAway: Math.abs(z),
      };
    }

    if (mode === 'probability') {
      const z = parseFloat(zValue);
      if (isNaN(z)) return null;

      const leftTail = normalCDF(z);
      const rightTail = 1 - leftTail;
      const between = normalCDF(Math.abs(z)) - normalCDF(-Math.abs(z));

      return {
        z,
        leftTail: leftTail * 100,
        rightTail: rightTail * 100,
        between: between * 100,
        outside: (1 - between) * 100,
      };
    }

    return null;
  }, [mode, xValue, mean, stdDev, zValue]);

  const formatNumber = (num: number, decimals: number = 4): string => {
    return num.toFixed(decimals).replace(/\.?0+$/, '');
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
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium">{m.label}</div>
                  <div className="text-xs text-gray-500 font-mono mt-1">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Formula Display */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center mb-6">
            <div className="text-sm text-blue-600 mb-1">{t('formula')}</div>
            <div className="text-lg font-mono text-blue-800">
              {mode === 'zFromX' && 'Z = (X - μ) / σ'}
              {mode === 'xFromZ' && 'X = μ + Z × σ'}
              {mode === 'probability' && 'P(Z ≤ z) = Φ(z)'}
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            {/* Mean and Std Dev - always shown for zFromX and xFromZ */}
            {(mode === 'zFromX' || mode === 'xFromZ') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('mean')} (μ)
                  </label>
                  <input
                    type="number"
                    value={mean}
                    onChange={(e) => setMean(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('standardDeviation')} (σ)
                  </label>
                  <input
                    type="number"
                    value={stdDev}
                    onChange={(e) => setStdDev(e.target.value)}
                    min="0.001"
                    step="any"
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    placeholder="15"
                  />
                </div>
              </div>
            )}

            {/* X Value - for zFromX mode */}
            {mode === 'zFromX' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('rawScore')} (X)
                </label>
                <input
                  type="number"
                  value={xValue}
                  onChange={(e) => setXValue(e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  placeholder="85"
                />
              </div>
            )}

            {/* Z Value - for xFromZ and probability modes */}
            {(mode === 'xFromZ' || mode === 'probability') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('zScore')} (Z)
                </label>
                <input
                  type="number"
                  value={zValue}
                  onChange={(e) => setZValue(e.target.value)}
                  step="0.01"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  placeholder="1.5"
                />
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="mt-6 space-y-4">
              {/* Z from X Result */}
              {mode === 'zFromX' && 'z' in result && 'x' in result && (
                <>
                  <div className="p-5 bg-green-50 rounded-xl border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700">{t('zScore')}</span>
                    </div>
                    <div className="text-4xl font-bold text-green-700">
                      Z = {formatNumber(result.z)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
                      <div className="text-xs text-blue-600 mb-1">{t('percentile')}</div>
                      <div className="text-xl font-bold text-blue-700">
                        {formatNumber(result.percentile, 2)}%
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-center">
                      <div className="text-xs text-purple-600 mb-1">{t('interpretation')}</div>
                      <div className="text-sm font-medium text-purple-700">
                        {formatNumber(result.stdDevsAway, 2)} σ {result.aboveBelow === 'above' ? t('aboveMean') : t('belowMean')}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* X from Z Result */}
              {mode === 'xFromZ' && 'x' in result && (
                <>
                  <div className="p-5 bg-green-50 rounded-xl border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700">{t('rawScore')}</span>
                    </div>
                    <div className="text-4xl font-bold text-green-700">
                      X = {formatNumber(result.x, 2)}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                    <div className="text-sm text-gray-600">
                      {t('calculationSteps')}: X = {mean} + ({zValue}) × {stdDev} = {formatNumber(result.x, 2)}
                    </div>
                  </div>
                </>
              )}

              {/* Probability Result */}
              {mode === 'probability' && 'leftTail' in result && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
                      <div className="text-xs text-blue-600 mb-1">{t('leftTail')} P(Z ≤ {zValue})</div>
                      <div className="text-2xl font-bold text-blue-700">
                        {formatNumber(result.leftTail, 4)}%
                      </div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 text-center">
                      <div className="text-xs text-orange-600 mb-1">{t('rightTail')} P(Z &gt; {zValue})</div>
                      <div className="text-2xl font-bold text-orange-700">
                        {formatNumber(result.rightTail, 4)}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
                      <div className="text-xs text-green-600 mb-1">{t('between')} P(-|Z| ≤ Z ≤ |Z|)</div>
                      <div className="text-2xl font-bold text-green-700">
                        {formatNumber(result.between, 4)}%
                      </div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-center">
                      <div className="text-xs text-red-600 mb-1">{t('outside')} P(|Z| &gt; |z|)</div>
                      <div className="text-2xl font-bold text-red-700">
                        {formatNumber(result.outside, 4)}%
                      </div>
                    </div>
                  </div>
                </>
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

          {/* Formula */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('formula')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('formulaTitle')}</h2>
              {expandedSections.formula ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {expandedSections.formula && (
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">{t('formulaContent')}</p>
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
