'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type CalculationMode = 'power' | 'work' | 'time';

export default function PowerClientPage() {
  const t = useTranslations('PowerCalculator');

  const [mode, setMode] = useState<CalculationMode>('power');
  const [work, setWork] = useState('');
  const [time, setTime] = useState('');
  const [power, setPower] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const result = useMemo(() => {
    const w = parseFloat(work);
    const t_val = parseFloat(time);
    const p = parseFloat(power);

    if (mode === 'power') {
      if (!isNaN(w) && !isNaN(t_val) && t_val > 0) {
        return w / t_val;
      }
    } else if (mode === 'work') {
      if (!isNaN(p) && !isNaN(t_val) && p > 0 && t_val > 0) {
        return p * t_val;
      }
    } else if (mode === 'time') {
      if (!isNaN(w) && !isNaN(p) && p > 0) {
        return w / p;
      }
    }
    return null;
  }, [mode, work, time, power]);

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
                onClick={() => setMode('power')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'power'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('power')}
              </button>
              <button
                onClick={() => setMode('work')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  mode === 'work'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('work')}
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
              {mode === 'power' && 'P = W / t'}
              {mode === 'work' && 'W = P × t'}
              {mode === 'time' && 't = W / P'}
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t('formulaDescription')}
            </p>
          </div>

          {/* Input Fields */}
          <div className="space-y-4 mb-6">
            {mode !== 'power' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('power')} (P) - Watts (W)
                </label>
                <input
                  type="number"
                  value={power}
                  onChange={(e) => setPower(e.target.value)}
                  placeholder="100"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            )}

            {mode !== 'work' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('work')} (W) - Joules (J)
                </label>
                <input
                  type="number"
                  value={work}
                  onChange={(e) => setWork(e.target.value)}
                  placeholder="1000"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {mode !== 'time' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('time')} (t) - seconds (s)
                </label>
                <input
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="10"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            )}
          </div>

          {/* Result */}
          {result !== null && (
            <div className={`mt-6 p-6 rounded-lg border-2 ${
              mode === 'power' ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200' :
              mode === 'work' ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200' :
              'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
            }`}>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{t('result')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {result.toFixed(4)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {mode === 'power' && 'W (Watts)'}
                  {mode === 'work' && 'J (Joules)'}
                  {mode === 'time' && 's (seconds)'}
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
          {/* What is Power */}
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
