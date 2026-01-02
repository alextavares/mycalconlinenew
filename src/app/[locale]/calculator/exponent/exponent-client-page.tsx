'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Calculator, TrendingUp, Square, ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'power' | 'root' | 'logarithm';

export default function ExponentClientPage() {
  const t = useTranslations('ExponentCalculator');

  const [mode, setMode] = useState<CalculationMode>('power');
  const [base, setBase] = useState<string>('2');
  const [exponent, setExponent] = useState<string>('3');
  const [radicand, setRadicand] = useState<string>('64');
  const [rootIndex, setRootIndex] = useState<string>('3');
  const [logValue, setLogValue] = useState<string>('8');
  const [logBase, setLogBase] = useState<string>('2');

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howTo: false,
    examples: false,
    faq: false
  });

  const modes = [
    {
      id: 'power',
      icon: TrendingUp,
      label: t('modePower'),
      description: t('modePowerDesc')
    },
    {
      id: 'root',
      icon: Square,
      label: t('modeRoot'),
      description: t('modeRootDesc')
    },
    {
      id: 'logarithm',
      icon: Calculator,
      label: t('modeLogarithm'),
      description: t('modeLogarithmDesc')
    },
  ];

  const result = useMemo(() => {
    try {
      switch (mode) {
        case 'power': {
          const b = parseFloat(base);
          const e = parseFloat(exponent);
          if (isNaN(b) || isNaN(e)) return null;
          const res = Math.pow(b, e);
          return {
            value: res,
            formula: `${b}^${e} = ${res.toLocaleString(undefined, { maximumFractionDigits: 10 })}`
          };
        }
        case 'root': {
          const r = parseFloat(radicand);
          const n = parseFloat(rootIndex);
          if (isNaN(r) || isNaN(n) || n === 0) return null;
          const res = Math.pow(r, 1 / n);
          return {
            value: res,
            formula: `${n}√${r} = ${res.toLocaleString(undefined, { maximumFractionDigits: 10 })}`
          };
        }
        case 'logarithm': {
          const v = parseFloat(logValue);
          const b = parseFloat(logBase);
          if (isNaN(v) || isNaN(b) || v <= 0 || b <= 0 || b === 1) return null;
          const res = Math.log(v) / Math.log(b);
          return {
            value: res,
            formula: `log₍${b}₎(${v}) = ${res.toLocaleString(undefined, { maximumFractionDigits: 10 })}`
          };
        }
      }
    } catch {
      return null;
    }
  }, [mode, base, exponent, radicand, rootIndex, logValue, logBase]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const setQuickValue = (mode: CalculationMode, values: { base?: string; exponent?: string; radicand?: string; rootIndex?: string; logValue?: string; logBase?: string }) => {
    setMode(mode);
    if (values.base !== undefined) setBase(values.base);
    if (values.exponent !== undefined) setExponent(values.exponent);
    if (values.radicand !== undefined) setRadicand(values.radicand);
    if (values.rootIndex !== undefined) setRootIndex(values.rootIndex);
    if (values.logValue !== undefined) setLogValue(values.logValue);
    if (values.logBase !== undefined) setLogBase(values.logBase);
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
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
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

          {/* Power Mode */}
          {mode === 'power' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('base')}
                  </label>
                  <input
                    type="number"
                    value={base}
                    onChange={(e) => setBase(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors"
                    placeholder={t('basePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('exponent')}
                  </label>
                  <input
                    type="number"
                    value={exponent}
                    onChange={(e) => setExponent(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors"
                    placeholder={t('exponentPlaceholder')}
                  />
                </div>
              </div>

              {/* Quick Values */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('quickValues')}
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setQuickValue('power', { base: '2', exponent: '8' })}
                    className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    2⁸
                  </button>
                  <button
                    onClick={() => setQuickValue('power', { base: '10', exponent: '3' })}
                    className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    10³
                  </button>
                  <button
                    onClick={() => setQuickValue('power', { base: '5', exponent: '2' })}
                    className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    5²
                  </button>
                  <button
                    onClick={() => setQuickValue('power', { base: '3', exponent: '4' })}
                    className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    3⁴
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Root Mode */}
          {mode === 'root' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('rootIndex')}
                  </label>
                  <input
                    type="number"
                    value={rootIndex}
                    onChange={(e) => setRootIndex(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors"
                    placeholder={t('rootIndexPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('radicand')}
                  </label>
                  <input
                    type="number"
                    value={radicand}
                    onChange={(e) => setRadicand(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors"
                    placeholder={t('radicandPlaceholder')}
                  />
                </div>
              </div>

              {/* Quick Values */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('quickValues')}
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setQuickValue('root', { rootIndex: '2', radicand: '16' })}
                    className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    √16
                  </button>
                  <button
                    onClick={() => setQuickValue('root', { rootIndex: '3', radicand: '27' })}
                    className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    ∛27
                  </button>
                  <button
                    onClick={() => setQuickValue('root', { rootIndex: '2', radicand: '144' })}
                    className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    √144
                  </button>
                  <button
                    onClick={() => setQuickValue('root', { rootIndex: '4', radicand: '81' })}
                    className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    ⁴√81
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Logarithm Mode */}
          {mode === 'logarithm' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('logBase')}
                  </label>
                  <input
                    type="number"
                    value={logBase}
                    onChange={(e) => setLogBase(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors"
                    placeholder={t('logBasePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('logValue')}
                  </label>
                  <input
                    type="number"
                    value={logValue}
                    onChange={(e) => setLogValue(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors"
                    placeholder={t('logValuePlaceholder')}
                  />
                </div>
              </div>

              {/* Quick Values */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('quickValues')}
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setQuickValue('logarithm', { logBase: '10', logValue: '100' })}
                    className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    log₁₀(100)
                  </button>
                  <button
                    onClick={() => setQuickValue('logarithm', { logBase: '2', logValue: '8' })}
                    className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    log₂(8)
                  </button>
                  <button
                    onClick={() => setQuickValue('logarithm', { logBase: 'e', logValue: '7.389' })}
                    className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    ln(7.389)
                  </button>
                  <button
                    onClick={() => setQuickValue('logarithm', { logBase: '10', logValue: '1000' })}
                    className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    log₁₀(1000)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-6 p-5 bg-indigo-50 rounded-xl border-2 border-indigo-200">
              <div className="text-sm text-indigo-600 font-medium mb-1">{t('result')}</div>
              <div className="text-3xl font-bold text-indigo-900 mb-2">
                {result.value.toLocaleString(undefined, { maximumFractionDigits: 10 })}
              </div>
              <div className="text-sm text-indigo-700 font-mono">
                {result.formula}
              </div>
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

          {/* How To Use */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('howTo')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('howToUse')}</h2>
              {expandedSections.howTo ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.howTo && (
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">
                  {t('howToUseContent')}
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
