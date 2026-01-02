'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ProjectileClientPage() {
  const t = useTranslations('ProjectileCalculator');
  const u = useTranslations('Units');

  const [velocity, setVelocity] = useState('');
  const [angle, setAngle] = useState('');
  const [gravity, setGravity] = useState('9.8');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const results = useMemo(() => {
    const v0 = parseFloat(velocity);
    const theta = parseFloat(angle);
    const g = parseFloat(gravity);

    if (!isNaN(v0) && !isNaN(theta) && !isNaN(g) && v0 > 0 && theta >= 0 && theta <= 90 && g > 0) {
      const thetaRad = (theta * Math.PI) / 180;
      const vx = v0 * Math.cos(thetaRad);
      const vy = v0 * Math.sin(thetaRad);

      const timeOfFlight = (2 * vy) / g;
      const maxHeight = (vy * vy) / (2 * g);
      const range = (v0 * v0 * Math.sin(2 * thetaRad)) / g;

      return {
        timeOfFlight,
        maxHeight,
        range,
        vx,
        vy,
      };
    }
    return null;
  }, [velocity, angle, gravity]);

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
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700 text-center font-medium">
              {t('calculatesAll')}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('velocity')} (v₀) - {u('metersPerSecond')}
              </label>
              <input
                type="number"
                value={velocity}
                onChange={(e) => setVelocity(e.target.value)}
                placeholder="20"
                step="0.1"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('angle')} (θ) - {u('degrees')}
              </label>
              <input
                type="number"
                value={angle}
                onChange={(e) => setAngle(e.target.value)}
                placeholder="45"
                step="1"
                min="0"
                max="90"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
              <p className="text-xs text-gray-500 mt-1">
                {u('gravityReference')}
              </p>
            </div>
          </div>

          {results !== null && (
            <div className="space-y-4">
              <div className="p-5 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200">
                <p className="text-sm text-gray-600 mb-1">{t('range')}</p>
                <p className="text-2xl font-bold text-gray-900">{results.range.toFixed(2)} {u('meters')}</p>
              </div>

              <div className="p-5 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200">
                <p className="text-sm text-gray-600 mb-1">{t('maxHeight')}</p>
                <p className="text-2xl font-bold text-gray-900">{results.maxHeight.toFixed(2)} {u('meters')}</p>
              </div>

              <div className="p-5 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-200">
                <p className="text-sm text-gray-600 mb-1">{t('timeOfFlight')}</p>
                <p className="text-2xl font-bold text-gray-900">{results.timeOfFlight.toFixed(2)} {u('secondsAbbrev')}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-xs text-gray-600 mb-1">{t('horizontalVelocity')}</p>
                  <p className="text-lg font-bold text-gray-900">{results.vx.toFixed(2)} {u('metersPerSecond')}</p>
                </div>

                <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                  <p className="text-xs text-gray-600 mb-1">{t('verticalVelocity')}</p>
                  <p className="text-lg font-bold text-gray-900">{results.vy.toFixed(2)} {u('metersPerSecond')}</p>
                </div>
              </div>
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
