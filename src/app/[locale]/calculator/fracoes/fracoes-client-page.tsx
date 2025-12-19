'use client'
import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Calculator, Plus, Minus, X, Divide, RotateCcw, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface Fraction {
  numerator: number;
  denominator: number;
}

interface MixedNumber {
  whole: number;
  numerator: number;
  denominator: number;
}

export default function FracoesClientPage() {
  const t = useTranslations('FractionCalculator');

  // State for number of fractions (2, 3, or 4)
  const [fractionCount, setFractionCount] = useState<2 | 3 | 4>(2);

  // State for fractions
  const [fractions, setFractions] = useState<Fraction[]>([
    { numerator: 1, denominator: 2 },
    { numerator: 1, denominator: 4 },
    { numerator: 0, denominator: 1 },
    { numerator: 0, denominator: 1 },
  ]);

  // State for operations between fractions
  const [operations, setOperations] = useState<('+' | '-' | '*' | '/')[]>(['+', '+', '+']);

  // State for result
  const [result, setResult] = useState<Fraction | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [calculationSteps, setCalculationSteps] = useState<string[]>([]);

  // Expanded sections state
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    howToAdd: true,
    howToSubtract: false,
    howToMultiply: false,
    howToDivide: false,
    faq: false,
  });

  // GCD function
  const gcd = (a: number, b: number): number => {
    a = Math.abs(a);
    b = Math.abs(b);
    if (b === 0) return a;
    return gcd(b, a % b);
  };

  // LCM function
  const lcm = (a: number, b: number): number => {
    return Math.abs(a * b) / gcd(a, b);
  };

  // Simplify fraction
  const simplifyFraction = (fraction: Fraction): Fraction => {
    if (fraction.denominator === 0) return { numerator: 0, denominator: 0 };
    const divisor = gcd(Math.abs(fraction.numerator), Math.abs(fraction.denominator));
    let num = fraction.numerator / divisor;
    let den = fraction.denominator / divisor;
    if (den < 0) {
      num = -num;
      den = -den;
    }
    return { numerator: num, denominator: den };
  };

  // Convert to mixed number
  const toMixedNumber = (fraction: Fraction): MixedNumber => {
    const whole = Math.floor(Math.abs(fraction.numerator) / fraction.denominator);
    const remainder = Math.abs(fraction.numerator) % fraction.denominator;
    const sign = fraction.numerator < 0 ? -1 : 1;
    return {
      whole: sign * whole,
      numerator: remainder,
      denominator: fraction.denominator
    };
  };

  // Convert to decimal
  const toDecimal = (fraction: Fraction): number => {
    if (fraction.denominator === 0) return 0;
    return fraction.numerator / fraction.denominator;
  };

  // Calculate two fractions
  const calculateTwo = (f1: Fraction, f2: Fraction, op: '+' | '-' | '*' | '/'): { result: Fraction; steps: string[] } => {
    const steps: string[] = [];
    let result: Fraction;

    switch (op) {
      case '+': {
        const commonDen = lcm(f1.denominator, f2.denominator);
        const num1 = f1.numerator * (commonDen / f1.denominator);
        const num2 = f2.numerator * (commonDen / f2.denominator);
        steps.push(`Find common denominator: LCM(${f1.denominator}, ${f2.denominator}) = ${commonDen}`);
        steps.push(`Convert: ${f1.numerator}/${f1.denominator} = ${num1}/${commonDen}`);
        steps.push(`Convert: ${f2.numerator}/${f2.denominator} = ${num2}/${commonDen}`);
        steps.push(`Add numerators: ${num1} + ${num2} = ${num1 + num2}`);
        result = { numerator: num1 + num2, denominator: commonDen };
        break;
      }
      case '-': {
        const commonDen = lcm(f1.denominator, f2.denominator);
        const num1 = f1.numerator * (commonDen / f1.denominator);
        const num2 = f2.numerator * (commonDen / f2.denominator);
        steps.push(`Find common denominator: LCM(${f1.denominator}, ${f2.denominator}) = ${commonDen}`);
        steps.push(`Convert: ${f1.numerator}/${f1.denominator} = ${num1}/${commonDen}`);
        steps.push(`Convert: ${f2.numerator}/${f2.denominator} = ${num2}/${commonDen}`);
        steps.push(`Subtract numerators: ${num1} - ${num2} = ${num1 - num2}`);
        result = { numerator: num1 - num2, denominator: commonDen };
        break;
      }
      case '*': {
        steps.push(`Multiply numerators: ${f1.numerator} × ${f2.numerator} = ${f1.numerator * f2.numerator}`);
        steps.push(`Multiply denominators: ${f1.denominator} × ${f2.denominator} = ${f1.denominator * f2.denominator}`);
        result = {
          numerator: f1.numerator * f2.numerator,
          denominator: f1.denominator * f2.denominator
        };
        break;
      }
      case '/': {
        if (f2.numerator === 0) {
          steps.push(`Error: Cannot divide by zero`);
          return { result: { numerator: 0, denominator: 0 }, steps };
        }
        steps.push(`Flip the second fraction: ${f2.numerator}/${f2.denominator} → ${f2.denominator}/${f2.numerator}`);
        steps.push(`Multiply: ${f1.numerator}/${f1.denominator} × ${f2.denominator}/${f2.numerator}`);
        steps.push(`Numerators: ${f1.numerator} × ${f2.denominator} = ${f1.numerator * f2.denominator}`);
        steps.push(`Denominators: ${f1.denominator} × ${f2.numerator} = ${f1.denominator * f2.numerator}`);
        result = {
          numerator: f1.numerator * f2.denominator,
          denominator: f1.denominator * f2.numerator
        };
        break;
      }
    }

    const simplified = simplifyFraction(result);
    if (simplified.numerator !== result.numerator || simplified.denominator !== result.denominator) {
      steps.push(`Simplify: ${result.numerator}/${result.denominator} = ${simplified.numerator}/${simplified.denominator}`);
    }

    return { result: simplified, steps };
  };

  // Handle calculation
  const handleCalculate = () => {
    const activeFractions = fractions.slice(0, fractionCount);
    const activeOperations = operations.slice(0, fractionCount - 1);

    // Validate
    for (let i = 0; i < fractionCount; i++) {
      if (activeFractions[i].denominator === 0) {
        alert(t('errorZeroDenominator'));
        return;
      }
    }

    let allSteps: string[] = [];
    let currentResult = activeFractions[0];
    allSteps.push(`Starting with: ${currentResult.numerator}/${currentResult.denominator}`);

    for (let i = 0; i < activeOperations.length; i++) {
      const { result: newResult, steps } = calculateTwo(currentResult, activeFractions[i + 1], activeOperations[i]);
      allSteps.push(`\nOperation ${i + 1}: ${currentResult.numerator}/${currentResult.denominator} ${activeOperations[i]} ${activeFractions[i + 1].numerator}/${activeFractions[i + 1].denominator}`);
      allSteps = [...allSteps, ...steps];
      currentResult = newResult;
    }

    setResult(currentResult);
    setCalculationSteps(allSteps);
    setShowSteps(true);
  };

  // Handle clear
  const handleClear = () => {
    setFractions([
      { numerator: 0, denominator: 1 },
      { numerator: 0, denominator: 1 },
      { numerator: 0, denominator: 1 },
      { numerator: 0, denominator: 1 },
    ]);
    setOperations(['+', '+', '+']);
    setResult(null);
    setCalculationSteps([]);
    setShowSteps(false);
  };

  // Update fraction
  const updateFraction = (index: number, field: 'numerator' | 'denominator', value: number) => {
    const newFractions = [...fractions];
    newFractions[index] = { ...newFractions[index], [field]: value };
    setFractions(newFractions);
  };

  // Update operation
  const updateOperation = (index: number, value: '+' | '-' | '*' | '/') => {
    const newOperations = [...operations];
    newOperations[index] = value;
    setOperations(newOperations);
  };

  // Toggle section
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Format fraction display
  const formatFraction = (f: Fraction) => {
    if (f.denominator === 0) return 'Undefined';
    if (f.denominator === 1) return `${f.numerator}`;
    return `${f.numerator}/${f.denominator}`;
  };

  // Operation button component
  const OperationButton = ({ op, selected, onClick }: { op: '+' | '-' | '*' | '/'; selected: boolean; onClick: () => void }) => {
    const icons = { '+': Plus, '-': Minus, '*': X, '/': Divide };
    const Icon = icons[op];
    return (
      <button
        onClick={onClick}
        className={`p-2 rounded-lg border-2 transition-all ${
          selected
            ? 'border-primary bg-primary text-white'
            : 'border-gray-200 hover:border-primary/50 text-gray-600'
        }`}
      >
        <Icon className="w-5 h-5" />
      </button>
    );
  };

  // Fraction input component
  const FractionInput = ({ index, fraction }: { index: number; fraction: Fraction }) => (
    <div className="flex flex-col items-center">
      <input
        type="number"
        value={fraction.numerator}
        onChange={(e) => updateFraction(index, 'numerator', parseInt(e.target.value) || 0)}
        className="w-16 md:w-20 p-2 text-center text-lg font-semibold border-b-2 border-gray-300 focus:border-primary outline-none bg-transparent"
        aria-label={`Numerator ${index + 1}`}
      />
      <div className="w-16 md:w-20 h-0.5 bg-gray-800 my-1"></div>
      <input
        type="number"
        value={fraction.denominator}
        onChange={(e) => updateFraction(index, 'denominator', parseInt(e.target.value) || 1)}
        className="w-16 md:w-20 p-2 text-center text-lg font-semibold border-t-0 focus:border-primary outline-none bg-transparent"
        aria-label={`Denominator ${index + 1}`}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{t('title')}</h1>
                <p className="text-white/80 text-sm mt-1">{t('subtitle') || 'Add, subtract, multiply and divide fractions'}</p>
              </div>
            </div>
          </div>

          {/* Fraction Count Selector */}
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-center gap-4">
              <span className="text-sm font-medium text-gray-600">{t('numberOfFractions') || 'Number of fractions'}:</span>
              <div className="flex gap-2">
                {([2, 3, 4] as const).map((num) => (
                  <button
                    key={num}
                    onClick={() => setFractionCount(num)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      fractionCount === num
                        ? 'bg-primary text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-primary/50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Calculator Body */}
          <div className="p-6">
            {/* Fraction Inputs */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
              {Array.from({ length: fractionCount }).map((_, index) => (
                <React.Fragment key={index}>
                  <FractionInput index={index} fraction={fractions[index]} />
                  {index < fractionCount - 1 && (
                    <div className="flex flex-col gap-1">
                      {(['+', '-', '*', '/'] as const).map((op) => (
                        <OperationButton
                          key={op}
                          op={op}
                          selected={operations[index] === op}
                          onClick={() => updateOperation(index, op)}
                        />
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 mt-8">
              <button
                onClick={handleCalculate}
                className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg shadow-primary/25 transition-all hover:shadow-xl"
              >
                {t('calculateButton')}
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl flex items-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                {t('clearButton')}
              </button>
            </div>

            {/* Result */}
            {result && (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="text-center">
                  <span className="text-sm font-medium text-green-600 uppercase tracking-wide">{t('resultLabel') || 'Result'}</span>
                  <div className="mt-2 text-4xl font-bold text-gray-900">
                    {formatFraction(result)}
                  </div>
                  {result.denominator !== 0 && Math.abs(result.numerator) >= result.denominator && (
                    <div className="mt-2 text-lg text-gray-600">
                      {t('mixedNumber') || 'Mixed number'}: {(() => {
                        const mixed = toMixedNumber(result);
                        if (mixed.numerator === 0) return `${mixed.whole}`;
                        return `${mixed.whole} ${mixed.numerator}/${mixed.denominator}`;
                      })()}
                    </div>
                  )}
                  <div className="mt-2 text-lg text-gray-500">
                    {t('decimal') || 'Decimal'}: {toDecimal(result).toFixed(6).replace(/\.?0+$/, '')}
                  </div>
                </div>

                {/* Step by step */}
                {showSteps && calculationSteps.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <button
                      onClick={() => setShowSteps(!showSteps)}
                      className="flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
                    >
                      {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {t('showSteps') || 'Step-by-step solution'}
                    </button>
                    {showSteps && (
                      <div className="mt-3 space-y-1 text-sm text-gray-600 font-mono bg-white/50 p-4 rounded-lg">
                        {calculationSteps.map((step, i) => (
                          <div key={i} className={step.startsWith('\n') ? 'mt-3 font-semibold text-gray-800' : ''}>
                            {step.replace('\n', '')}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SEO Content Sections */}
        <div className="mt-8 space-y-4">
          {/* What is a Fraction */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t('whatIsFraction.title') || 'What is a Fraction?'}</h2>
              <p className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: t.raw('whatIsFraction.content') || 'A fraction represents a part of a whole. It consists of two numbers: the numerator (top number) and the denominator (bottom number). For example, in 3/4, 3 is the numerator and 4 is the denominator, meaning 3 parts out of 4 equal parts.' }}></p>
            </div>
          </div>

          {/* How to Add Fractions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleSection('howToAdd')}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-bold text-gray-900">{t('howToAdd.title')}</h2>
              {expandedSections.howToAdd ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {expandedSections.howToAdd && (
              <div className="px-6 pb-6 space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">{t('howToAdd.sameDenominator')}</h3>
                  <p className="text-blue-800 text-sm" dangerouslySetInnerHTML={{ __html: t.raw('howToAdd.sameDenominatorText') }}></p>
                  <div className="mt-2 p-3 bg-white rounded font-mono text-sm">{t.raw('howToAdd.example1')}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">{t('howToAdd.differentDenominator')}</h3>
                  <p className="text-purple-800 text-sm" dangerouslySetInnerHTML={{ __html: t.raw('howToAdd.differentDenominatorText') }}></p>
                  <div className="mt-2 p-3 bg-white rounded font-mono text-sm">{t.raw('howToAdd.example2')}</div>
                </div>
              </div>
            )}
          </div>

          {/* How to Subtract Fractions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleSection('howToSubtract')}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-bold text-gray-900">{t('howToSubtract.title') || 'How to Subtract Fractions'}</h2>
              {expandedSections.howToSubtract ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {expandedSections.howToSubtract && (
              <div className="px-6 pb-6">
                <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: t.raw('howToSubtract.content') || 'Subtracting fractions works the same as addition. Find a common denominator, convert the fractions, then subtract the numerators.<br/><br/><strong>Example:</strong> 3/4 - 1/2 = 3/4 - 2/4 = 1/4' }}></p>
              </div>
            )}
          </div>

          {/* How to Multiply Fractions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleSection('howToMultiply')}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-bold text-gray-900">{t('howToMultiply.title') || 'How to Multiply Fractions'}</h2>
              {expandedSections.howToMultiply ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {expandedSections.howToMultiply && (
              <div className="px-6 pb-6">
                <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: t.raw('howToMultiply.content') || 'Multiplying fractions is simple: multiply the numerators together and multiply the denominators together.<br/><br/><strong>Formula:</strong> (a/b) × (c/d) = (a×c)/(b×d)<br/><br/><strong>Example:</strong> 2/3 × 3/4 = 6/12 = 1/2' }}></p>
              </div>
            )}
          </div>

          {/* How to Divide Fractions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleSection('howToDivide')}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-bold text-gray-900">{t('howToDivide.title') || 'How to Divide Fractions'}</h2>
              {expandedSections.howToDivide ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {expandedSections.howToDivide && (
              <div className="px-6 pb-6">
                <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: t.raw('howToDivide.content') || 'To divide fractions, multiply by the reciprocal (flip the second fraction).<br/><br/><strong>Formula:</strong> (a/b) ÷ (c/d) = (a/b) × (d/c) = (a×d)/(b×c)<br/><br/><strong>Example:</strong> 1/2 ÷ 1/4 = 1/2 × 4/1 = 4/2 = 2' }}></p>
              </div>
            )}
          </div>

          {/* FAQ Section */}
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
                  <h3 className="font-semibold text-gray-900">{t('faq.q1') || 'What is a proper fraction?'}</h3>
                  <p className="text-gray-600 text-sm mt-1">{t('faq.a1') || 'A proper fraction has a numerator smaller than its denominator (e.g., 3/4). The value is always less than 1.'}</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-gray-900">{t('faq.q2') || 'What is an improper fraction?'}</h3>
                  <p className="text-gray-600 text-sm mt-1">{t('faq.a2') || 'An improper fraction has a numerator greater than or equal to its denominator (e.g., 5/4). The value is 1 or greater.'}</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-gray-900">{t('faq.q3') || 'How do I convert a fraction to a decimal?'}</h3>
                  <p className="text-gray-600 text-sm mt-1">{t('faq.a3') || 'Divide the numerator by the denominator. For example, 3/4 = 3 ÷ 4 = 0.75'}</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-gray-900">{t('faq.q4') || 'What is a mixed number?'}</h3>
                  <p className="text-gray-600 text-sm mt-1">{t('faq.a4') || 'A mixed number combines a whole number and a fraction (e.g., 2 1/4). It represents 2 + 1/4 = 9/4.'}</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-gray-900">{t('faq.q5') || 'How do I simplify a fraction?'}</h3>
                  <p className="text-gray-600 text-sm mt-1">{t('faq.a5') || 'Divide both the numerator and denominator by their greatest common divisor (GCD). For example, 8/12: GCD is 4, so 8÷4/12÷4 = 2/3.'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
