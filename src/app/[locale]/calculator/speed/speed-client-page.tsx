'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'speed' | 'distance' | 'time';

export default function SpeedClientPage() {
  const t = useTranslations('SpeedCalculator');

  const [mode, setMode] = useState<CalculationMode>('speed');
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [speed, setSpeed] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const result = useMemo(() => {
    const d = parseFloat(distance);
    const t_val = parseFloat(time);
    const s = parseFloat(speed);

    if (mode === 'speed') {
      if (!isNaN(d) && !isNaN(t_val) && t_val > 0) {
        return d / t_val;
      }
    } else if (mode === 'distance') {
      if (!isNaN(s) && !isNaN(t_val) && s > 0 && t_val > 0) {
        return s * t_val;
      }
    } else if (mode === 'time') {
      if (!isNaN(d) && !isNaN(s) && s > 0) {
        return d / s;
      }
    }
    return null;
  }, [mode, distance, time, speed]);

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
                onClick={() => setMode('speed')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'speed'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('speed')}
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
              <button
                onClick={() => setMode('time')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'time'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('time')}
              </button>
            </div>
          </div>

          {/* Formula Display */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center font-mono">
              {mode === 'speed' && 'v = d / t'}
              {mode === 'distance' && 'd = v × t'}
              {mode === 'time' && 't = d / v'}
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t('formulaDescription')}
            </p>
          </div>

          {/* Input Fields */}
          <div className="space-y-4 mb-6">
            {mode !== 'speed' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('speed')} (v) - m/s
                </label>
                <input
                  type="number"
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value)}
                  placeholder="20"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            )}

            {mode !== 'distance' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('distance')} (d) - meters
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="100"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {mode !== 'time' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('time')} (t) - seconds
                </label>
                <input
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="5"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            )}
          </div>

          {/* Result */}
          {result !== null && (
            <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{t('result')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {result.toFixed(4)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {mode === 'speed' && 'm/s'}
                  {mode === 'distance' && 'meters'}
                  {mode === 'time' && 'seconds'}
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
          {/* What is Speed */}
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
