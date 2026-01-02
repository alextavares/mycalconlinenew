'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'torque' | 'force' | 'distance';

export default function TorqueClientPage() {
  const t = useTranslations('TorqueCalculator');

  const [mode, setMode] = useState<CalculationMode>('torque');
  const [force, setForce] = useState('');
  const [distance, setDistance] = useState('');
  const [torque, setTorque] = useState('');
  const [angle, setAngle] = useState('90');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const result = useMemo(() => {
    const F = parseFloat(force);
    const r = parseFloat(distance);
    const tau = parseFloat(torque);
    const theta = parseFloat(angle);

    const angleRad = (theta * Math.PI) / 180;
    const sinTheta = Math.sin(angleRad);

    if (mode === 'torque') {
      if (!isNaN(F) && !isNaN(r) && !isNaN(theta) && r > 0) {
        return F * r * sinTheta;
      }
    } else if (mode === 'force') {
      if (!isNaN(tau) && !isNaN(r) && !isNaN(theta) && r > 0 && sinTheta !== 0) {
        return tau / (r * sinTheta);
      }
    } else if (mode === 'distance') {
      if (!isNaN(tau) && !isNaN(F) && !isNaN(theta) && F !== 0 && sinTheta !== 0) {
        return tau / (F * sinTheta);
      }
    }
    return null;
  }, [mode, force, distance, torque, angle]);

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
                onClick={() => setMode('torque')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'torque'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('torque')}
              </button>
              <button
                onClick={() => setMode('force')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'force'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('force')}
              </button>
              <button
                onClick={() => setMode('distance')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'distance'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('distance')}
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center font-mono">
              {mode === 'torque' && 'τ = F × r × sin(θ)'}
              {mode === 'force' && 'F = τ / (r × sin(θ))'}
              {mode === 'distance' && 'r = τ / (F × sin(θ))'}
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t('formulaDescription')}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {mode !== 'torque' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('torque')} (τ) - N⋅m
                </label>
                <input
                  type="number"
                  value={torque}
                  onChange={(e) => setTorque(e.target.value)}
                  placeholder="50"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />
              </div>
            )}

            {mode !== 'force' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('force')} (F) - N
                </label>
                <input
                  type="number"
                  value={force}
                  onChange={(e) => setForce(e.target.value)}
                  placeholder="100"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                  placeholder="0.5"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                placeholder="90"
                step="1"
                min="0"
                max="180"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">90° = perpendicular (maximum torque)</p>
            </div>
          </div>

          {result !== null && (
            <div className={`mt-6 p-6 rounded-lg border-2 ${
              mode === 'torque' ? 'bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200' :
              mode === 'force' ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' :
              'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'
            }`}>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{t('result')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {result.toFixed(4)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {mode === 'torque' && 'N⋅m'}
                  {mode === 'force' && 'N'}
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
