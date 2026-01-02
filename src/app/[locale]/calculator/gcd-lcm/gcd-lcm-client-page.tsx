'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Divide, X, Calculator, ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'gcd' | 'lcm' | 'both';

export default function GcdLcmClientPage() {
  const t = useTranslations('GcdLcmCalculator');

  const [mode, setMode] = useState<CalculationMode>('both');
  const [numbers, setNumbers] = useState<string>('12, 18');

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howTo: false,
    examples: false,
    faq: false
  });

  const modes = [
    {
      id: 'gcd',
      icon: Divide,
      label: t('modeGcd'),
      description: t('modeGcdDesc')
    },
    {
      id: 'lcm',
      icon: X,
      label: t('modeLcm'),
      description: t('modeLcmDesc')
    },
    {
      id: 'both',
      icon: Calculator,
      label: t('modeBoth'),
      description: t('modeBothDesc')
    },
  ];

  // Euclidean algorithm for GCD
  const gcd = (a: number, b: number): number => {
    a = Math.abs(Math.floor(a));
    b = Math.abs(Math.floor(b));
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  // GCD for multiple numbers
  const gcdMultiple = (nums: number[]): number => {
    return nums.reduce((acc, num) => gcd(acc, num));
  };

  // LCM using the formula: LCM(a,b) = (a * b) / GCD(a,b)
  const lcm = (a: number, b: number): number => {
    return Math.abs(Math.floor(a) * Math.floor(b)) / gcd(a, b);
  };

  // LCM for multiple numbers
  const lcmMultiple = (nums: number[]): number => {
    return nums.reduce((acc, num) => lcm(acc, num));
  };

  const result = useMemo(() => {
    // Parse numbers from comma-separated input
    const numArray = numbers
      .split(',')
      .map(n => parseFloat(n.trim()))
      .filter(n => !isNaN(n) && n > 0);

    if (numArray.length < 2) {
      return null;
    }

    const gcdResult = gcdMultiple(numArray);
    const lcmResult = lcmMultiple(numArray);

    // Find common factors for GCD
    const factors: number[] = [];
    for (let i = 1; i <= gcdResult; i++) {
      if (gcdResult % i === 0) {
        factors.push(i);
      }
    }

    // Find common multiples for LCM (first 5)
    const multiples: number[] = [];
    for (let i = 1; i <= 5; i++) {
      multiples.push(lcmResult * i);
    }

    return {
      numbers: numArray,
      gcd: gcdResult,
      lcm: lcmResult,
      factors,
      multiples
    };
  }, [numbers]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const setQuickExample = (nums: string) => {
    setNumbers(nums);
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {modes.map(modeItem => (
                <button
                  key={modeItem.id}
                  onClick={() => setMode(modeItem.id as CalculationMode)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    mode === modeItem.id
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <modeItem.icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium mb-1">{modeItem.label}</div>
                  <div className="text-xs text-gray-500">{modeItem.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Numbers Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('enterNumbers')}
            </label>
            <input
              type="text"
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 transition-colors"
              placeholder={t('numbersPlaceholder')}
            />
            <p className="text-xs text-gray-500 mt-1">{t('numbersHint')}</p>
          </div>

          {/* Quick Examples */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('quickExamples')}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setQuickExample('12, 18')}
                className="px-3 py-1.5 text-sm bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
              >
                12, 18
              </button>
              <button
                onClick={() => setQuickExample('24, 36, 48')}
                className="px-3 py-1.5 text-sm bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
              >
                24, 36, 48
              </button>
              <button
                onClick={() => setQuickExample('15, 25, 35')}
                className="px-3 py-1.5 text-sm bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
              >
                15, 25, 35
              </button>
              <button
                onClick={() => setQuickExample('8, 12, 16, 20')}
                className="px-3 py-1.5 text-sm bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
              >
                8, 12, 16, 20
              </button>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Numbers */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">{t('yourNumbers')}</div>
                <div className="text-lg font-semibold text-gray-900">
                  {result.numbers.join(', ')}
                </div>
              </div>

              {/* GCD Result */}
              {(mode === 'gcd' || mode === 'both') && (
                <div className="p-5 bg-teal-50 rounded-xl border-2 border-teal-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Divide className="w-5 h-5 text-teal-600" />
                    <div className="text-sm text-teal-600 font-medium">{t('gcdResult')}</div>
                  </div>
                  <div className="text-3xl font-bold text-teal-900 mb-2">
                    {result.gcd}
                  </div>
                  <div className="text-sm text-teal-700">
                    {t('gcdMeaning')}: {result.factors.join(', ')}
                  </div>
                </div>
              )}

              {/* LCM Result */}
              {(mode === 'lcm' || mode === 'both') && (
                <div className="p-5 bg-orange-50 rounded-xl border-2 border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <X className="w-5 h-5 text-orange-600" />
                    <div className="text-sm text-orange-600 font-medium">{t('lcmResult')}</div>
                  </div>
                  <div className="text-3xl font-bold text-orange-900 mb-2">
                    {result.lcm.toLocaleString()}
                  </div>
                  <div className="text-sm text-orange-700">
                    {t('lcmMeaning')}: {result.multiples.slice(0, 5).map(m => m.toLocaleString()).join(', ')}...
                  </div>
                </div>
              )}

              {/* Relationship */}
              {mode === 'both' && (
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="text-sm text-purple-600 font-medium mb-2">{t('relationship')}</div>
                  <div className="text-sm text-purple-900 space-y-1">
                    <div>
                      {t('productFormula')}: {result.numbers[0]} × {result.numbers[1]} = {result.numbers[0] * result.numbers[1]}
                    </div>
                    <div>
                      GCD × LCM = {result.gcd} × {result.lcm.toLocaleString()} = {(result.gcd * result.lcm).toLocaleString()}
                    </div>
                    {result.numbers.length === 2 && result.numbers[0] * result.numbers[1] === result.gcd * result.lcm && (
                      <div className="text-purple-700 font-medium mt-2">
                        ✓ {t('relationshipVerified')}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {!result && (
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-center">
              <p className="text-sm text-yellow-800">{t('enterAtLeastTwo')}</p>
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
