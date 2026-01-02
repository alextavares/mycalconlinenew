'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'impulse' | 'force' | 'time';

export default function ImpulseClientPage() {
  const t = useTranslations('ImpulseCalculator');

  const [mode, setMode] = useState<CalculationMode>('impulse');
  const [force, setForce] = useState('');
  const [time, setTime] = useState('');
  const [impulse, setImpulse] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const result = useMemo(() => {
    const F = parseFloat(force);
    const t = parseFloat(time);
    const J = parseFloat(impulse);

    if (mode === 'impulse') {
      if (!isNaN(F) && !isNaN(t) && F >= 0 && t >= 0) {
        return F * t;
      }
    } else if (mode === 'force') {
      if (!isNaN(J) && !isNaN(t) && t > 0) {
        return J / t;
      }
    } else if (mode === 'time') {
      if (!isNaN(J) && !isNaN(F) && F > 0) {
        return J / F;
      }
    }
    return null;
  }, [mode, force, time, impulse]);

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
                onClick={() => setMode('impulse')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'impulse'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('impulse')}
              </button>
              <button
                onClick={() => setMode('force')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'force'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('force')}
              </button>
              <button
                onClick={() => setMode('time')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'time'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('time')}
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center font-mono">
              {mode === 'impulse' && 'J = F × Δt'}
              {mode === 'force' && 'F = J / Δt'}
              {mode === 'time' && 'Δt = J / F'}
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t('formulaDescription')}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {mode !== 'impulse' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('impulse')} (J) - N·s
                </label>
                <input
                  type="number"
                  value={impulse}
                  onChange={(e) => setImpulse(e.target.value)}
                  placeholder="50"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />
              </div>
            )}

            {mode !== 'time' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('time')} (Δt) - seconds
                </label>
                <input
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="0.5"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            )}
          </div>

          {result !== null && (
            <div className={`mt-6 p-6 rounded-lg border-2 ${
              mode === 'impulse' ? 'bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200' :
              mode === 'force' ? 'bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200' :
              'bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200'
            }`}>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{t('result')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {result.toFixed(3)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {mode === 'impulse' && 'N·s (Newton-seconds)'}
                  {mode === 'force' && 'N (Newtons)'}
                  {mode === 'time' && 's (seconds)'}
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
