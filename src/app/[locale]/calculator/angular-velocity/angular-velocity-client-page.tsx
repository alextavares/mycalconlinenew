'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'angularVelocity' | 'angle' | 'time' | 'rpm';

export default function AngularVelocityClientPage() {
  const t = useTranslations('AngularVelocityCalculator');
  const u = useTranslations('Units');

  const [mode, setMode] = useState<CalculationMode>('angularVelocity');
  const [angle, setAngle] = useState('');
  const [time, setTime] = useState('');
  const [angularVelocity, setAngularVelocity] = useState('');
  const [rpm, setRpm] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const result = useMemo(() => {
    const theta = parseFloat(angle);
    const t = parseFloat(time);
    const omega = parseFloat(angularVelocity);
    const rotations = parseFloat(rpm);

    if (mode === 'angularVelocity') {
      if (!isNaN(theta) && !isNaN(t) && theta >= 0 && t > 0) {
        return theta / t;
      }
    } else if (mode === 'angle') {
      if (!isNaN(omega) && !isNaN(t) && omega >= 0 && t >= 0) {
        return omega * t;
      }
    } else if (mode === 'time') {
      if (!isNaN(theta) && !isNaN(omega) && theta >= 0 && omega > 0) {
        return theta / omega;
      }
    } else if (mode === 'rpm') {
      if (!isNaN(omega) && omega >= 0) {
        return (omega * 60) / (2 * Math.PI);
      }
    }
    return null;
  }, [mode, angle, time, angularVelocity, rpm]);

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
                onClick={() => setMode('angularVelocity')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'angularVelocity'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('angularVelocity')}
              </button>
              <button
                onClick={() => setMode('angle')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'angle'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('angle')}
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
              <button
                onClick={() => setMode('rpm')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'rpm'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('rpm')}
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center font-mono">
              {mode === 'angularVelocity' && 'ω = θ/t'}
              {mode === 'angle' && 'θ = ωt'}
              {mode === 'time' && 't = θ/ω'}
              {mode === 'rpm' && 'RPM = ω×60/(2π)'}
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t('formulaDescription')}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {mode === 'rpm' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('angularVelocity')} (ω) - {u('radiansPerSecond')}
                </label>
                <input
                  type="number"
                  value={angularVelocity}
                  onChange={(e) => setAngularVelocity(e.target.value)}
                  placeholder="10"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}

            {mode !== 'angularVelocity' && mode !== 'rpm' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('angularVelocity')} (ω) - {u('radiansPerSecond')}
                </label>
                <input
                  type="number"
                  value={angularVelocity}
                  onChange={(e) => setAngularVelocity(e.target.value)}
                  placeholder="10"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}

            {mode !== 'angle' && mode !== 'rpm' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('angle')} (θ) - {u('radians')}
                </label>
                <input
                  type="number"
                  value={angle}
                  onChange={(e) => setAngle(e.target.value)}
                  placeholder="6.28"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {u('radianReference')}
                </p>
              </div>
            )}

            {mode !== 'time' && mode !== 'rpm' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('time')} (t) - {u('seconds')}
                </label>
                <input
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="2"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            )}
          </div>

          {result !== null && (
            <div className={`mt-6 p-6 rounded-lg border-2 ${
              mode === 'angularVelocity' ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200' :
              mode === 'angle' ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200' :
              mode === 'time' ? 'bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200' :
              'bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200'
            }`}>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{t('result')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {result.toFixed(3)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {mode === 'angularVelocity' && u('radiansPerSecondLabel')}
                  {mode === 'angle' && u('radiansLabel')}
                  {mode === 'time' && u('secondsLabel')}
                  {mode === 'rpm' && u('rpmLabel')}
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
