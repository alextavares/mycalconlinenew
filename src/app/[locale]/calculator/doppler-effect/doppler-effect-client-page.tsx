'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type Direction = 'approaching' | 'receding';

export default function DopplerEffectClientPage() {
  const t = useTranslations('DopplerEffectCalculator');

  const [sourceFrequency, setSourceFrequency] = useState('');
  const [sourceVelocity, setSourceVelocity] = useState('');
  const [observerVelocity, setObserverVelocity] = useState('0');
  const [waveVelocity, setWaveVelocity] = useState('343');
  const [direction, setDirection] = useState<Direction>('approaching');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const result = useMemo(() => {
    const f0 = parseFloat(sourceFrequency);
    const vs = parseFloat(sourceVelocity);
    const vo = parseFloat(observerVelocity);
    const v = parseFloat(waveVelocity);

    if (!isNaN(f0) && !isNaN(vs) && !isNaN(vo) && !isNaN(v) && f0 > 0 && v > 0) {
      let observedFrequency;

      if (direction === 'approaching') {
        observedFrequency = f0 * ((v + vo) / (v - vs));
      } else {
        observedFrequency = f0 * ((v - vo) / (v + vs));
      }

      const frequencyShift = observedFrequency - f0;
      const percentChange = ((observedFrequency - f0) / f0) * 100;

      return {
        observedFrequency,
        frequencyShift,
        percentChange,
      };
    }
    return null;
  }, [sourceFrequency, sourceVelocity, observerVelocity, waveVelocity, direction]);

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
              {t('direction')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDirection('approaching')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  direction === 'approaching'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('approaching')}
              </button>
              <button
                onClick={() => setDirection('receding')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  direction === 'receding'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('receding')}
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center font-mono">
              {direction === 'approaching' ? 'f\' = f₀(v + v₀)/(v - vₛ)' : 'f\' = f₀(v - v₀)/(v + vₛ)'}
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t('formulaDescription')}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('sourceFrequency')} (f₀) - Hz
              </label>
              <input
                type="number"
                value={sourceFrequency}
                onChange={(e) => setSourceFrequency(e.target.value)}
                placeholder="500"
                step="1"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('sourceVelocity')} (vₛ) - m/s
              </label>
              <input
                type="number"
                value={sourceVelocity}
                onChange={(e) => setSourceVelocity(e.target.value)}
                placeholder="20"
                step="0.1"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('observerVelocity')} (v₀) - m/s
              </label>
              <input
                type="number"
                value={observerVelocity}
                onChange={(e) => setObserverVelocity(e.target.value)}
                placeholder="0"
                step="0.1"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('waveVelocity')} (v) - m/s
              </label>
              <input
                type="number"
                value={waveVelocity}
                onChange={(e) => setWaveVelocity(e.target.value)}
                placeholder="343"
                step="1"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Sound in air (20°C): 343 m/s | Sound in water: 1480 m/s
              </p>
            </div>
          </div>

          {result !== null && (
            <div className="space-y-4">
              <div className={`p-6 rounded-lg border-2 ${
                direction === 'approaching'
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                  : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
              }`}>
                <p className="text-sm text-gray-600 mb-1 text-center">{t('observedFrequency')}</p>
                <p className="text-3xl font-bold text-gray-900 text-center">
                  {result.observedFrequency.toFixed(2)} Hz
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <p className="text-xs text-gray-600 mb-1">{t('frequencyShift')}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {result.frequencyShift > 0 ? '+' : ''}{result.frequencyShift.toFixed(2)} Hz
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs text-gray-600 mb-1">{t('percentChange')}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {result.percentChange > 0 ? '+' : ''}{result.percentChange.toFixed(2)}%
                  </p>
                </div>
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
