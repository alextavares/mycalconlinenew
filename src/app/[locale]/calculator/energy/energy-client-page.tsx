'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type EnergyType = 'kinetic' | 'potential' | 'elastic';

export default function EnergyClientPage() {
  const t = useTranslations('EnergyCalculator');

  const [energyType, setEnergyType] = useState<EnergyType>('kinetic');

  // Kinetic Energy: KE = 1/2 * m * v^2
  const [mass, setMass] = useState('');
  const [velocity, setVelocity] = useState('');

  // Potential Energy: PE = m * g * h
  const [height, setHeight] = useState('');
  const [gravity, setGravity] = useState('9.8');

  // Elastic Potential Energy: EPE = 1/2 * k * x^2
  const [springConstant, setSpringConstant] = useState('');
  const [displacement, setDisplacement] = useState('');

  const [openSection, setOpenSection] = useState<string | null>(null);

  const result = useMemo(() => {
    const m = parseFloat(mass);
    const v = parseFloat(velocity);
    const h = parseFloat(height);
    const g = parseFloat(gravity);
    const k = parseFloat(springConstant);
    const x = parseFloat(displacement);

    if (energyType === 'kinetic') {
      if (!isNaN(m) && !isNaN(v) && m > 0) {
        return 0.5 * m * v * v;
      }
    } else if (energyType === 'potential') {
      if (!isNaN(m) && !isNaN(g) && !isNaN(h) && m > 0) {
        return m * g * h;
      }
    } else if (energyType === 'elastic') {
      if (!isNaN(k) && !isNaN(x) && k > 0) {
        return 0.5 * k * x * x;
      }
    }
    return null;
  }, [energyType, mass, velocity, height, gravity, springConstant, displacement]);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
          {/* Energy Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('selectEnergyType')}
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setEnergyType('kinetic')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  energyType === 'kinetic'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('kinetic')}
              </button>
              <button
                onClick={() => setEnergyType('potential')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  energyType === 'potential'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('potential')}
              </button>
              <button
                onClick={() => setEnergyType('elastic')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  energyType === 'elastic'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('elastic')}
              </button>
            </div>
          </div>

          {/* Formula Display */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center font-mono">
              {energyType === 'kinetic' && 'KE = ½mv²'}
              {energyType === 'potential' && 'PE = mgh'}
              {energyType === 'elastic' && 'EPE = ½kx²'}
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t('formulaDescription')}
            </p>
          </div>

          {/* Input Fields - Kinetic Energy */}
          {energyType === 'kinetic' && (
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
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('velocity')} (v) - m/s
                </label>
                <input
                  type="number"
                  value={velocity}
                  onChange={(e) => setVelocity(e.target.value)}
                  placeholder="20"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Input Fields - Potential Energy */}
          {energyType === 'potential' && (
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
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('height')} (h) - meters
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="5"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          )}

          {/* Input Fields - Elastic Potential Energy */}
          {energyType === 'elastic' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('springConstant')} (k) - N/m
                </label>
                <input
                  type="number"
                  value={springConstant}
                  onChange={(e) => setSpringConstant(e.target.value)}
                  placeholder="100"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('displacement')} (x) - meters
                </label>
                <input
                  type="number"
                  value={displacement}
                  onChange={(e) => setDisplacement(e.target.value)}
                  placeholder="0.2"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          )}

          {/* Result */}
          {result !== null && (
            <div className={`mt-6 p-6 rounded-lg border-2 ${
              energyType === 'kinetic' ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200' :
              energyType === 'potential' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' :
              'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'
            }`}>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{t('result')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {result.toFixed(4)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  J (Joules)
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

        {/* SEO Content - Collapsible Sections */}
        <div className="space-y-4">
          {/* What is Energy */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleSection('what')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-semibold text-gray-900">{t('whatIsTitle')}</h2>
              {openSection === 'what' ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {openSection === 'what' && (
              <div className="px-6 pb-4">
                <p className="text-gray-700 leading-relaxed">{t('whatIsContent')}</p>
              </div>
            )}
          </div>

          {/* Formulas */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleSection('formula')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-semibold text-gray-900">{t('formulaTitle')}</h2>
              {openSection === 'formula' ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {openSection === 'formula' && (
              <div className="px-6 pb-4">
                <p className="text-gray-700 leading-relaxed">{t('formulaContent')}</p>
              </div>
            )}
          </div>

          {/* Examples */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleSection('examples')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-semibold text-gray-900">{t('examplesTitle')}</h2>
              {openSection === 'examples' ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {openSection === 'examples' && (
              <div className="px-6 pb-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {t('examplesContent')}
                </p>
              </div>
            )}
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleSection('faq')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-semibold text-gray-900">{t('faq')}</h2>
              {openSection === 'faq' ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {openSection === 'faq' && (
              <div className="px-6 pb-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('faqQ1')}</h3>
                  <p className="text-gray-700">{t('faqA1')}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('faqQ2')}</h3>
                  <p className="text-gray-700">{t('faqA2')}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('faqQ3')}</h3>
                  <p className="text-gray-700">{t('faqA3')}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('faqQ4')}</h3>
                  <p className="text-gray-700">{t('faqA4')}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('faqQ5')}</h3>
                  <p className="text-gray-700">{t('faqA5')}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('faqQ6')}</h3>
                  <p className="text-gray-700">{t('faqA6')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
