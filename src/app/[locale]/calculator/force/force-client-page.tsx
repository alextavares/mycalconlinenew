'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'force' | 'mass' | 'acceleration';

export default function ForceClientPage() {
  const t = useTranslations('ForceCalculator');

  const [mode, setMode] = useState<CalculationMode>('force');
  const [mass, setMass] = useState('');
  const [acceleration, setAcceleration] = useState('');
  const [force, setForce] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const result = useMemo(() => {
    const m = parseFloat(mass);
    const a = parseFloat(acceleration);
    const f = parseFloat(force);

    if (mode === 'force') {
      if (!isNaN(m) && !isNaN(a) && m > 0) {
        return m * a;
      }
    } else if (mode === 'mass') {
      if (!isNaN(f) && !isNaN(a) && a !== 0) {
        return f / a;
      }
    } else if (mode === 'acceleration') {
      if (!isNaN(f) && !isNaN(m) && m > 0) {
        return f / m;
      }
    }
    return null;
  }, [mode, mass, acceleration, force]);

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
          {/* Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('selectCalculation')}
            </label>
            <div className="grid grid-cols-3 gap-3">
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
                onClick={() => setMode('mass')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'mass'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('mass')}
              </button>
              <button
                onClick={() => setMode('acceleration')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'acceleration'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('acceleration')}
              </button>
            </div>
          </div>

          {/* Formula Display */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center font-mono">
              {mode === 'force' && 'F = m × a'}
              {mode === 'mass' && 'm = F / a'}
              {mode === 'acceleration' && 'a = F / m'}
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t('formulaDescription')}
            </p>
          </div>

          {/* Input Fields */}
          <div className="space-y-4 mb-6">
            {mode !== 'force' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('force')} (F) - N (Newtons)
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

            {mode !== 'mass' && (
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
            )}

            {mode !== 'acceleration' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('acceleration')} (a) - m/s²
                </label>
                <input
                  type="number"
                  value={acceleration}
                  onChange={(e) => setAcceleration(e.target.value)}
                  placeholder="9.8"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            )}
          </div>

          {/* Result */}
          {result !== null && (
            <div className="mt-6 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border-2 border-red-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{t('result')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {result.toFixed(4)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {mode === 'force' && 'N (Newtons)'}
                  {mode === 'mass' && 'kg'}
                  {mode === 'acceleration' && 'm/s²'}
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
          {/* What is Force */}
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

          {/* Formula */}
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
