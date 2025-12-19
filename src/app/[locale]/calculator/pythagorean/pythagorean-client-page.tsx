'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Triangle,
  ChevronDown,
  ChevronUp,
  Info,
  RotateCcw
} from 'lucide-react';

type CalculationMode = 'hypotenuse' | 'leg-a' | 'leg-b';

export default function PythagoreanClientPage() {
  const t = useTranslations('PythagoreanCalculator');

  const [mode, setMode] = useState<CalculationMode>('hypotenuse');
  const [sideA, setSideA] = useState<string>('3');
  const [sideB, setSideB] = useState<string>('4');
  const [hypotenuse, setHypotenuse] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howTo: false,
    examples: false,
    faq: false
  });

  const modes = [
    { id: 'hypotenuse', label: t('modeHypotenuse'), description: t('modeHypotenuseDesc') },
    { id: 'leg-a', label: t('modeLegA'), description: t('modeLegADesc') },
    { id: 'leg-b', label: t('modeLegB'), description: t('modeLegBDesc') },
  ];

  const result = useMemo(() => {
    const a = parseFloat(sideA) || 0;
    const b = parseFloat(sideB) || 0;
    const c = parseFloat(hypotenuse) || 0;

    let calculated: number | null = null;
    let formula = '';
    let steps: string[] = [];

    switch (mode) {
      case 'hypotenuse':
        if (a > 0 && b > 0) {
          calculated = Math.sqrt(a * a + b * b);
          formula = 'c = √(a² + b²)';
          steps = [
            `a² = ${a}² = ${a * a}`,
            `b² = ${b}² = ${b * b}`,
            `a² + b² = ${a * a} + ${b * b} = ${a * a + b * b}`,
            `c = √${a * a + b * b} = ${calculated.toFixed(4)}`
          ];
        }
        break;

      case 'leg-a':
        if (c > 0 && b > 0 && c > b) {
          calculated = Math.sqrt(c * c - b * b);
          formula = 'a = √(c² - b²)';
          steps = [
            `c² = ${c}² = ${c * c}`,
            `b² = ${b}² = ${b * b}`,
            `c² - b² = ${c * c} - ${b * b} = ${c * c - b * b}`,
            `a = √${c * c - b * b} = ${calculated.toFixed(4)}`
          ];
        } else if (c > 0 && b > 0 && c <= b) {
          return { error: t('errorHypotenuseTooSmall') };
        }
        break;

      case 'leg-b':
        if (c > 0 && a > 0 && c > a) {
          calculated = Math.sqrt(c * c - a * a);
          formula = 'b = √(c² - a²)';
          steps = [
            `c² = ${c}² = ${c * c}`,
            `a² = ${a}² = ${a * a}`,
            `c² - a² = ${c * c} - ${a * a} = ${c * c - a * a}`,
            `b = √${c * c - a * a} = ${calculated.toFixed(4)}`
          ];
        } else if (c > 0 && a > 0 && c <= a) {
          return { error: t('errorHypotenuseTooSmall') };
        }
        break;
    }

    if (calculated === null) return null;

    // Check if it's a Pythagorean triple
    const allSides = mode === 'hypotenuse' ? [a, b, calculated] :
                     mode === 'leg-a' ? [calculated, b, c] : [a, calculated, c];
    const isPythagoreanTriple = allSides.every(s => Number.isInteger(s));

    return {
      value: calculated,
      formula,
      steps,
      allSides,
      isPythagoreanTriple,
      area: (allSides[0] * allSides[1]) / 2,
      perimeter: allSides[0] + allSides[1] + allSides[2]
    };
  }, [mode, sideA, sideB, hypotenuse, t]);

  const formatNumber = (value: number): string => {
    if (Number.isInteger(value)) return value.toString();
    return value.toFixed(4).replace(/\.?0+$/, '');
  };

  const handleReset = () => {
    setSideA('');
    setSideB('');
    setHypotenuse('');
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Common Pythagorean triples for quick selection
  const pythagoreanTriples = [
    { a: 3, b: 4, c: 5 },
    { a: 5, b: 12, c: 13 },
    { a: 8, b: 15, c: 17 },
    { a: 7, b: 24, c: 25 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-blue-100 rounded-2xl mb-4">
            <Triangle className="w-8 h-8 text-blue-600" />
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

          {/* Quick Pythagorean Triples */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('commonTriples')}
            </label>
            <div className="flex flex-wrap gap-2">
              {pythagoreanTriples.map((triple, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSideA(triple.a.toString());
                    setSideB(triple.b.toString());
                    setHypotenuse(triple.c.toString());
                  }}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  {triple.a}-{triple.b}-{triple.c}
                </button>
              ))}
            </div>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('sideA')} (a)
              </label>
              <input
                type="number"
                value={sideA}
                onChange={(e) => setSideA(e.target.value)}
                disabled={mode === 'leg-a'}
                placeholder="0"
                step="any"
                className={`w-full px-4 py-3 text-lg border-2 rounded-xl transition-colors ${
                  mode === 'leg-a'
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {mode === 'leg-a' && (
                <span className="text-xs text-blue-600 mt-1 block">{t('calculating')}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('sideB')} (b)
              </label>
              <input
                type="number"
                value={sideB}
                onChange={(e) => setSideB(e.target.value)}
                disabled={mode === 'leg-b'}
                placeholder="0"
                step="any"
                className={`w-full px-4 py-3 text-lg border-2 rounded-xl transition-colors ${
                  mode === 'leg-b'
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {mode === 'leg-b' && (
                <span className="text-xs text-blue-600 mt-1 block">{t('calculating')}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('hypotenuse')} (c)
              </label>
              <input
                type="number"
                value={hypotenuse}
                onChange={(e) => setHypotenuse(e.target.value)}
                disabled={mode === 'hypotenuse'}
                placeholder="0"
                step="any"
                className={`w-full px-4 py-3 text-lg border-2 rounded-xl transition-colors ${
                  mode === 'hypotenuse'
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {mode === 'hypotenuse' && (
                <span className="text-xs text-blue-600 mt-1 block">{t('calculating')}</span>
              )}
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {t('reset')}
          </button>

          {/* Results */}
          {result && !('error' in result) && (
            <div className="space-y-4">
              {/* Main Result */}
              <div className="p-5 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-blue-700">{t('result')}</h3>
                  {result.isPythagoreanTriple && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      {t('pythagoreanTriple')}
                    </span>
                  )}
                </div>
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  {formatNumber(result.value)}
                </p>
                <p className="text-sm text-blue-600 font-mono">{result.formula}</p>
              </div>

              {/* Step by Step */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="text-sm font-medium text-gray-700 mb-3">{t('stepByStep')}</h3>
                <div className="space-y-2">
                  {result.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-mono text-gray-600">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <span className="text-xs text-gray-500 block mb-1">{t('triangleArea')}</span>
                  <span className="text-lg font-bold text-gray-700">{formatNumber(result.area)}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <span className="text-xs text-gray-500 block mb-1">{t('perimeter')}</span>
                  <span className="text-lg font-bold text-gray-700">{formatNumber(result.perimeter)}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <span className="text-xs text-gray-500 block mb-1">{t('allSides')}</span>
                  <span className="text-lg font-bold text-gray-700">
                    {result.allSides.map(s => formatNumber(s)).join(', ')}
                  </span>
                </div>
              </div>

              {/* Formula Box */}
              <div className="p-3 bg-blue-50 rounded-xl">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">{t('pythagoreanTheorem')}:</p>
                    <p className="font-mono text-lg">a² + b² = c²</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {result && 'error' in result && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-600">{result.error}</p>
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
