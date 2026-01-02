'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function PulleySystemClientPage() {
  const t = useTranslations('PulleySystemCalculator');

  const [load, setLoad] = useState('');
  const [numberOfPulleys, setNumberOfPulleys] = useState('');
  const [efficiency, setEfficiency] = useState('100');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const results = useMemo(() => {
    const W = parseFloat(load);
    const n = parseFloat(numberOfPulleys);
    const eff = parseFloat(efficiency);

    if (!isNaN(W) && !isNaN(n) && !isNaN(eff) && W > 0 && n > 0 && eff > 0 && eff <= 100) {
      const mechanicalAdvantage = n;
      const idealEffort = W / n;
      const actualEffort = (W / n) / (eff / 100);
      const distanceRatio = n;

      return {
        mechanicalAdvantage,
        idealEffort,
        actualEffort,
        distanceRatio,
        efficiency: eff,
      };
    }
    return null;
  }, [load, numberOfPulleys, efficiency]);

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
              {t('mechanicalAdvantageNote')}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('load')} (W) - Newtons
              </label>
              <input
                type="number"
                value={load}
                onChange={(e) => setLoad(e.target.value)}
                placeholder="1000"
                step="1"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('numberOfPulleys')} (n)
              </label>
              <input
                type="number"
                value={numberOfPulleys}
                onChange={(e) => setNumberOfPulleys(e.target.value)}
                placeholder="4"
                step="1"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('pulleyNote')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('efficiency')} (%) - Optional
              </label>
              <input
                type="number"
                value={efficiency}
                onChange={(e) => setEfficiency(e.target.value)}
                placeholder="100"
                step="1"
                min="1"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('efficiencyNote')}
              </p>
            </div>
          </div>

          {results !== null && (
            <div className="space-y-4">
              <div className="p-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
                <p className="text-sm text-gray-600 mb-1 text-center">{t('mechanicalAdvantage')}</p>
                <p className="text-3xl font-bold text-gray-900 text-center">
                  {results.mechanicalAdvantage}× force reduction
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-xs text-gray-600 mb-1">{t('idealEffort')}</p>
                  <p className="text-2xl font-bold text-gray-900">{results.idealEffort.toFixed(2)} N</p>
                  <p className="text-xs text-gray-500 mt-1">(100% efficiency)</p>
                </div>

                <div className="p-5 rounded-lg bg-orange-50 border border-orange-200">
                  <p className="text-xs text-gray-600 mb-1">{t('actualEffort')}</p>
                  <p className="text-2xl font-bold text-gray-900">{results.actualEffort.toFixed(2)} N</p>
                  <p className="text-xs text-gray-500 mt-1">({results.efficiency}% efficiency)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <p className="text-xs text-gray-600 mb-1">{t('distanceRatio')}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {results.distanceRatio}:1
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{t('distanceRatioNote')}</p>
                </div>

                <div className="p-4 rounded-lg bg-cyan-50 border border-cyan-200">
                  <p className="text-xs text-gray-600 mb-1">{t('workSaved')}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {((1 - 1/results.mechanicalAdvantage) * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{t('forceSavedNote')}</p>
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
              onClick={() => toggleSection('how')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-semibold text-gray-900">{t('howItWorksTitle')}</h2>
              {openSection === 'how' ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {openSection === 'how' && (
              <div className="px-6 pb-4">
                <p className="text-gray-700 leading-relaxed">{t('howItWorksContent')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
