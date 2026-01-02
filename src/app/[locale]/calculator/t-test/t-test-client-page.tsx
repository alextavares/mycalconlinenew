'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { BarChart3, ChevronDown, ChevronUp, Users, User } from 'lucide-react';

type TestType = 'oneSample' | 'twoSample' | 'paired';

export default function TTestClientPage() {
  const t = useTranslations('TTestCalculator');

  const [testType, setTestType] = useState<TestType>('oneSample');

  // One sample inputs
  const [sampleMean, setSampleMean] = useState<string>('105');
  const [populationMean, setPopulationMean] = useState<string>('100');
  const [sampleStdDev, setSampleStdDev] = useState<string>('15');
  const [sampleSize, setSampleSize] = useState<string>('30');

  // Two sample inputs
  const [mean1, setMean1] = useState<string>('78');
  const [mean2, setMean2] = useState<string>('85');
  const [stdDev1, setStdDev1] = useState<string>('10');
  const [stdDev2, setStdDev2] = useState<string>('12');
  const [n1, setN1] = useState<string>('25');
  const [n2, setN2] = useState<string>('30');

  // Paired inputs
  const [meanDiff, setMeanDiff] = useState<string>('5');
  const [stdDevDiff, setStdDevDiff] = useState<string>('8');
  const [nPaired, setNPaired] = useState<string>('20');

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    formula: false,
    examples: false,
    faq: false
  });

  const testTypes = [
    { id: 'oneSample', icon: User, label: t('oneSample'), desc: t('oneSampleDesc') },
    { id: 'twoSample', icon: Users, label: t('twoSample'), desc: t('twoSampleDesc') },
    { id: 'paired', icon: Users, label: t('paired'), desc: t('pairedDesc') },
  ];

  // T-distribution CDF approximation (using normal approximation for large df)
  const tCDF = (t: number, df: number): number => {
    // For df > 30, use normal approximation
    if (df > 30) {
      const a1 = 0.254829592;
      const a2 = -0.284496736;
      const a3 = 1.421413741;
      const a4 = -1.453152027;
      const a5 = 1.061405429;
      const p = 0.3275911;

      const sign = t < 0 ? -1 : 1;
      const z = Math.abs(t) / Math.sqrt(2);
      const tVal = 1.0 / (1.0 + p * z);
      const y = 1.0 - (((((a5 * tVal + a4) * tVal) + a3) * tVal + a2) * tVal + a1) * tVal * Math.exp(-z * z);
      return 0.5 * (1.0 + sign * y);
    }

    // For smaller df, use a more accurate approximation
    const x = df / (df + t * t);
    let prob = 0.5 * Math.pow(x, df / 2);

    if (t > 0) {
      return 1 - prob;
    }
    return prob;
  };

  const result = useMemo(() => {
    if (testType === 'oneSample') {
      const xBar = parseFloat(sampleMean);
      const mu = parseFloat(populationMean);
      const s = parseFloat(sampleStdDev);
      const n = parseFloat(sampleSize);

      if (isNaN(xBar) || isNaN(mu) || isNaN(s) || isNaN(n) || s <= 0 || n <= 1) {
        return null;
      }

      const standardError = s / Math.sqrt(n);
      const tValue = (xBar - mu) / standardError;
      const df = n - 1;
      const pValueTwoTailed = 2 * (1 - tCDF(Math.abs(tValue), df));
      const pValueOneTailed = 1 - tCDF(Math.abs(tValue), df);

      return {
        tValue,
        df,
        standardError,
        pValueTwoTailed: Math.min(pValueTwoTailed, 1),
        pValueOneTailed: Math.min(pValueOneTailed, 1),
        significant95: pValueTwoTailed < 0.05,
        significant99: pValueTwoTailed < 0.01,
      };
    }

    if (testType === 'twoSample') {
      const x1 = parseFloat(mean1);
      const x2 = parseFloat(mean2);
      const s1 = parseFloat(stdDev1);
      const s2 = parseFloat(stdDev2);
      const size1 = parseFloat(n1);
      const size2 = parseFloat(n2);

      if (isNaN(x1) || isNaN(x2) || isNaN(s1) || isNaN(s2) || isNaN(size1) || isNaN(size2) ||
          s1 <= 0 || s2 <= 0 || size1 <= 1 || size2 <= 1) {
        return null;
      }

      // Welch's t-test (unequal variances)
      const var1 = (s1 * s1) / size1;
      const var2 = (s2 * s2) / size2;
      const standardError = Math.sqrt(var1 + var2);
      const tValue = (x1 - x2) / standardError;

      // Welch-Satterthwaite degrees of freedom
      const df = Math.pow(var1 + var2, 2) /
                 (Math.pow(var1, 2) / (size1 - 1) + Math.pow(var2, 2) / (size2 - 1));

      const pValueTwoTailed = 2 * (1 - tCDF(Math.abs(tValue), df));
      const pValueOneTailed = 1 - tCDF(Math.abs(tValue), df);

      return {
        tValue,
        df: Math.round(df * 100) / 100,
        standardError,
        pValueTwoTailed: Math.min(pValueTwoTailed, 1),
        pValueOneTailed: Math.min(pValueOneTailed, 1),
        significant95: pValueTwoTailed < 0.05,
        significant99: pValueTwoTailed < 0.01,
        meanDifference: x1 - x2,
      };
    }

    if (testType === 'paired') {
      const dBar = parseFloat(meanDiff);
      const sDiff = parseFloat(stdDevDiff);
      const n = parseFloat(nPaired);

      if (isNaN(dBar) || isNaN(sDiff) || isNaN(n) || sDiff <= 0 || n <= 1) {
        return null;
      }

      const standardError = sDiff / Math.sqrt(n);
      const tValue = dBar / standardError;
      const df = n - 1;
      const pValueTwoTailed = 2 * (1 - tCDF(Math.abs(tValue), df));
      const pValueOneTailed = 1 - tCDF(Math.abs(tValue), df);

      return {
        tValue,
        df,
        standardError,
        pValueTwoTailed: Math.min(pValueTwoTailed, 1),
        pValueOneTailed: Math.min(pValueOneTailed, 1),
        significant95: pValueTwoTailed < 0.05,
        significant99: pValueTwoTailed < 0.01,
      };
    }

    return null;
  }, [testType, sampleMean, populationMean, sampleStdDev, sampleSize,
      mean1, mean2, stdDev1, stdDev2, n1, n2, meanDiff, stdDevDiff, nPaired]);

  const formatNumber = (num: number, decimals: number = 4): string => {
    if (num < 0.0001 && num > 0) return '< 0.0001';
    return num.toFixed(decimals);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
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
          {/* Test Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('selectTest')}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {testTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setTestType(type.id as TestType)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    testType === type.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <type.icon className={`w-6 h-6 mx-auto mb-2 ${testType === type.id ? 'text-blue-600' : 'text-gray-500'}`} />
                  <div className="text-sm font-medium">{type.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* One Sample Inputs */}
          {testType === 'oneSample' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('sampleMean')} (x̄)
                  </label>
                  <input
                    type="number"
                    value={sampleMean}
                    onChange={(e) => setSampleMean(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('populationMean')} (μ₀)
                  </label>
                  <input
                    type="number"
                    value={populationMean}
                    onChange={(e) => setPopulationMean(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('sampleStdDev')} (s)
                  </label>
                  <input
                    type="number"
                    value={sampleStdDev}
                    onChange={(e) => setSampleStdDev(e.target.value)}
                    min="0.001"
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('sampleSize')} (n)
                  </label>
                  <input
                    type="number"
                    value={sampleSize}
                    onChange={(e) => setSampleSize(e.target.value)}
                    min="2"
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Two Sample Inputs */}
          {testType === 'twoSample' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg mb-2">
                <span className="text-sm font-medium text-blue-700">{t('group1')}</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('mean')} (x̄₁)</label>
                  <input type="number" value={mean1} onChange={(e) => setMean1(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('stdDev')} (s₁)</label>
                  <input type="number" value={stdDev1} onChange={(e) => setStdDev1(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('size')} (n₁)</label>
                  <input type="number" value={n1} onChange={(e) => setN1(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0" />
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg mb-2">
                <span className="text-sm font-medium text-purple-700">{t('group2')}</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('mean')} (x̄₂)</label>
                  <input type="number" value={mean2} onChange={(e) => setMean2(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('stdDev')} (s₂)</label>
                  <input type="number" value={stdDev2} onChange={(e) => setStdDev2(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('size')} (n₂)</label>
                  <input type="number" value={n2} onChange={(e) => setN2(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0" />
                </div>
              </div>
            </div>
          )}

          {/* Paired Inputs */}
          {testType === 'paired' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('meanDifference')} (d̄)
                  </label>
                  <input type="number" value={meanDiff} onChange={(e) => setMeanDiff(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('stdDevDifference')} (sᵈ)
                  </label>
                  <input type="number" value={stdDevDiff} onChange={(e) => setStdDevDiff(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('pairs')} (n)
                  </label>
                  <input type="number" value={nPaired} onChange={(e) => setNPaired(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0" />
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="mt-6 space-y-4">
              <div className="p-5 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">{t('tStatistic')}</span>
                </div>
                <div className="text-4xl font-bold text-blue-700">
                  t = {formatNumber(result.tValue, 4)}
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  df = {result.df}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 text-center">
                  <div className="text-xs text-orange-600 mb-1">{t('pValueTwoTailed')}</div>
                  <div className="text-2xl font-bold text-orange-700">
                    {formatNumber(result.pValueTwoTailed)}
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-center">
                  <div className="text-xs text-purple-600 mb-1">{t('pValueOneTailed')}</div>
                  <div className="text-2xl font-bold text-purple-700">
                    {formatNumber(result.pValueOneTailed)}
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border-2 text-center ${
                result.significant95
                  ? 'bg-green-50 border-green-300'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="text-sm font-medium">
                  {result.significant99 ? (
                    <span className="text-green-700">{t('significantAt99')}</span>
                  ) : result.significant95 ? (
                    <span className="text-green-700">{t('significantAt95')}</span>
                  ) : (
                    <span className="text-gray-600">{t('notSignificant')}</span>
                  )}
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
          {['whatIs', 'formula', 'examples', 'faq'].map((section) => (
            <div key={section} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection(section)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-900">{t(`${section}Title`)}</h2>
                {expandedSections[section] ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>
              {expandedSections[section] && (
                <div className="px-6 pb-6">
                  {section === 'faq' ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i}>
                          <h3 className="font-medium text-gray-900 mb-1">{t(`faqQ${i}`)}</h3>
                          <p className="text-gray-600 text-sm">{t(`faqA${i}`)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 leading-relaxed">{t(`${section}Content`)}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
