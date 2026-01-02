'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'energy' | 'mass' | 'velocity';

export default function KineticEnergyClientPage() {
  const t = useTranslations('KineticEnergyCalculator');

  const [mode, setMode] = useState<CalculationMode>('energy');
  const [mass, setMass] = useState('');
  const [velocity, setVelocity] = useState('');
  const [energy, setEnergy] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const result = useMemo(() => {
    const m = parseFloat(mass);
    const v = parseFloat(velocity);
    const KE = parseFloat(energy);

    if (mode === 'energy') {
      if (!isNaN(m) && !isNaN(v) && m > 0 && v >= 0) {
        return 0.5 * m * v * v;
      }
    } else if (mode === 'mass') {
      if (!isNaN(KE) && !isNaN(v) && KE >= 0 && v > 0) {
        return (2 * KE) / (v * v);
      }
    } else if (mode === 'velocity') {
      if (!isNaN(KE) && !isNaN(m) && KE >= 0 && m > 0) {
        return Math.sqrt((2 * KE) / m);
      }
    }
    return null;
  }, [mode, mass, velocity, energy]);

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
                onClick={() => setMode('energy')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'energy'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('energy')}
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
              {mode === 'energy' && 'KE = ½mv²'}
              {mode === 'mass' && 'm = 2KE/v²'}
              {mode === 'velocity' && 'v = √(2KE/m)'}
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t('formulaDescription')}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {mode !== 'energy' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('energy')} (KE) - Joules
                </label>
                <input
                  type="number"
                  value={energy}
                  onChange={(e) => setEnergy(e.target.value)}
                  placeholder="1000"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                  placeholder="10"
                  step="0.01"
                  min="0"
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
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            )}
          </div>

          {result !== null && (
            <div className={`mt-6 p-6 rounded-lg border-2 ${
              mode === 'energy' ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200' :
              mode === 'mass' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' :
              'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
            }`}>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{t('result')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {result.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {mode === 'energy' && 'J (Joules)'}
                  {mode === 'mass' && 'kg (kilograms)'}
                  {mode === 'velocity' && 'm/s (meters/second)'}
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
