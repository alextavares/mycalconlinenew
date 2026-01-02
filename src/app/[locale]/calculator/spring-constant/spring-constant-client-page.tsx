'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'force' | 'springConstant' | 'displacement';

export default function SpringConstantClientPage() {
  const t = useTranslations('SpringConstantCalculator');

  const [mode, setMode] = useState<CalculationMode>('force');
  const [springConstant, setSpringConstant] = useState('');
  const [displacement, setDisplacement] = useState('');
  const [force, setForce] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const result = useMemo(() => {
    const k = parseFloat(springConstant);
    const x = parseFloat(displacement);
    const F = parseFloat(force);

    if (mode === 'force') {
      if (!isNaN(k) && !isNaN(x) && k > 0 && x >= 0) {
        return k * x;
      }
    } else if (mode === 'springConstant') {
      if (!isNaN(F) && !isNaN(x) && F >= 0 && x > 0) {
        return F / x;
      }
    } else if (mode === 'displacement') {
      if (!isNaN(F) && !isNaN(k) && F >= 0 && k > 0) {
        return F / k;
      }
    }
    return null;
  }, [mode, springConstant, displacement, force]);

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
                onClick={() => setMode('force')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'force'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('force')}
              </button>
              <button
                onClick={() => setMode('springConstant')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'springConstant'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('springConstant')}
              </button>
              <button
                onClick={() => setMode('displacement')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'displacement'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('displacement')}
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center font-mono">
              {mode === 'force' && 'F = kx'}
              {mode === 'springConstant' && 'k = F/x'}
              {mode === 'displacement' && 'x = F/k'}
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t('formulaDescription')}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {mode !== 'force' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('force')} (F) - Newtons
                </label>
                <input
                  type="number"
                  value={force}
                  onChange={(e) => setForce(e.target.value)}
                  placeholder="10"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            )}

            {mode !== 'springConstant' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('springConstant')} (k) - N/m
                </label>
                <input
                  type="number"
                  value={springConstant}
                  onChange={(e) => setSpringConstant(e.target.value)}
                  placeholder="100"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {mode !== 'displacement' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('displacement')} (x) - meters
                </label>
                <input
                  type="number"
                  value={displacement}
                  onChange={(e) => setDisplacement(e.target.value)}
                  placeholder="0.1"
                  step="0.001"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            )}
          </div>

          {result !== null && (
            <div className={`mt-6 p-6 rounded-lg border-2 ${
              mode === 'force' ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' :
              mode === 'springConstant' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' :
              'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
            }`}>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{t('result')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {result.toFixed(3)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {mode === 'force' && 'N (Newtons)'}
                  {mode === 'springConstant' && 'N/m (Newtons/meter)'}
                  {mode === 'displacement' && 'm (meters)'}
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
