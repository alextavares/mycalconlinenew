'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'friction' | 'coefficient' | 'normal';

export default function FrictionClientPage() {
  const t = useTranslations('FrictionCalculator');

  const [mode, setMode] = useState<CalculationMode>('friction');
  const [normalForce, setNormalForce] = useState('');
  const [coefficient, setCoefficient] = useState('');
  const [frictionForce, setFrictionForce] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const result = useMemo(() => {
    const N = parseFloat(normalForce);
    const mu = parseFloat(coefficient);
    const f = parseFloat(frictionForce);

    if (mode === 'friction') {
      if (!isNaN(mu) && !isNaN(N) && mu >= 0 && N >= 0) {
        return mu * N;
      }
    } else if (mode === 'coefficient') {
      if (!isNaN(f) && !isNaN(N) && N > 0) {
        return f / N;
      }
    } else if (mode === 'normal') {
      if (!isNaN(f) && !isNaN(mu) && mu > 0) {
        return f / mu;
      }
    }
    return null;
  }, [mode, normalForce, coefficient, frictionForce]);

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
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setMode('friction')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'friction'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('friction')}
              </button>
              <button
                onClick={() => setMode('coefficient')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'coefficient'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('coefficient')}
              </button>
              <button
                onClick={() => setMode('normal')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'normal'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('normal')}
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center font-mono">
              {mode === 'friction' && 'f = μN'}
              {mode === 'coefficient' && 'μ = f/N'}
              {mode === 'normal' && 'N = f/μ'}
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t('formulaDescription')}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {mode !== 'friction' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('friction')} (f) - Newtons
                </label>
                <input
                  type="number"
                  value={frictionForce}
                  onChange={(e) => setFrictionForce(e.target.value)}
                  placeholder="50"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            )}

            {mode !== 'coefficient' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('coefficient')} (μ) - dimensionless
                </label>
                <input
                  type="number"
                  value={coefficient}
                  onChange={(e) => setCoefficient(e.target.value)}
                  placeholder="0.5"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            )}

            {mode !== 'normal' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('normal')} (N) - Newtons
                </label>
                <input
                  type="number"
                  value={normalForce}
                  onChange={(e) => setNormalForce(e.target.value)}
                  placeholder="100"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {result !== null && (
            <div className={`mt-6 p-6 rounded-lg border-2 ${
              mode === 'friction' ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' :
              mode === 'coefficient' ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200' :
              'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'
            }`}>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{t('result')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {result.toFixed(4)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {mode === 'friction' && 'N (Newtons)'}
                  {mode === 'coefficient' && '(dimensionless)'}
                  {mode === 'normal' && 'N (Newtons)'}
                </p>
              </div>
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
