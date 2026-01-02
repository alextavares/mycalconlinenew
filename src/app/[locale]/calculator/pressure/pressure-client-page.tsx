'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'pressure' | 'force' | 'area';

export default function PressureClientPage() {
  const t = useTranslations('PressureCalculator');

  const [mode, setMode] = useState<CalculationMode>('pressure');
  const [force, setForce] = useState('');
  const [area, setArea] = useState('');
  const [pressure, setPressure] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const result = useMemo(() => {
    const F = parseFloat(force);
    const A = parseFloat(area);
    const P = parseFloat(pressure);

    if (mode === 'pressure') {
      if (!isNaN(F) && !isNaN(A) && A > 0) {
        return F / A;
      }
    } else if (mode === 'force') {
      if (!isNaN(P) && !isNaN(A) && P >= 0 && A > 0) {
        return P * A;
      }
    } else if (mode === 'area') {
      if (!isNaN(F) && !isNaN(P) && P > 0) {
        return F / P;
      }
    }
    return null;
  }, [mode, force, area, pressure]);

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
                onClick={() => setMode('pressure')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'pressure'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('pressure')}
              </button>
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
                onClick={() => setMode('area')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'area'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('area')}
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center font-mono">
              {mode === 'pressure' && 'P = F/A'}
              {mode === 'force' && 'F = P × A'}
              {mode === 'area' && 'A = F/P'}
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t('formulaDescription')}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {mode !== 'pressure' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pressure')} (P) - Pa
                </label>
                <input
                  type="number"
                  value={pressure}
                  onChange={(e) => setPressure(e.target.value)}
                  placeholder="100000"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            )}

            {mode !== 'force' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('force')} (F) - N
                </label>
                <input
                  type="number"
                  value={force}
                  onChange={(e) => setForce(e.target.value)}
                  placeholder="1000"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            )}

            {mode !== 'area' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('area')} (A) - m²
                </label>
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="0.01"
                  step="0.0001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {result !== null && (
            <div className={`mt-6 p-6 rounded-lg border-2 ${
              mode === 'pressure' ? 'bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200' :
              mode === 'force' ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' :
              'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
            }`}>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{t('result')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {result.toFixed(4)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {mode === 'pressure' && 'Pa (Pascals)'}
                  {mode === 'force' && 'N (Newtons)'}
                  {mode === 'area' && 'm²'}
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
        </div>
      </div>
    </div>
  );
}
