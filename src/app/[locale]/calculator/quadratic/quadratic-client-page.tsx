'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Calculator, ChevronDown, ChevronUp, Equal } from 'lucide-react';

type RootType = 'two_real' | 'one_real' | 'complex' | 'invalid';

interface QuadraticResult {
  type: RootType;
  discriminant: number;
  x1?: number;
  x2?: number;
  x1Real?: number;
  x1Imag?: number;
  x2Real?: number;
  x2Imag?: number;
  vertex: { x: number; y: number };
  axisOfSymmetry: number;
  yIntercept: number;
}

export default function QuadraticClientPage() {
  const t = useTranslations('QuadraticCalculator');

  const [a, setA] = useState<string>('1');
  const [b, setB] = useState<string>('-5');
  const [c, setC] = useState<string>('6');

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    formula: false,
    discriminant: false,
    faq: false
  });

  const result = useMemo((): QuadraticResult | null => {
    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
    const cNum = parseFloat(c);

    if (isNaN(aNum) || isNaN(bNum) || isNaN(cNum)) {
      return null;
    }

    if (aNum === 0) {
      return null; // Not a quadratic equation
    }

    const discriminant = bNum * bNum - 4 * aNum * cNum;
    const vertex = {
      x: -bNum / (2 * aNum),
      y: cNum - (bNum * bNum) / (4 * aNum)
    };
    const axisOfSymmetry = -bNum / (2 * aNum);
    const yIntercept = cNum;

    if (discriminant > 0) {
      // Two distinct real roots
      const sqrtDiscriminant = Math.sqrt(discriminant);
      const x1 = (-bNum + sqrtDiscriminant) / (2 * aNum);
      const x2 = (-bNum - sqrtDiscriminant) / (2 * aNum);
      return {
        type: 'two_real',
        discriminant,
        x1,
        x2,
        vertex,
        axisOfSymmetry,
        yIntercept
      };
    } else if (discriminant === 0) {
      // One repeated real root
      const x1 = -bNum / (2 * aNum);
      return {
        type: 'one_real',
        discriminant,
        x1,
        vertex,
        axisOfSymmetry,
        yIntercept
      };
    } else {
      // Two complex conjugate roots
      const realPart = -bNum / (2 * aNum);
      const imagPart = Math.sqrt(-discriminant) / (2 * aNum);
      return {
        type: 'complex',
        discriminant,
        x1Real: realPart,
        x1Imag: imagPart,
        x2Real: realPart,
        x2Imag: -imagPart,
        vertex,
        axisOfSymmetry,
        yIntercept
      };
    }
  }, [a, b, c]);

  const formatNumber = (num: number): string => {
    if (Number.isInteger(num)) return num.toString();
    return num.toFixed(4).replace(/\.?0+$/, '');
  };

  const formatComplex = (real: number, imag: number): string => {
    const realStr = formatNumber(real);
    const imagAbs = Math.abs(imag);
    const imagStr = formatNumber(imagAbs);
    if (imag >= 0) {
      return `${realStr} + ${imagStr}i`;
    } else {
      return `${realStr} - ${imagStr}i`;
    }
  };

  const getEquationString = (): string => {
    const aNum = parseFloat(a) || 0;
    const bNum = parseFloat(b) || 0;
    const cNum = parseFloat(c) || 0;

    let eq = '';

    // a term
    if (aNum === 1) eq = 'x²';
    else if (aNum === -1) eq = '-x²';
    else eq = `${aNum}x²`;

    // b term
    if (bNum > 0) eq += ` + ${bNum === 1 ? '' : bNum}x`;
    else if (bNum < 0) eq += ` - ${bNum === -1 ? '' : Math.abs(bNum)}x`;

    // c term
    if (cNum > 0) eq += ` + ${cNum}`;
    else if (cNum < 0) eq += ` - ${Math.abs(cNum)}`;

    return eq + ' = 0';
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const quickExamples = [
    { a: '1', b: '-5', c: '6', label: 'x² - 5x + 6' },
    { a: '1', b: '0', c: '-4', label: 'x² - 4' },
    { a: '1', b: '-2', c: '1', label: 'x² - 2x + 1' },
    { a: '1', b: '2', c: '5', label: 'x² + 2x + 5' },
  ];

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
          {/* Equation Display */}
          <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-200 text-center">
            <div className="text-sm text-indigo-600 mb-1">{t('equation')}</div>
            <div className="text-2xl font-mono font-bold text-indigo-800">
              {getEquationString()}
            </div>
          </div>

          {/* Standard Form Display */}
          <div className="mb-6 text-center">
            <div className="text-sm text-gray-500 mb-2">{t('standardForm')}</div>
            <div className="text-lg font-mono text-gray-700">
              ax² + bx + c = 0
            </div>
          </div>

          {/* Coefficient Inputs */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                a
              </label>
              <input
                type="number"
                value={a}
                onChange={(e) => setA(e.target.value)}
                className="w-full px-4 py-3 text-lg text-center border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors"
                placeholder="1"
                step="any"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                b
              </label>
              <input
                type="number"
                value={b}
                onChange={(e) => setB(e.target.value)}
                className="w-full px-4 py-3 text-lg text-center border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors"
                placeholder="-5"
                step="any"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                c
              </label>
              <input
                type="number"
                value={c}
                onChange={(e) => setC(e.target.value)}
                className="w-full px-4 py-3 text-lg text-center border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors"
                placeholder="6"
                step="any"
              />
            </div>
          </div>

          {/* Quick Examples */}
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-2">{t('quickExamples')}</div>
            <div className="flex flex-wrap gap-2">
              {quickExamples.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setA(ex.a);
                    setB(ex.b);
                    setC(ex.c);
                  }}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-mono"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {result ? (
            <div className="mt-6 space-y-4">
              {/* Roots */}
              <div className={`p-5 rounded-xl border-2 ${
                result.type === 'two_real' ? 'bg-green-50 border-green-200' :
                result.type === 'one_real' ? 'bg-blue-50 border-blue-200' :
                'bg-purple-50 border-purple-200'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className={`w-5 h-5 ${
                    result.type === 'two_real' ? 'text-green-600' :
                    result.type === 'one_real' ? 'text-blue-600' :
                    'text-purple-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    result.type === 'two_real' ? 'text-green-700' :
                    result.type === 'one_real' ? 'text-blue-700' :
                    'text-purple-700'
                  }`}>
                    {result.type === 'two_real' && t('twoRealRoots')}
                    {result.type === 'one_real' && t('oneRealRoot')}
                    {result.type === 'complex' && t('complexRoots')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {result.type === 'two_real' && (
                    <>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">x₁</div>
                        <div className="text-2xl font-bold text-green-700 font-mono">
                          {formatNumber(result.x1!)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">x₂</div>
                        <div className="text-2xl font-bold text-green-700 font-mono">
                          {formatNumber(result.x2!)}
                        </div>
                      </div>
                    </>
                  )}
                  {result.type === 'one_real' && (
                    <div className="col-span-2 text-center">
                      <div className="text-xs text-gray-500 mb-1">x</div>
                      <div className="text-2xl font-bold text-blue-700 font-mono">
                        {formatNumber(result.x1!)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{t('repeatedRoot')}</div>
                    </div>
                  )}
                  {result.type === 'complex' && (
                    <>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">x₁</div>
                        <div className="text-xl font-bold text-purple-700 font-mono">
                          {formatComplex(result.x1Real!, result.x1Imag!)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">x₂</div>
                        <div className="text-xl font-bold text-purple-700 font-mono">
                          {formatComplex(result.x2Real!, result.x2Imag!)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Discriminant */}
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="text-sm text-orange-600 mb-1">{t('discriminant')} (Δ = b² - 4ac)</div>
                <div className="text-xl font-bold text-orange-700 font-mono">
                  Δ = {formatNumber(result.discriminant)}
                </div>
                <div className="text-xs text-orange-600 mt-1">
                  {result.discriminant > 0 && t('discriminantPositive')}
                  {result.discriminant === 0 && t('discriminantZero')}
                  {result.discriminant < 0 && t('discriminantNegative')}
                </div>
              </div>

              {/* Additional Properties */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                  <div className="text-xs text-gray-500 mb-1">{t('vertex')}</div>
                  <div className="text-sm font-bold text-gray-700 font-mono">
                    ({formatNumber(result.vertex.x)}, {formatNumber(result.vertex.y)})
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                  <div className="text-xs text-gray-500 mb-1">{t('axisOfSymmetry')}</div>
                  <div className="text-sm font-bold text-gray-700 font-mono">
                    x = {formatNumber(result.axisOfSymmetry)}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                  <div className="text-xs text-gray-500 mb-1">{t('yIntercept')}</div>
                  <div className="text-sm font-bold text-gray-700 font-mono">
                    (0, {formatNumber(result.yIntercept)})
                  </div>
                </div>
              </div>

              {/* Quadratic Formula */}
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 text-center">
                <div className="text-sm text-indigo-600 mb-2">{t('quadraticFormula')}</div>
                <div className="text-lg font-mono text-indigo-800">
                  x = (-b ± √(b² - 4ac)) / 2a
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-center">
              <p className="text-sm text-yellow-800">
                {parseFloat(a) === 0 ? t('notQuadratic') : t('invalidInput')}
              </p>
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

          {/* Formula */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('formula')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('formulaTitle')}</h2>
              {expandedSections.formula ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.formula && (
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">
                  {t('formulaContent')}
                </p>
              </div>
            )}
          </div>

          {/* Discriminant */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('discriminant')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('discriminantTitle')}</h2>
              {expandedSections.discriminant ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.discriminant && (
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">
                  {t('discriminantContent')}
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
