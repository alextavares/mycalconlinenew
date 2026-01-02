'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'period' | 'length' | 'frequency';

export default function PendulumClientPage() {
  const t = useTranslations('PendulumCalculator');

  const [mode, setMode] = useState<CalculationMode>('period');
  const [length, setLength] = useState('');
  const [gravity, setGravity] = useState('9.8');
  const [period, setPeriod] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const result = useMemo(() => {
    const L = parseFloat(length);
    const g = parseFloat(gravity);
    const T = parseFloat(period);

    if (mode === 'period') {
      if (!isNaN(L) && !isNaN(g) && L > 0 && g > 0) {
        return 2 * Math.PI * Math.sqrt(L / g);
      }
    } else if (mode === 'length') {
      if (!isNaN(T) && !isNaN(g) && T > 0 && g > 0) {
        return (g * T * T) / (4 * Math.PI * Math.PI);
      }
    } else if (mode === 'frequency') {
      if (!isNaN(L) && !isNaN(g) && L > 0 && g > 0) {
        const T = 2 * Math.PI * Math.sqrt(L / g);
        return 1 / T;
      }
    }
    return null;
  }, [mode, length, gravity, period]);

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
                onClick={() => setMode('period')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'period'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('period')}
              </button>
              <button
                onClick={() => setMode('length')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'length'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('length')}
              </button>
              <button
                onClick={() => setMode('frequency')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'frequency'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('frequency')}
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center font-mono">
              {mode === 'period' && 'T = 2π√(L/g)'}
              {mode === 'length' && 'L = gT²/(4π²)'}
              {mode === 'frequency' && 'f = 1/T = √(g/L)/(2π)'}
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t('formulaDescription')}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {mode !== 'period' && mode !== 'frequency' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('period')} (T) - seconds
                </label>
                <input
                  type="number"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder="2"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}

            {mode !== 'length' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('length')} (L) - meters
                </label>
                <input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="1"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('gravity')} (g) - m/s²
              </label>
              <input
                type="number"
                value={gravity}
                onChange={(e) => setGravity(e.target.value)}
                placeholder="9.8"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Earth: 9.8 m/s² | Moon: 1.62 m/s² | Mars: 3.71 m/s²
              </p>
            </div>
          </div>

          {result !== null && (
            <div className={`mt-6 p-6 rounded-lg border-2 ${
              mode === 'period' ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200' :
              mode === 'length' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' :
              'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
            }`}>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{t('result')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {result.toFixed(4)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {mode === 'period' && 's (seconds)'}
                  {mode === 'length' && 'm (meters)'}
                  {mode === 'frequency' && 'Hz (Hertz)'}
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
