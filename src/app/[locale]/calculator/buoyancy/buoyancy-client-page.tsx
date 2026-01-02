'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'force' | 'volume' | 'density';

export default function BuoyancyClientPage() {
  const t = useTranslations('BuoyancyCalculator');

  const [mode, setMode] = useState<CalculationMode>('force');
  const [volume, setVolume] = useState('');
  const [density, setDensity] = useState('1000');
  const [gravity, setGravity] = useState('9.8');
  const [force, setForce] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const result = useMemo(() => {
    const V = parseFloat(volume);
    const rho = parseFloat(density);
    const g = parseFloat(gravity);
    const F = parseFloat(force);

    if (mode === 'force') {
      if (!isNaN(V) && !isNaN(rho) && !isNaN(g) && V > 0 && rho > 0 && g > 0) {
        return rho * V * g;
      }
    } else if (mode === 'volume') {
      if (!isNaN(F) && !isNaN(rho) && !isNaN(g) && F >= 0 && rho > 0 && g > 0) {
        return F / (rho * g);
      }
    } else if (mode === 'density') {
      if (!isNaN(F) && !isNaN(V) && !isNaN(g) && F >= 0 && V > 0 && g > 0) {
        return F / (V * g);
      }
    }
    return null;
  }, [mode, volume, density, gravity, force]);

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
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('force')}
              </button>
              <button
                onClick={() => setMode('volume')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'volume'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('volume')}
              </button>
              <button
                onClick={() => setMode('density')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'density'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('density')}
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center font-mono">
              {mode === 'force' && 'Fb = ρVg'}
              {mode === 'volume' && 'V = Fb/(ρg)'}
              {mode === 'density' && 'ρ = Fb/(Vg)'}
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t('formulaDescription')}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {mode !== 'force' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('force')} (Fb) - Newtons
                </label>
                <input
                  type="number"
                  value={force}
                  onChange={(e) => setForce(e.target.value)}
                  placeholder="100"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            )}

            {mode !== 'volume' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('volume')} (V) - m³
                </label>
                <input
                  type="number"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  placeholder="0.01"
                  step="0.0001"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {mode !== 'density' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('density')} (ρ) - kg/m³
                </label>
                <input
                  type="number"
                  value={density}
                  onChange={(e) => setDensity(e.target.value)}
                  placeholder="1000"
                  step="1"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Water: 1000 kg/m³ | Seawater: 1025 kg/m³ | Air: 1.2 kg/m³
                </p>
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
            </div>
          </div>

          {result !== null && (
            <div className={`mt-6 p-6 rounded-lg border-2 ${
              mode === 'force' ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200' :
              mode === 'volume' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' :
              'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200'
            }`}>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{t('result')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {result.toFixed(4)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {mode === 'force' && 'N (Newtons)'}
                  {mode === 'volume' && 'm³ (cubic meters)'}
                  {mode === 'density' && 'kg/m³ (kilograms/cubic meter)'}
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
