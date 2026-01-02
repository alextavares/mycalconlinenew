'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function InclinedPlaneClientPage() {
  const t = useTranslations('InclinedPlaneCalculator');

  const [mass, setMass] = useState('');
  const [angle, setAngle] = useState('');
  const [friction, setFriction] = useState('0');
  const [gravity, setGravity] = useState('9.8');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const results = useMemo(() => {
    const m = parseFloat(mass);
    const theta = parseFloat(angle);
    const mu = parseFloat(friction);
    const g = parseFloat(gravity);

    if (!isNaN(m) && !isNaN(theta) && !isNaN(mu) && !isNaN(g) && m > 0 && theta >= 0 && theta <= 90 && mu >= 0 && g > 0) {
      const thetaRad = (theta * Math.PI) / 180;

      const weight = m * g;
      const normalForce = weight * Math.cos(thetaRad);
      const parallelForce = weight * Math.sin(thetaRad);
      const frictionForce = mu * normalForce;
      const netForce = parallelForce - frictionForce;
      const acceleration = netForce / m;
      const mechanicalAdvantage = 1 / Math.sin(thetaRad);

      return {
        weight,
        normalForce,
        parallelForce,
        frictionForce,
        netForce,
        acceleration,
        mechanicalAdvantage: mechanicalAdvantage > 0 && isFinite(mechanicalAdvantage) ? mechanicalAdvantage : null,
      };
    }
    return null;
  }, [mass, angle, friction, gravity]);

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
                {t('mass')} (m) - kg
              </label>
              <input
                type="number"
                value={mass}
                onChange={(e) => setMass(e.target.value)}
                placeholder="10"
                step="0.1"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('angle')} (θ) - degrees
              </label>
              <input
                type="number"
                value={angle}
                onChange={(e) => setAngle(e.target.value)}
                placeholder="30"
                step="1"
                min="0"
                max="90"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('friction')} (μ) - coefficient
              </label>
              <input
                type="number"
                value={friction}
                onChange={(e) => setFriction(e.target.value)}
                placeholder="0"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('frictionNote')}
              </p>
            </div>

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

          {results !== null && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
                  <p className="text-xs text-gray-600 mb-1">{t('weight')}</p>
                  <p className="text-2xl font-bold text-gray-900">{results.weight.toFixed(2)} N</p>
                </div>

                <div className="p-5 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
                  <p className="text-xs text-gray-600 mb-1">{t('normalForce')}</p>
                  <p className="text-2xl font-bold text-gray-900">{results.normalForce.toFixed(2)} N</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-xs text-gray-600 mb-1">{t('parallelForce')}</p>
                  <p className="text-lg font-bold text-gray-900">{results.parallelForce.toFixed(2)} N</p>
                  <p className="text-xs text-gray-500 mt-1">{t('parallelForceNote')}</p>
                </div>

                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs text-gray-600 mb-1">{t('frictionForce')}</p>
                  <p className="text-lg font-bold text-gray-900">{results.frictionForce.toFixed(2)} N</p>
                  <p className="text-xs text-gray-500 mt-1">{t('frictionForceNote')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-xs text-gray-600 mb-1">{t('netForce')}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {results.netForce > 0 ? '+' : ''}{results.netForce.toFixed(2)} N
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {results.netForce > 0 ? t('slidesDown') : results.netForce < 0 ? t('stationary') : t('balanced')}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                  <p className="text-xs text-gray-600 mb-1">{t('acceleration')}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {results.acceleration > 0 ? '+' : ''}{results.acceleration.toFixed(2)} m/s²
                  </p>
                </div>
              </div>

              {results.mechanicalAdvantage !== null && (
                <div className="p-5 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200">
                  <p className="text-sm text-gray-600 mb-1 text-center">{t('mechanicalAdvantage')}</p>
                  <p className="text-2xl font-bold text-gray-900 text-center">
                    {results.mechanicalAdvantage.toFixed(2)}×
                  </p>
                  <p className="text-xs text-gray-500 mt-1 text-center">{t('maNote')}</p>
                </div>
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
