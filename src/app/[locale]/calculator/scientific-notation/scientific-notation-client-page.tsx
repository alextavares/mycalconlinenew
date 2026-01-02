'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRightLeft, Calculator, FlaskConical, ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'toScientific' | 'toDecimal' | 'operations';

export default function ScientificNotationClientPage() {
  const t = useTranslations('ScientificNotationCalculator');

  // State
  const [mode, setMode] = useState<CalculationMode>('toScientific');
  const [decimalInput, setDecimalInput] = useState<string>('');
  const [coefficient, setCoefficient] = useState<string>('');
  const [exponent, setExponent] = useState<string>('');

  // For operations mode
  const [coef1, setCoef1] = useState<string>('');
  const [exp1, setExp1] = useState<string>('');
  const [coef2, setCoef2] = useState<string>('');
  const [exp2, setExp2] = useState<string>('');
  const [operation, setOperation] = useState<string>('multiply');

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howTo: false,
    examples: false,
    faq: false
  });

  const modes = [
    {
      id: 'toScientific' as CalculationMode,
      icon: FlaskConical,
      label: t('toScientificMode'),
      description: t('toScientificDescription')
    },
    {
      id: 'toDecimal' as CalculationMode,
      icon: ArrowRightLeft,
      label: t('toDecimalMode'),
      description: t('toDecimalDescription')
    },
    {
      id: 'operations' as CalculationMode,
      icon: Calculator,
      label: t('operationsMode'),
      description: t('operationsDescription')
    }
  ];

  // Convert decimal to scientific notation
  const toScientificNotation = (num: number) => {
    if (num === 0) return { coefficient: 0, exponent: 0 };

    const absNum = Math.abs(num);
    const exp = Math.floor(Math.log10(absNum));
    const coef = num / Math.pow(10, exp);

    return { coefficient: coef, exponent: exp };
  };

  // Calculate results based on mode
  const result = useMemo(() => {
    if (mode === 'toScientific') {
      const num = parseFloat(decimalInput);
      if (isNaN(num)) return null;

      const { coefficient: coef, exponent: exp } = toScientificNotation(num);

      return {
        type: 'toScientific',
        original: num,
        coefficient: coef.toFixed(4),
        exponent: exp,
        formatted: `${coef.toFixed(4)} × 10^${exp}`
      };
    }

    if (mode === 'toDecimal') {
      const coef = parseFloat(coefficient);
      const exp = parseFloat(exponent);

      if (isNaN(coef) || isNaN(exp)) return null;

      const decimal = coef * Math.pow(10, exp);

      return {
        type: 'toDecimal',
        coefficient: coef,
        exponent: exp,
        decimal: decimal,
        formatted: decimal.toLocaleString('en-US', { maximumFractionDigits: 10 })
      };
    }

    if (mode === 'operations') {
      const c1 = parseFloat(coef1);
      const e1 = parseFloat(exp1);
      const c2 = parseFloat(coef2);
      const e2 = parseFloat(exp2);

      if (isNaN(c1) || isNaN(e1) || isNaN(c2) || isNaN(e2)) return null;

      const num1 = c1 * Math.pow(10, e1);
      const num2 = c2 * Math.pow(10, e2);

      let resultNum = 0;
      switch (operation) {
        case 'multiply':
          resultNum = num1 * num2;
          break;
        case 'divide':
          resultNum = num1 / num2;
          break;
        case 'add':
          resultNum = num1 + num2;
          break;
        case 'subtract':
          resultNum = num1 - num2;
          break;
      }

      const { coefficient: resCoef, exponent: resExp } = toScientificNotation(resultNum);

      return {
        type: 'operations',
        operation,
        num1: `${c1} × 10^${e1}`,
        num2: `${c2} × 10^${e2}`,
        result: resultNum,
        coefficient: resCoef.toFixed(4),
        exponent: resExp,
        formatted: `${resCoef.toFixed(4)} × 10^${resExp}`
      };
    }

    return null;
  }, [mode, decimalInput, coefficient, exponent, coef1, exp1, coef2, exp2, operation]);

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {modes.map(modeOption => (
                <button
                  key={modeOption.id}
                  onClick={() => setMode(modeOption.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    mode === modeOption.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <modeOption.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      mode === modeOption.id ? 'text-purple-600' : 'text-gray-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium mb-1 ${
                        mode === modeOption.id ? 'text-purple-700' : 'text-gray-900'
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
            {mode === 'toScientific' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('decimalNumber')}
                </label>
                <input
                  type="text"
                  value={decimalInput}
                  onChange={(e) => setDecimalInput(e.target.value)}
                  placeholder="0.00000045"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                />
                <div className="mt-2 flex gap-2 flex-wrap">
                  {['0.00000045', '123000000', '0.0025', '6780000'].map(preset => (
                    <button
                      key={preset}
                      onClick={() => setDecimalInput(preset)}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'toDecimal' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('coefficient')}
                  </label>
                  <input
                    type="number"
                    value={coefficient}
                    onChange={(e) => setCoefficient(e.target.value)}
                    placeholder="4.5"
                    step="0.1"
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
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
                    placeholder="-7"
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                  />
                </div>
                <div className="text-center text-sm text-gray-600 mt-2">
                  {t('format')}: {coefficient || 'a'} × 10^{exponent || 'n'}
                </div>
              </div>
            )}

            {mode === 'operations' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('number1Coef')}
                    </label>
                    <input
                      type="number"
                      value={coef1}
                      onChange={(e) => setCoef1(e.target.value)}
                      placeholder="2.5"
                      step="0.1"
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('number1Exp')}
                    </label>
                    <input
                      type="number"
                      value={exp1}
                      onChange={(e) => setExp1(e.target.value)}
                      placeholder="3"
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('operation')}
                  </label>
                  <select
                    value={operation}
                    onChange={(e) => setOperation(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                  >
                    <option value="multiply">{t('multiply')}</option>
                    <option value="divide">{t('divide')}</option>
                    <option value="add">{t('add')}</option>
                    <option value="subtract">{t('subtract')}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('number2Coef')}
                    </label>
                    <input
                      type="number"
                      value={coef2}
                      onChange={(e) => setCoef2(e.target.value)}
                      placeholder="4.0"
                      step="0.1"
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('number2Exp')}
                    </label>
                    <input
                      type="number"
                      value={exp2}
                      onChange={(e) => setExp2(e.target.value)}
                      placeholder="2"
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="mt-6 p-5 bg-purple-50 rounded-xl border-2 border-purple-200">
              {result.type === 'toScientific' && (
                <div>
                  <div className="text-sm text-purple-600 font-medium mb-2">
                    {t('scientificNotation')}
                  </div>
                  <div className="text-3xl font-bold text-purple-700 mb-3 font-mono">
                    {result.formatted}
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>{t('original')}:</span>
                      <span className="font-medium">{result.original}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('coefficient')}:</span>
                      <span className="font-medium">{result.coefficient}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('exponent')}:</span>
                      <span className="font-medium">{result.exponent}</span>
                    </div>
                  </div>
                </div>
              )}

              {result.type === 'toDecimal' && (
                <div>
                  <div className="text-sm text-purple-600 font-medium mb-2">
                    {t('decimalForm')}
                  </div>
                  <div className="text-3xl font-bold text-purple-700 mb-3">
                    {result.formatted}
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>{t('scientificNotation')}:</span>
                      <span className="font-medium font-mono">{result.coefficient} × 10^{result.exponent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('exactValue')}:</span>
                      <span className="font-medium">{result.decimal}</span>
                    </div>
                  </div>
                </div>
              )}

              {result.type === 'operations' && (
                <div>
                  <div className="text-sm text-purple-600 font-medium mb-2">
                    {t('result')}
                  </div>
                  <div className="text-2xl font-bold text-purple-700 mb-3 font-mono">
                    {result.formatted}
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>{t('calculation')}:</span>
                      <span className="font-medium font-mono">
                        {result.num1} {operation === 'multiply' && '×'}
                        {operation === 'divide' && '÷'}
                        {operation === 'add' && '+'}
                        {operation === 'subtract' && '-'} {result.num2}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('decimalForm')}:</span>
                      <span className="font-medium">{result.result.toLocaleString('en-US', { maximumFractionDigits: 10 })}</span>
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
