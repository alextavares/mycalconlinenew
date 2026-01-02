'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'velocity' | 'height' | 'time';

export default function FreeFallClientPage() {
  const t = useTranslations('FreeFallCalculator');
  const u = useTranslations('Units');

  const [mode, setMode] = useState<CalculationMode>('velocity');
  const [height, setHeight] = useState('');
  const [time, setTime] = useState('');
  const [initialVelocity, setInitialVelocity] = useState('0');
  const [gravity, setGravity] = useState('9.8');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const results = useMemo(() => {
    const h = parseFloat(height);
    const t = parseFloat(time);
    const v0 = parseFloat(initialVelocity);
    const g = parseFloat(gravity);

    if (mode === 'velocity') {
      if (!isNaN(t) && !isNaN(v0) && !isNaN(g) && t >= 0 && g > 0) {
        const velocity = v0 + g * t;
        const distance = v0 * t + 0.5 * g * t * t;
        return { velocity, distance };
      }
    } else if (mode === 'height') {
      if (!isNaN(t) && !isNaN(v0) && !isNaN(g) && t >= 0 && g > 0) {
        const height = v0 * t + 0.5 * g * t * t;
        const velocity = v0 + g * t;
        return { height, velocity };
      }
    } else if (mode === 'time') {
      if (!isNaN(h) && !isNaN(v0) && !isNaN(g) && h >= 0 && g > 0) {
        const discriminant = v0 * v0 + 2 * g * h;
        if (discriminant >= 0) {
          const time = (-v0 + Math.sqrt(discriminant)) / g;
          const velocity = v0 + g * time;
          return { time, velocity };
        }
      }
    }
    return null;
  }, [mode, height, time, initialVelocity, gravity]);

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
                onClick={() => setMode('velocity')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'velocity'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('velocity')}
              </button>
              <button
                onClick={() => setMode('height')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'height'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('height')}
              </button>
              <button
                onClick={() => setMode('time')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'time'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('time')}
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center font-mono">
              {mode === 'velocity' && 'v = v₀ + gt'}
              {mode === 'height' && 'h = v₀t + ½gt²'}
              {mode === 'time' && 't = (-v₀ + √(v₀² + 2gh))/g'}
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t('formulaDescription')}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {mode !== 'height' && mode !== 'velocity' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('height')} (h) - {u('meters')}
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="10"
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            )}

            {mode !== 'time' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('time')} (t) - {u('seconds')}
                </label>
                <input
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="1.43"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('initialVelocity')} (v₀) - {u('metersPerSecond')}
              </label>
              <input
                type="number"
                value={initialVelocity}
                onChange={(e) => setInitialVelocity(e.target.value)}
                placeholder="0"
                step="0.1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('gravity')} (g) - {u('metersPerSecondSquared')}
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

          {results !== null && (
            <div className="space-y-4">
              {mode === 'velocity' && (
                <>
                  <div className="p-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
                    <p className="text-sm text-gray-600 mb-1 text-center">{t('finalVelocity')}</p>
                    <p className="text-3xl font-bold text-gray-900 text-center">
                      {results.velocity.toFixed(2)} {u('metersPerSecond')}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-xs text-gray-600 mb-1">{t('distanceFallen')}</p>
                    <p className="text-lg font-bold text-gray-900">{results.distance.toFixed(2)} {u('meters')}</p>
                  </div>
                </>
              )}

              {mode === 'height' && (
                <>
                  <div className="p-6 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
                    <p className="text-sm text-gray-600 mb-1 text-center">{t('heightFallen')}</p>
                    <p className="text-3xl font-bold text-gray-900 text-center">
                      {results.height.toFixed(2)} {u('meters')}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">{t('finalVelocity')}</p>
                    <p className="text-lg font-bold text-gray-900">{results.velocity.toFixed(2)} {u('metersPerSecond')}</p>
                  </div>
                </>
              )}

              {mode === 'time' && (
                <>
                  <div className="p-6 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
                    <p className="text-sm text-gray-600 mb-1 text-center">{t('timeFallen')}</p>
                    <p className="text-3xl font-bold text-gray-900 text-center">
                      {results.time.toFixed(3)} {u('secondsAbbrev')}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">{t('finalVelocity')}</p>
                    <p className="text-lg font-bold text-gray-900">{results.velocity.toFixed(2)} {u('metersPerSecond')}</p>
                  </div>
                </>
              )}
            </div>
          )}

          {results === null && (
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
              onClick={() => toggleSection('formulas')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-semibold text-gray-900">{t('formulasTitle')}</h2>
              {openSection === 'formulas' ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {openSection === 'formulas' && (
              <div className="px-6 pb-4">
                <p className="text-gray-700 leading-relaxed">{t('formulasContent')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
