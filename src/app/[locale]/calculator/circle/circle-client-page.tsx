'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Circle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Copy,
  Check
} from 'lucide-react';

type CalculationMode = 'radius' | 'diameter' | 'circumference' | 'area';

export default function CircleClientPage() {
  const t = useTranslations('CircleCalculator');

  const [mode, setMode] = useState<CalculationMode>('radius');
  const [inputValue, setInputValue] = useState<string>('5');
  const [precision, setPrecision] = useState<number>(4);
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howTo: false,
    formulas: false,
    faq: false
  });

  const modes = [
    { id: 'radius', label: t('modeRadius'), description: t('modeRadiusDesc') },
    { id: 'diameter', label: t('modeDiameter'), description: t('modeDiameterDesc') },
    { id: 'circumference', label: t('modeCircumference'), description: t('modeCircumferenceDesc') },
    { id: 'area', label: t('modeArea'), description: t('modeAreaDesc') },
  ];

  const quickValues = [1, 2, 5, 10, 15, 20, 25, 50, 100];

  const result = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value) || value <= 0) return null;

    let radius: number;
    let inputLabel: string;
    let inputFormula: string;

    switch (mode) {
      case 'radius':
        radius = value;
        inputLabel = t('radius');
        inputFormula = `r = ${value}`;
        break;
      case 'diameter':
        radius = value / 2;
        inputLabel = t('diameter');
        inputFormula = `d = ${value}, r = d/2 = ${radius}`;
        break;
      case 'circumference':
        radius = value / (2 * Math.PI);
        inputLabel = t('circumference');
        inputFormula = `C = ${value}, r = C/(2π) = ${radius.toFixed(precision)}`;
        break;
      case 'area':
        radius = Math.sqrt(value / Math.PI);
        inputLabel = t('area');
        inputFormula = `A = ${value}, r = √(A/π) = ${radius.toFixed(precision)}`;
        break;
      default:
        return null;
    }

    const diameter = radius * 2;
    const circumference = 2 * Math.PI * radius;
    const area = Math.PI * radius * radius;

    return {
      radius,
      diameter,
      circumference,
      area,
      inputLabel,
      inputFormula,
      steps: {
        diameter: `d = 2r = 2 × ${radius.toFixed(precision)} = ${diameter.toFixed(precision)}`,
        circumference: `C = 2πr = 2 × π × ${radius.toFixed(precision)} = ${circumference.toFixed(precision)}`,
        area: `A = πr² = π × ${radius.toFixed(precision)}² = ${area.toFixed(precision)}`
      }
    };
  }, [mode, inputValue, precision, t]);

  const formatNumber = (value: number): string => {
    return value.toFixed(precision).replace(/\.?0+$/, '');
  };

  const handleReset = () => {
    setInputValue('');
  };

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
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
            <Circle className="w-8 h-8 text-blue-600" />
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {modes.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as CalculationMode)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    mode === m.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className={`block font-medium text-sm ${mode === m.id ? 'text-blue-700' : 'text-gray-700'}`}>
                    {m.label}
                  </span>
                  <span className="text-xs text-gray-500">{m.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Values */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('quickValues')}
            </label>
            <div className="flex flex-wrap gap-2">
              {quickValues.map((val) => (
                <button
                  key={val}
                  onClick={() => setInputValue(val.toString())}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Input Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('enterValue')} ({modes.find(m => m.id === mode)?.label})
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="0"
              step="any"
              min="0"
              className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Precision Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('decimalPlaces')}
            </label>
            <div className="flex gap-2">
              {[2, 4, 6, 8].map((p) => (
                <button
                  key={p}
                  onClick={() => setPrecision(p)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    precision === p
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}
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
          {result && (
            <div className="space-y-4">
              {/* Input Summary */}
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 font-mono">{result.inputFormula}</p>
              </div>

              {/* Main Results Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Radius */}
                <div className={`p-4 rounded-xl border-2 ${mode === 'radius' ? 'bg-gray-100 border-gray-300' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">{t('radius')} (r)</span>
                    <button
                      onClick={() => handleCopy(formatNumber(result.radius), 'radius')}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      {copied === 'radius' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
                    </button>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{formatNumber(result.radius)}</p>
                </div>

                {/* Diameter */}
                <div className={`p-4 rounded-xl border-2 ${mode === 'diameter' ? 'bg-gray-100 border-gray-300' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">{t('diameter')} (d)</span>
                    <button
                      onClick={() => handleCopy(formatNumber(result.diameter), 'diameter')}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      {copied === 'diameter' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
                    </button>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{formatNumber(result.diameter)}</p>
                </div>

                {/* Circumference */}
                <div className={`p-4 rounded-xl border-2 ${mode === 'circumference' ? 'bg-gray-100 border-gray-300' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">{t('circumference')} (C)</span>
                    <button
                      onClick={() => handleCopy(formatNumber(result.circumference), 'circumference')}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      {copied === 'circumference' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
                    </button>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{formatNumber(result.circumference)}</p>
                </div>

                {/* Area */}
                <div className={`p-4 rounded-xl border-2 ${mode === 'area' ? 'bg-gray-100 border-gray-300' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">{t('area')} (A)</span>
                    <button
                      onClick={() => handleCopy(formatNumber(result.area), 'area')}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      {copied === 'area' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
                    </button>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{formatNumber(result.area)}</p>
                </div>
              </div>

              {/* Step by Step */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="text-sm font-medium text-gray-700 mb-3">{t('stepByStep')}</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">1</span>
                    <span className="text-sm font-mono text-gray-600">{result.steps.diameter}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">2</span>
                    <span className="text-sm font-mono text-gray-600">{result.steps.circumference}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">3</span>
                    <span className="text-sm font-mono text-gray-600">{result.steps.area}</span>
                  </div>
                </div>
              </div>

              {/* Pi Info */}
              <div className="p-3 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">π (pi)</span> ≈ 3.14159265358979...
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

          {/* Formulas Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('formulas')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('formulas.title')}</h2>
              {expandedSections.formulas ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.formulas && (
              <div className="px-6 pb-6">
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('formulas.content') }}
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
