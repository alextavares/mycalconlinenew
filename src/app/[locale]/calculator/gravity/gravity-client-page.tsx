'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'force' | 'mass1' | 'mass2' | 'distance';

export default function GravityClientPage() {
  const t = useTranslations('GravityCalculator');

  const [mode, setMode] = useState<CalculationMode>('force');
  const [mass1, setMass1] = useState('');
  const [mass2, setMass2] = useState('');
  const [distance, setDistance] = useState('');
  const [force, setForce] = useState('');
  const G = 6.674e-11; // gravitational constant
  const [openSection, setOpenSection] = useState<string | null>(null);

  const result = useMemo(() => {
    const m1 = parseFloat(mass1);
    const m2 = parseFloat(mass2);
    const r = parseFloat(distance);
    const F = parseFloat(force);

    if (mode === 'force') {
      if (!isNaN(m1) && !isNaN(m2) && !isNaN(r) && m1 > 0 && m2 > 0 && r > 0) {
        return (G * m1 * m2) / (r * r);
      }
    } else if (mode === 'mass1') {
      if (!isNaN(F) && !isNaN(m2) && !isNaN(r) && F > 0 && m2 > 0 && r > 0) {
        return (F * r * r) / (G * m2);
      }
    } else if (mode === 'mass2') {
      if (!isNaN(F) && !isNaN(m1) && !isNaN(r) && F > 0 && m1 > 0 && r > 0) {
        return (F * r * r) / (G * m1);
      }
    } else if (mode === 'distance') {
      if (!isNaN(F) && !isNaN(m1) && !isNaN(m2) && F > 0 && m1 > 0 && m2 > 0) {
        return Math.sqrt((G * m1 * m2) / F);
      }
    }
    return null;
  }, [mode, mass1, mass2, distance, force, G]);

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
                onClick={() => setMode('force')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'force'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('force')}
              </button>
              <button
                onClick={() => setMode('mass1')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'mass1'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('mass1')}
              </button>
              <button
                onClick={() => setMode('mass2')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'mass2'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('mass2')}
              </button>
              <button
                onClick={() => setMode('distance')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'distance'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('distance')}
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center font-mono">
              {mode === 'force' && 'F = G(m₁m₂)/r²'}
              {mode === 'mass1' && 'm₁ = Fr²/(Gm₂)'}
              {mode === 'mass2' && 'm₂ = Fr²/(Gm₁)'}
              {mode === 'distance' && 'r = √(Gm₁m₂/F)'}
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              G = 6.674 × 10⁻¹¹ N⋅m²/kg²
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {mode !== 'force' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('force')} (F) - N
                </label>
                <input
                  type="number"
                  value={force}
                  onChange={(e) => setForce(e.target.value)}
                  placeholder="1e20"
                  step="any"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            )}

            {mode !== 'mass1' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('mass1')} (m₁) - kg
                </label>
                <input
                  type="number"
                  value={mass1}
                  onChange={(e) => setMass1(e.target.value)}
                  placeholder="5.972e24"
                  step="any"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {mode !== 'mass2' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('mass2')} (m₂) - kg
                </label>
                <input
                  type="number"
                  value={mass2}
                  onChange={(e) => setMass2(e.target.value)}
                  placeholder="7.35e22"
                  step="any"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            )}

            {mode !== 'distance' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('distance')} (r) - m
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="3.84e8"
                  step="any"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            )}
          </div>

          {result !== null && (
            <div className={`mt-6 p-6 rounded-lg border-2 ${
              mode === 'force' ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200' :
              mode === 'mass1' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' :
              mode === 'mass2' ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200' :
              'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
            }`}>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{t('result')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {result.toExponential(4)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {mode === 'force' && 'N'}
                  {(mode === 'mass1' || mode === 'mass2') && 'kg'}
                  {mode === 'distance' && 'm'}
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
