'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'energy' | 'mass' | 'height';

export default function PotentialEnergyClientPage() {
  const t = useTranslations('PotentialEnergyCalculator');

  const [mode, setMode] = useState<CalculationMode>('energy');
  const [mass, setMass] = useState('');
  const [height, setHeight] = useState('');
  const [gravity, setGravity] = useState('9.8');
  const [energy, setEnergy] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const result = useMemo(() => {
    const m = parseFloat(mass);
    const h = parseFloat(height);
    const g = parseFloat(gravity);
    const PE = parseFloat(energy);

    if (mode === 'energy') {
      if (!isNaN(m) && !isNaN(h) && !isNaN(g) && m > 0 && h >= 0 && g > 0) {
        return m * g * h;
      }
    } else if (mode === 'mass') {
      if (!isNaN(PE) && !isNaN(h) && !isNaN(g) && PE >= 0 && h > 0 && g > 0) {
        return PE / (g * h);
      }
    } else if (mode === 'height') {
      if (!isNaN(PE) && !isNaN(m) && !isNaN(g) && PE >= 0 && m > 0 && g > 0) {
        return PE / (m * g);
      }
    }
    return null;
  }, [mode, mass, height, gravity, energy]);

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
                    ? 'bg-green-600 text-white shadow-md'
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
                onClick={() => setMode('height')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'height'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('height')}
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center font-mono">
              {mode === 'energy' && 'PE = mgh'}
              {mode === 'mass' && 'm = PE/(gh)'}
              {mode === 'height' && 'h = PE/(mg)'}
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t('formulaDescription')}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {mode !== 'energy' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('energy')} (PE) - Joules
                </label>
                <input
                  type="number"
                  value={energy}
                  onChange={(e) => setEnergy(e.target.value)}
                  placeholder="490"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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

            {mode !== 'height' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('height')} (h) - meters
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="5"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
              mode === 'energy' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' :
              mode === 'mass' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' :
              'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200'
            }`}>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{t('result')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {result.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {mode === 'energy' && 'J (Joules)'}
                  {mode === 'mass' && 'kg (kilograms)'}
                  {mode === 'height' && 'm (meters)'}
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
