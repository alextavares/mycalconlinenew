'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'force' | 'mass' | 'velocity' | 'radius';

export default function CentripetalForceClientPage() {
  const t = useTranslations('CentripetalForceCalculator');

  const [mode, setMode] = useState<CalculationMode>('force');
  const [mass, setMass] = useState('');
  const [velocity, setVelocity] = useState('');
  const [radius, setRadius] = useState('');
  const [force, setForce] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const result = useMemo(() => {
    const m = parseFloat(mass);
    const v = parseFloat(velocity);
    const r = parseFloat(radius);
    const F = parseFloat(force);

    if (mode === 'force') {
      if (!isNaN(m) && !isNaN(v) && !isNaN(r) && m > 0 && v >= 0 && r > 0) {
        return (m * v * v) / r;
      }
    } else if (mode === 'mass') {
      if (!isNaN(F) && !isNaN(v) && !isNaN(r) && F >= 0 && v > 0 && r > 0) {
        return (F * r) / (v * v);
      }
    } else if (mode === 'velocity') {
      if (!isNaN(F) && !isNaN(m) && !isNaN(r) && F >= 0 && m > 0 && r > 0) {
        return Math.sqrt((F * r) / m);
      }
    } else if (mode === 'radius') {
      if (!isNaN(F) && !isNaN(m) && !isNaN(v) && F > 0 && m > 0 && v > 0) {
        return (m * v * v) / F;
      }
    }
    return null;
  }, [mode, mass, velocity, radius, force]);

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
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('velocity')}
              </button>
              <button
                onClick={() => setMode('radius')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'radius'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('radius')}
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center font-mono">
              {mode === 'force' && 'Fc = mv²/r'}
              {mode === 'mass' && 'm = Fcr/v²'}
              {mode === 'velocity' && 'v = √(Fcr/m)'}
              {mode === 'radius' && 'r = mv²/Fc'}
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t('formulaDescription')}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {mode !== 'force' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('force')} (Fc) - Newtons
                </label>
                <input
                  type="number"
                  value={force}
                  onChange={(e) => setForce(e.target.value)}
                  placeholder="100"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                  placeholder="5"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            )}

            {mode !== 'radius' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('radius')} (r) - meters
                </label>
                <input
                  type="number"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  placeholder="2"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            )}
          </div>

          {result !== null && (
            <div className={`mt-6 p-6 rounded-lg border-2 ${
              mode === 'force' ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200' :
              mode === 'mass' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' :
              mode === 'velocity' ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200' :
              'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
            }`}>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{t('result')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {result.toFixed(3)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {mode === 'force' && 'N (Newtons)'}
                  {mode === 'mass' && 'kg (kilograms)'}
                  {mode === 'velocity' && 'm/s (meters/second)'}
                  {mode === 'radius' && 'm (meters)'}
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
