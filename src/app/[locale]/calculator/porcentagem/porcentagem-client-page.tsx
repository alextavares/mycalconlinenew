'use client'

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Calculator, Percent, TrendingUp, TrendingDown, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

type CalculationMode = 'percent-of' | 'what-percent' | 'percent-increase' | 'percent-decrease';

export default function PorcentagemClientPage() {
  const t = useTranslations('PercentageCalculator');

  // State
  const [mode, setMode] = useState<CalculationMode>('percent-of');
  const [input1, setInput1] = useState<string>('');
  const [input2, setInput2] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    whatIs: true,
    howTo: false,
    examples: false,
    faq: false,
  });

  // Calculate based on mode
  const handleCalculate = () => {
    const val1 = parseFloat(input1);
    const val2 = parseFloat(input2);

    if (isNaN(val1) || isNaN(val2)) {
      alert(t('errorInvalidInput') || 'Please enter valid numbers');
      return;
    }

    let calculatedResult: number;

    switch (mode) {
      case 'percent-of':
        // X% of Y = (X/100) * Y
        calculatedResult = (val1 / 100) * val2;
        break;
      case 'what-percent':
        // X is what % of Y = (X/Y) * 100
        if (val2 === 0) {
          alert(t('errorDivisionByZero') || 'Cannot divide by zero');
          return;
        }
        calculatedResult = (val1 / val2) * 100;
        break;
      case 'percent-increase':
        // % increase from X to Y = ((Y-X)/X) * 100
        if (val1 === 0) {
          alert(t('errorDivisionByZero') || 'Cannot divide by zero');
          return;
        }
        calculatedResult = ((val2 - val1) / val1) * 100;
        break;
      case 'percent-decrease':
        // % decrease from X to Y = ((X-Y)/X) * 100
        if (val1 === 0) {
          alert(t('errorDivisionByZero') || 'Cannot divide by zero');
          return;
        }
        calculatedResult = ((val1 - val2) / val1) * 100;
        break;
    }

    setResult(calculatedResult);
  };

  const handleClear = () => {
    setInput1('');
    setInput2('');
    setResult(null);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Mode configurations
  const modes = [
    {
      id: 'percent-of' as CalculationMode,
      icon: Percent,
      label: t('modePercentOf') || 'X% of Y',
      input1Label: t('percentLabel') || 'Percent',
      input2Label: t('valueLabel') || 'Value',
      resultLabel: t('resultLabel') || 'Result',
      example: '20% of 100 = 20',
    },
    {
      id: 'what-percent' as CalculationMode,
      icon: Calculator,
      label: t('modeWhatPercent') || 'X is what % of Y',
      input1Label: t('partLabel') || 'Part (X)',
      input2Label: t('wholeLabel') || 'Whole (Y)',
      resultLabel: t('percentageLabel') || 'Percentage',
      example: '25 is 25% of 100',
    },
    {
      id: 'percent-increase' as CalculationMode,
      icon: TrendingUp,
      label: t('modePercentIncrease') || '% Increase',
      input1Label: t('originalLabel') || 'Original',
      input2Label: t('newLabel') || 'New',
      resultLabel: t('increaseLabel') || '% Increase',
      example: 'From 100 to 120 = 20% increase',
    },
    {
      id: 'percent-decrease' as CalculationMode,
      icon: TrendingDown,
      label: t('modePercentDecrease') || '% Decrease',
      input1Label: t('originalLabel') || 'Original',
      input2Label: t('newLabel') || 'New',
      resultLabel: t('decreaseLabel') || '% Decrease',
      example: 'From 100 to 80 = 20% decrease',
    },
  ];

  const currentMode = modes.find(m => m.id === mode) || modes[0];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
            <div className="flex items-center gap-3">
              <Percent className="w-8 h-8" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{t('title')}</h1>
                <p className="text-white/80 text-sm mt-1">{t('subtitle') || 'Calculate percentages, increases, decreases, and more'}</p>
              </div>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {modes.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMode(m.id);
                      setResult(null);
                    }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      mode === m.id
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 hover:border-primary/50 text-gray-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium text-center">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calculator Body */}
          <div className="p-6">
            {/* Mode Description */}
            <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>{currentMode.label}:</strong> {currentMode.example}
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentMode.input1Label}
                </label>
                <input
                  type="number"
                  value={input1}
                  onChange={(e) => setInput1(e.target.value)}
                  className="w-full p-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary outline-none transition-colors"
                  placeholder="Enter value"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentMode.input2Label}
                </label>
                <input
                  type="number"
                  value={input2}
                  onChange={(e) => setInput2(e.target.value)}
                  className="w-full p-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary outline-none transition-colors"
                  placeholder="Enter value"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCalculate}
                className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg shadow-primary/25 transition-all hover:shadow-xl"
              >
                {t('calculateButton') || 'Calculate'}
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl flex items-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                {t('clearButton') || 'Clear'}
              </button>
            </div>

            {/* Result */}
            {result !== null && (
              <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="text-center">
                  <span className="text-sm font-medium text-green-600 uppercase tracking-wide">
                    {currentMode.resultLabel}
                  </span>
                  <div className="mt-2 text-4xl font-bold text-gray-900">
                    {mode === 'percent-of'
                      ? result.toLocaleString(undefined, { maximumFractionDigits: 2 })
                      : `${result.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`
                    }
                  </div>

                  {/* Formula display */}
                  <div className="mt-4 text-sm text-gray-600 bg-white/50 p-3 rounded-lg font-mono">
                    {mode === 'percent-of' && `${input1}% of ${input2} = (${input1} ÷ 100) × ${input2} = ${result.toFixed(2)}`}
                    {mode === 'what-percent' && `${input1} is ${result.toFixed(2)}% of ${input2}`}
                    {mode === 'percent-increase' && `From ${input1} to ${input2} = ${result > 0 ? '+' : ''}${result.toFixed(2)}% change`}
                    {mode === 'percent-decrease' && `From ${input1} to ${input2} = ${result.toFixed(2)}% change`}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEO Content Sections */}
        <div className="mt-8 space-y-4">
          {/* What is a Percentage */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleSection('whatIs')}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-bold text-gray-900">{t('whatIs.title') || 'What is a Percentage?'}</h2>
              {expandedSections.whatIs ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {expandedSections.whatIs && (
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{
                  __html: t.raw('whatIs.content') || 'A <strong>percentage</strong> is a way to express a number as a fraction of 100. The word "percent" comes from the Latin "per centum," meaning "by the hundred." Percentages are used in many aspects of daily life, from calculating discounts to understanding statistics.<br/><br/>For example, <strong>50%</strong> means 50 out of 100, or half. It can also be written as 0.5 as a decimal or 1/2 as a fraction.'
                }}></p>
              </div>
            )}
          </div>

          {/* How to Calculate */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleSection('howTo')}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-bold text-gray-900">{t('howTo.title') || 'How to Calculate Percentages'}</h2>
              {expandedSections.howTo ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {expandedSections.howTo && (
              <div className="px-6 pb-6 space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">{t('howTo.percentOf') || 'Find X% of Y'}</h3>
                  <p className="text-blue-800 text-sm mb-2">Formula: (X ÷ 100) × Y</p>
                  <div className="bg-white p-3 rounded font-mono text-sm">Example: 25% of 200 = (25 ÷ 100) × 200 = 50</div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">{t('howTo.whatPercent') || 'X is what % of Y'}</h3>
                  <p className="text-purple-800 text-sm mb-2">Formula: (X ÷ Y) × 100</p>
                  <div className="bg-white p-3 rounded font-mono text-sm">Example: 30 is what % of 150? = (30 ÷ 150) × 100 = 20%</div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">{t('howTo.percentChange') || 'Percentage Change'}</h3>
                  <p className="text-green-800 text-sm mb-2">Formula: ((New - Old) ÷ Old) × 100</p>
                  <div className="bg-white p-3 rounded font-mono text-sm">Example: From 50 to 60 = ((60 - 50) ÷ 50) × 100 = 20% increase</div>
                </div>
              </div>
            )}
          </div>

          {/* Common Examples */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleSection('examples')}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-bold text-gray-900">{t('examples.title') || 'Common Examples'}</h2>
              {expandedSections.examples ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {expandedSections.examples && (
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded">
                    <strong className="text-blue-900">Sales Tax:</strong>
                    <p className="text-sm text-blue-800">If an item costs $100 and sales tax is 8%, you pay $100 + (8% of $100) = $108</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-3 rounded">
                    <strong className="text-green-900">Discount:</strong>
                    <p className="text-sm text-green-800">30% off $80 = $80 - (30% of $80) = $80 - $24 = $56</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded">
                    <strong className="text-purple-900">Tip:</strong>
                    <p className="text-sm text-purple-800">15% tip on $50 meal = 15% of $50 = $7.50</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 p-3 rounded">
                    <strong className="text-orange-900">Test Score:</strong>
                    <p className="text-sm text-orange-800">45 correct out of 50 = (45 ÷ 50) × 100 = 90%</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleSection('faq')}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-bold text-gray-900">{t('faq.title') || 'Frequently Asked Questions'}</h2>
              {expandedSections.faq ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {expandedSections.faq && (
              <div className="px-6 pb-6 space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-gray-900">{t('faq.q1') || 'How do I convert a percentage to a decimal?'}</h3>
                  <p className="text-gray-600 text-sm mt-1">{t('faq.a1') || 'Divide the percentage by 100. For example, 75% = 75 ÷ 100 = 0.75'}</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-gray-900">{t('faq.q2') || 'How do I convert a decimal to a percentage?'}</h3>
                  <p className="text-gray-600 text-sm mt-1">{t('faq.a2') || 'Multiply the decimal by 100. For example, 0.45 = 0.45 × 100 = 45%'}</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-gray-900">{t('faq.q3') || 'What is 100 percent?'}</h3>
                  <p className="text-gray-600 text-sm mt-1">{t('faq.a3') || '100% means the whole amount or everything. It represents the complete value without any change.'}</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-gray-900">{t('faq.q4') || 'Can a percentage be greater than 100%?'}</h3>
                  <p className="text-gray-600 text-sm mt-1">{t('faq.a4') || 'Yes! Percentages over 100% represent values greater than the original. For example, if something doubles, that\'s a 100% increase, resulting in 200% of the original.'}</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-gray-900">{t('faq.q5') || 'How do I calculate percentage increase or decrease?'}</h3>
                  <p className="text-gray-600 text-sm mt-1">{t('faq.a5') || 'Use the formula: ((New Value - Old Value) ÷ Old Value) × 100. A positive result is an increase, negative is a decrease.'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
