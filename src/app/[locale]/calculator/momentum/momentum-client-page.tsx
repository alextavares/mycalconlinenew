'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'momentum' | 'mass' | 'velocity';

export default function MomentumClientPage() {
  const t = useTranslations('MomentumCalculator');

  const [mode, setMode] = useState<CalculationMode>('momentum');
  const [mass, setMass] = useState('');
  const [velocity, setVelocity] = useState('');
  const [momentum, setMomentum] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const result = useMemo(() => {
    const m = parseFloat(mass);
    const v = parseFloat(velocity);
    const p = parseFloat(momentum);

    if (mode === 'momentum') {
      if (!isNaN(m) && !isNaN(v) && m > 0) {
        return m * v;
      }
    } else if (mode === 'mass') {
      if (!isNaN(p) && !isNaN(v) && v !== 0) {
        return p / v;
      }
    } else if (mode === 'velocity') {
      if (!isNaN(p) && !isNaN(m) && m > 0) {
        return p / m;
      }
    }
    return null;
  }, [mode, mass, velocity, momentum]);

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
                onClick={() => setMode('momentum')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'momentum'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('momentum')}
              </button>
              <button
                onClick={() => setMode('mass')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'mass'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('mass')}
              </button>
              <button
                onClick={() => setMode('velocity')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'velocity'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('velocity')}
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center font-mono">
              {mode === 'momentum' && 'p = mv'}
              {mode === 'mass' && 'm = p/v'}
              {mode === 'velocity' && 'v = p/m'}
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t('formulaDescription')}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {mode !== 'momentum' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('momentum')} (p) - kg⋅m/s
                </label>
                <input
                  type="number"
                  value={momentum}
                  onChange={(e) => setMomentum(e.target.value)}
                  placeholder="1000"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}

            {mode !== 'mass' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('mass')} (m) - kg
                </label>
                <input
                  type="number"
                  value={mass}
                  onChange={(e) => setMass(e.target.value)}
                  placeholder="50"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {mode !== 'velocity' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('velocity')} (v) - m/s
                </label>
                <input
                  type="number"
                  value={velocity}
                  onChange={(e) => setVelocity(e.target.value)}
                  placeholder="20"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            )}
          </div>

          {result !== null && (
            <div className={`mt-6 p-6 rounded-lg border-2 ${
              mode === 'momentum' ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200' :
              mode === 'mass' ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200' :
              'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
            }`}>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{t('result')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {result.toFixed(4)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {mode === 'momentum' && 'kg⋅m/s'}
                  {mode === 'mass' && 'kg'}
                  {mode === 'velocity' && 'm/s'}
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
