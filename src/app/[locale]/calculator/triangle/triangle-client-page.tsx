'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Triangle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

type CalculationMode = 'sss' | 'sas' | 'asa';

export default function TriangleClientPage() {
  const t = useTranslations('TriangleCalculator');

  const [mode, setMode] = useState<CalculationMode>('sss');
  const [sideA, setSideA] = useState<string>('3');
  const [sideB, setSideB] = useState<string>('4');
  const [sideC, setSideC] = useState<string>('5');
  const [angleA, setAngleA] = useState<string>('');
  const [angleB, setAngleB] = useState<string>('');
  const [angleC, setAngleC] = useState<string>('90');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howTo: false,
    formulas: false,
    faq: false
  });

  const modes = [
    { id: 'sss', label: t('modeSSS'), description: t('modeSSSDesc') },
    { id: 'sas', label: t('modeSAS'), description: t('modeSASDesc') },
    { id: 'asa', label: t('modeASA'), description: t('modeASADesc') },
  ];

  const result = useMemo(() => {
    const a = parseFloat(sideA) || 0;
    const b = parseFloat(sideB) || 0;
    const c = parseFloat(sideC) || 0;
    const angA = parseFloat(angleA) || 0;
    const angB = parseFloat(angleB) || 0;
    const angC = parseFloat(angleC) || 0;

    let finalA = a, finalB = b, finalC = c;
    let finalAngA = angA, finalAngB = angB, finalAngC = angC;
    let error: string | null = null;

    switch (mode) {
      case 'sss':
        // Three sides given
        if (a <= 0 || b <= 0 || c <= 0) {
          error = t('errorInvalidSides');
          break;
        }
        // Triangle inequality theorem
        if (a + b <= c || a + c <= b || b + c <= a) {
          error = t('errorTriangleInequality');
          break;
        }
        // Calculate angles using law of cosines
        // cos(A) = (b² + c² - a²) / (2bc)
        const cosA = (b * b + c * c - a * a) / (2 * b * c);
        const cosB = (a * a + c * c - b * b) / (2 * a * c);
        const cosC = (a * a + b * b - c * c) / (2 * a * b);

        finalAngA = Math.acos(cosA) * (180 / Math.PI);
        finalAngB = Math.acos(cosB) * (180 / Math.PI);
        finalAngC = Math.acos(cosC) * (180 / Math.PI);
        break;

      case 'sas':
        // Two sides and included angle
        if (a <= 0 || b <= 0 || angC <= 0 || angC >= 180) {
          error = t('errorInvalidInput');
          break;
        }
        // Law of cosines: c² = a² + b² - 2ab·cos(C)
        const angCRad = angC * (Math.PI / 180);
        finalC = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(angCRad));

        // Now calculate remaining angles
        const cosA_sas = (b * b + finalC * finalC - a * a) / (2 * b * finalC);
        const cosB_sas = (a * a + finalC * finalC - b * b) / (2 * a * finalC);

        finalAngA = Math.acos(cosA_sas) * (180 / Math.PI);
        finalAngB = Math.acos(cosB_sas) * (180 / Math.PI);
        finalAngC = angC;
        break;

      case 'asa':
        // Two angles and included side
        if (angA <= 0 || angB <= 0 || angA + angB >= 180 || c <= 0) {
          error = t('errorInvalidInput');
          break;
        }
        finalAngA = angA;
        finalAngB = angB;
        finalAngC = 180 - angA - angB;

        // Law of sines: a/sin(A) = b/sin(B) = c/sin(C)
        const sinA = Math.sin(angA * Math.PI / 180);
        const sinB = Math.sin(angB * Math.PI / 180);
        const sinC = Math.sin(finalAngC * Math.PI / 180);

        finalA = (c * sinA) / sinC;
        finalB = (c * sinB) / sinC;
        finalC = c;
        break;
    }

    if (error) return { error };

    const s = (finalA + finalB + finalC) / 2; // Semi-perimeter
    const area = Math.sqrt(s * (s - finalA) * (s - finalB) * (s - finalC)); // Heron's formula
    const perimeter = finalA + finalB + finalC;

    // Determine triangle type
    const sides = [finalA, finalB, finalC].sort((x, y) => x - y);
    let triangleType: string;

    if (Math.abs(sides[0] * sides[0] + sides[1] * sides[1] - sides[2] * sides[2]) < 0.01) {
      triangleType = t('rightTriangle');
    } else if (sides[0] * sides[0] + sides[1] * sides[1] > sides[2] * sides[2]) {
      triangleType = t('acuteTriangle');
    } else {
      triangleType = t('obtuseTriangle');
    }

    return {
      sideA: finalA,
      sideB: finalB,
      sideC: finalC,
      angleA: finalAngA,
      angleB: finalAngB,
      angleC: finalAngC,
      area,
      perimeter,
      triangleType
    };
  }, [mode, sideA, sideB, sideC, angleA, angleB, angleC, t]);

  const formatNumber = (value: number): string => {
    return value.toFixed(4).replace(/\.?0+$/, '');
  };

  const handleReset = () => {
    setSideA('');
    setSideB('');
    setSideC('');
    setAngleA('');
    setAngleB('');
    setAngleC('');
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

          {/* Input Fields - SSS Mode */}
          {mode === 'sss' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('sideA')} (a)
                </label>
                <input
                  type="number"
                  value={sideA}
                  onChange={(e) => setSideA(e.target.value)}
                  placeholder="0"
                  step="any"
                  min="0"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('sideB')} (b)
                </label>
                <input
                  type="number"
                  value={sideB}
                  onChange={(e) => setSideB(e.target.value)}
                  placeholder="0"
                  step="any"
                  min="0"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('sideC')} (c)
                </label>
                <input
                  type="number"
                  value={sideC}
                  onChange={(e) => setSideC(e.target.value)}
                  placeholder="0"
                  step="any"
                  min="0"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Input Fields - SAS Mode */}
          {mode === 'sas' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('sideA')} (a)
                </label>
                <input
                  type="number"
                  value={sideA}
                  onChange={(e) => setSideA(e.target.value)}
                  placeholder="0"
                  step="any"
                  min="0"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('angleC')} (C) - {t('degrees')}
                </label>
                <input
                  type="number"
                  value={angleC}
                  onChange={(e) => setAngleC(e.target.value)}
                  placeholder="0"
                  step="any"
                  min="0"
                  max="180"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('sideB')} (b)
                </label>
                <input
                  type="number"
                  value={sideB}
                  onChange={(e) => setSideB(e.target.value)}
                  placeholder="0"
                  step="any"
                  min="0"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Input Fields - ASA Mode */}
          {mode === 'asa' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('angleA')} (A) - {t('degrees')}
                </label>
                <input
                  type="number"
                  value={angleA}
                  onChange={(e) => setAngleA(e.target.value)}
                  placeholder="0"
                  step="any"
                  min="0"
                  max="180"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('sideC')} (c)
                </label>
                <input
                  type="number"
                  value={sideC}
                  onChange={(e) => setSideC(e.target.value)}
                  placeholder="0"
                  step="any"
                  min="0"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('angleB')} (B) - {t('degrees')}
                </label>
                <input
                  type="number"
                  value={angleB}
                  onChange={(e) => setAngleB(e.target.value)}
                  placeholder="0"
                  step="any"
                  min="0"
                  max="180"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {t('reset')}
          </button>

          {/* Results or Error */}
          {result && 'error' in result ? (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{result.error}</p>
            </div>
          ) : result && (
            <div className="space-y-4">
              {/* Triangle Type Badge */}
              <div className="text-center">
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {result.triangleType}
                </span>
              </div>

              {/* Sides and Angles Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <span className="text-xs text-gray-500 block mb-1">{t('sideA')} (a)</span>
                  <p className="text-xl font-bold text-gray-900">{formatNumber(result.sideA)}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <span className="text-xs text-gray-500 block mb-1">{t('sideB')} (b)</span>
                  <p className="text-xl font-bold text-gray-900">{formatNumber(result.sideB)}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <span className="text-xs text-gray-500 block mb-1">{t('sideC')} (c)</span>
                  <p className="text-xl font-bold text-gray-900">{formatNumber(result.sideC)}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                  <span className="text-xs text-gray-500 block mb-1">{t('angleA')} (∠A)</span>
                  <p className="text-xl font-bold text-gray-900">{formatNumber(result.angleA)}°</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                  <span className="text-xs text-gray-500 block mb-1">{t('angleB')} (∠B)</span>
                  <p className="text-xl font-bold text-gray-900">{formatNumber(result.angleB)}°</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                  <span className="text-xs text-gray-500 block mb-1">{t('angleC')} (∠C)</span>
                  <p className="text-xl font-bold text-gray-900">{formatNumber(result.angleC)}°</p>
                </div>
              </div>

              {/* Area and Perimeter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-green-50 rounded-xl border-2 border-green-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">{t('area')}</h3>
                  <p className="text-3xl font-bold text-green-700">{formatNumber(result.area)}</p>
                  <p className="text-xs text-gray-500 mt-1">{t('squareUnits')}</p>
                </div>
                <div className="p-5 bg-amber-50 rounded-xl border-2 border-amber-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">{t('perimeter')}</h3>
                  <p className="text-3xl font-bold text-amber-700">{formatNumber(result.perimeter)}</p>
                  <p className="text-xs text-gray-500 mt-1">{t('linearUnits')}</p>
                </div>
              </div>

              {/* Formula Info */}
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{t('sumOfAngles')}:</span> {formatNumber(result.angleA + result.angleB + result.angleC)}° = 180°
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
