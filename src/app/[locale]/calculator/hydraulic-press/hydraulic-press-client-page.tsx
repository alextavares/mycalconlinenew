'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'outputForce' | 'inputForce' | 'outputArea' | 'inputArea';

export default function HydraulicPressClientPage() {
  const t = useTranslations('HydraulicPressCalculator');

  const [mode, setMode] = useState<CalculationMode>('outputForce');
  const [inputForce, setInputForce] = useState('');
  const [outputForce, setOutputForce] = useState('');
  const [inputArea, setInputArea] = useState('');
  const [outputArea, setOutputArea] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const result = useMemo(() => {
    const F1 = parseFloat(inputForce);
    const F2 = parseFloat(outputForce);
    const A1 = parseFloat(inputArea);
    const A2 = parseFloat(outputArea);

    if (mode === 'outputForce') {
      if (!isNaN(F1) && !isNaN(A1) && !isNaN(A2) && F1 > 0 && A1 > 0 && A2 > 0) {
        return (F1 * A2) / A1;
      }
    } else if (mode === 'inputForce') {
      if (!isNaN(F2) && !isNaN(A1) && !isNaN(A2) && F2 > 0 && A1 > 0 && A2 > 0) {
        return (F2 * A1) / A2;
      }
    } else if (mode === 'outputArea') {
      if (!isNaN(F1) && !isNaN(F2) && !isNaN(A1) && F1 > 0 && F2 > 0 && A1 > 0) {
        return (F2 * A1) / F1;
      }
    } else if (mode === 'inputArea') {
      if (!isNaN(F1) && !isNaN(F2) && !isNaN(A2) && F1 > 0 && F2 > 0 && A2 > 0) {
        return (F1 * A2) / F2;
      }
    }
    return null;
  }, [mode, inputForce, outputForce, inputArea, outputArea]);

  const mechanicalAdvantage = useMemo(() => {
    const A1 = parseFloat(inputArea);
    const A2 = parseFloat(outputArea);
    if (!isNaN(A1) && !isNaN(A2) && A1 > 0 && A2 > 0) {
      return A2 / A1;
    }
    return null;
  }, [inputArea, outputArea]);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('selectCalculation')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => setMode('outputForce')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'outputForce'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('outputForce')}
              </button>
              <button
                onClick={() => setMode('inputForce')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'inputForce'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('inputForce')}
              </button>
              <button
                onClick={() => setMode('outputArea')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'outputArea'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('outputArea')}
              </button>
              <button
                onClick={() => setMode('inputArea')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'inputArea'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('inputArea')}
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center font-mono">
              F₁/A₁ = F₂/A₂ (Pascal's Principle)
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t('formulaDescription')}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {mode !== 'inputForce' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inputForce')} (F₁) - Newtons
                </label>
                <input
                  type="number"
                  value={inputForce}
                  onChange={(e) => setInputForce(e.target.value)}
                  placeholder="100"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {mode !== 'inputArea' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inputArea')} (A₁) - m²
                </label>
                <input
                  type="number"
                  value={inputArea}
                  onChange={(e) => setInputArea(e.target.value)}
                  placeholder="0.001"
                  step="0.0001"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            )}

            {mode !== 'outputForce' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('outputForce')} (F₂) - Newtons
                </label>
                <input
                  type="number"
                  value={outputForce}
                  onChange={(e) => setOutputForce(e.target.value)}
                  placeholder="1000"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            )}

            {mode !== 'outputArea' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('outputArea')} (A₂) - m²
                </label>
                <input
                  type="number"
                  value={outputArea}
                  onChange={(e) => setOutputArea(e.target.value)}
                  placeholder="0.01"
                  step="0.0001"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            )}
          </div>

          {result !== null && (
            <div>
              <div className={`p-6 rounded-lg border-2 ${
                mode === 'outputForce' ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' :
                mode === 'inputForce' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' :
                mode === 'outputArea' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' :
                'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
              }`}>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">{t('result')}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {result.toFixed(4)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {(mode === 'outputForce' || mode === 'inputForce') && 'N (Newtons)'}
                    {(mode === 'outputArea' || mode === 'inputArea') && 'm² (square meters)'}
                  </p>
                </div>
              </div>

              {mechanicalAdvantage !== null && (
                <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs text-gray-600 mb-1 text-center">{t('mechanicalAdvantage')}</p>
                  <p className="text-lg font-bold text-gray-900 text-center">
                    {mechanicalAdvantage.toFixed(2)}× force multiplication
                  </p>
                </div>
              )}
            </div>
          )}

          {result === null && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800 text-center">
                {t('invalidInput')}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleSection('what')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-semibold text-gray-900">{t('whatIsTitle')}</h2>
              {openSection === 'what' ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {openSection === 'what' && (
              <div className="px-6 pb-4">
                <p className="text-gray-700 leading-relaxed">{t('whatIsContent')}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleSection('formula')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-semibold text-gray-900">{t('formulaTitle')}</h2>
              {openSection === 'formula' ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {openSection === 'formula' && (
              <div className="px-6 pb-4">
                <p className="text-gray-700 leading-relaxed">{t('formulaContent')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
