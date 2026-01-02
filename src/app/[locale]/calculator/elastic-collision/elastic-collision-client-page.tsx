'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ElasticCollisionClientPage() {
  const t = useTranslations('ElasticCollisionCalculator');

  const [mass1, setMass1] = useState('');
  const [mass2, setMass2] = useState('');
  const [velocity1Initial, setVelocity1Initial] = useState('');
  const [velocity2Initial, setVelocity2Initial] = useState('0');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const results = useMemo(() => {
    const m1 = parseFloat(mass1);
    const m2 = parseFloat(mass2);
    const u1 = parseFloat(velocity1Initial);
    const u2 = parseFloat(velocity2Initial);

    if (!isNaN(m1) && !isNaN(m2) && !isNaN(u1) && !isNaN(u2) && m1 > 0 && m2 > 0) {
      const v1 = ((m1 - m2) * u1 + 2 * m2 * u2) / (m1 + m2);
      const v2 = ((m2 - m1) * u2 + 2 * m1 * u1) / (m1 + m2);

      const keBefore = 0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2;
      const keAfter = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;

      const momentumBefore = m1 * u1 + m2 * u2;
      const momentumAfter = m1 * v1 + m2 * v2;

      return {
        v1Final: v1,
        v2Final: v2,
        keBefore,
        keAfter,
        momentumBefore,
        momentumAfter,
      };
    }
    return null;
  }, [mass1, mass2, velocity1Initial, velocity2Initial]);

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
              {t('conservationNote')}
            </p>
          </div>

          <div className="space-y-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('mass1')} (m₁) - kg
                </label>
                <input
                  type="number"
                  value={mass1}
                  onChange={(e) => setMass1(e.target.value)}
                  placeholder="5"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('velocity1Initial')} (u₁) - m/s
                </label>
                <input
                  type="number"
                  value={velocity1Initial}
                  onChange={(e) => setVelocity1Initial(e.target.value)}
                  placeholder="10"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('mass2')} (m₂) - kg
                </label>
                <input
                  type="number"
                  value={mass2}
                  onChange={(e) => setMass2(e.target.value)}
                  placeholder="3"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('velocity2Initial')} (u₂) - m/s
                </label>
                <input
                  type="number"
                  value={velocity2Initial}
                  onChange={(e) => setVelocity2Initial(e.target.value)}
                  placeholder="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {results !== null && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
                  <p className="text-xs text-gray-600 mb-1">{t('velocity1Final')} (v₁)</p>
                  <p className="text-2xl font-bold text-gray-900">{results.v1Final.toFixed(3)} m/s</p>
                </div>

                <div className="p-5 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
                  <p className="text-xs text-gray-600 mb-1">{t('velocity2Final')} (v₂)</p>
                  <p className="text-2xl font-bold text-gray-900">{results.v2Final.toFixed(3)} m/s</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-xs text-gray-600 mb-1">{t('kineticEnergyBefore')}</p>
                  <p className="text-lg font-bold text-gray-900">{results.keBefore.toFixed(2)} J</p>
                </div>

                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-xs text-gray-600 mb-1">{t('kineticEnergyAfter')}</p>
                  <p className="text-lg font-bold text-gray-900">{results.keAfter.toFixed(2)} J</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                  <p className="text-xs text-gray-600 mb-1">{t('momentumBefore')}</p>
                  <p className="text-lg font-bold text-gray-900">{results.momentumBefore.toFixed(2)} kg⋅m/s</p>
                </div>

                <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                  <p className="text-xs text-gray-600 mb-1">{t('momentumAfter')}</p>
                  <p className="text-lg font-bold text-gray-900">{results.momentumAfter.toFixed(2)} kg⋅m/s</p>
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
