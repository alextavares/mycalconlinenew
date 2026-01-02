'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'work' | 'force' | 'distance';

export default function WorkClientPage() {
  const t = useTranslations('WorkCalculator');

  const [mode, setMode] = useState<CalculationMode>('work');
  const [force, setForce] = useState('');
  const [distance, setDistance] = useState('');
  const [angle, setAngle] = useState('0');
  const [work, setWork] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const result = useMemo(() => {
    const F = parseFloat(force);
    const d = parseFloat(distance);
    const theta = parseFloat(angle);
    const W = parseFloat(work);

    if (mode === 'work') {
      if (!isNaN(F) && !isNaN(d) && !isNaN(theta) && F >= 0 && d >= 0) {
        return F * d * Math.cos((theta * Math.PI) / 180);
      }
    } else if (mode === 'force') {
      if (!isNaN(W) && !isNaN(d) && !isNaN(theta) && d > 0) {
        const cosTheta = Math.cos((theta * Math.PI) / 180);
        if (Math.abs(cosTheta) > 0.001) {
          return W / (d * cosTheta);
        }
      }
    } else if (mode === 'distance') {
      if (!isNaN(W) && !isNaN(F) && !isNaN(theta) && F > 0) {
        const cosTheta = Math.cos((theta * Math.PI) / 180);
        if (Math.abs(cosTheta) > 0.001) {
          return W / (F * cosTheta);
        }
      }
    }
    return null;
  }, [mode, force, distance, angle, work]);

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
                onClick={() => setMode('work')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'work'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('work')}
              </button>
              <button
                onClick={() => setMode('force')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'force'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('force')}
              </button>
              <button
                onClick={() => setMode('distance')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'distance'
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('distance')}
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center font-mono">
              {mode === 'work' && 'W = F × d × cos(θ)'}
              {mode === 'force' && 'F = W / (d × cos(θ))'}
              {mode === 'distance' && 'd = W / (F × cos(θ))'}
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t('formulaDescription')}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {mode !== 'work' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('work')} (W) - Joules
                </label>
                <input
                  type="number"
                  value={work}
                  onChange={(e) => setWork(e.target.value)}
                  placeholder="500"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            )}

            {mode !== 'force' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('force')} (F) - Newtons
                </label>
                <input
                  type="number"
                  value={force}
                  onChange={(e) => setForce(e.target.value)}
                  placeholder="100"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}

            {mode !== 'distance' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('distance')} (d) - meters
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="10"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('angle')} (θ) - degrees
              </label>
              <input
                type="number"
                value={angle}
                onChange={(e) => setAngle(e.target.value)}
                placeholder="0"
                step="1"
                min="0"
                max="180"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {result !== null && (
            <div className={`mt-6 p-6 rounded-lg border-2 ${
              mode === 'work' ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200' :
              mode === 'force' ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200' :
              'bg-gradient-to-r from-sky-50 to-cyan-50 border-sky-200'
            }`}>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{t('result')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {result.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {mode === 'work' && 'J (Joules)'}
                  {mode === 'force' && 'N (Newtons)'}
                  {mode === 'distance' && 'm (meters)'}
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
