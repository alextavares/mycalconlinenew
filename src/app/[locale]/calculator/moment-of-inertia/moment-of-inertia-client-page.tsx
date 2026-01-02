'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type ShapeType = 'pointMass' | 'rod' | 'disk' | 'sphere' | 'rectangle';

export default function MomentOfInertiaClientPage() {
  const t = useTranslations('MomentOfInertiaCalculator');

  const [shape, setShape] = useState<ShapeType>('pointMass');
  const [mass, setMass] = useState('');
  const [radius, setRadius] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const result = useMemo(() => {
    const m = parseFloat(mass);
    const r = parseFloat(radius);
    const L = parseFloat(length);
    const w = parseFloat(width);

    if (shape === 'pointMass') {
      if (!isNaN(m) && !isNaN(r) && m > 0 && r >= 0) {
        return m * r * r;
      }
    } else if (shape === 'rod') {
      if (!isNaN(m) && !isNaN(L) && m > 0 && L > 0) {
        return (m * L * L) / 12;
      }
    } else if (shape === 'disk') {
      if (!isNaN(m) && !isNaN(r) && m > 0 && r > 0) {
        return 0.5 * m * r * r;
      }
    } else if (shape === 'sphere') {
      if (!isNaN(m) && !isNaN(r) && m > 0 && r > 0) {
        return (2 / 5) * m * r * r;
      }
    } else if (shape === 'rectangle') {
      if (!isNaN(m) && !isNaN(L) && !isNaN(w) && m > 0 && L > 0 && w > 0) {
        return (m * (L * L + w * w)) / 12;
      }
    }
    return null;
  }, [shape, mass, radius, length, width]);

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
              {t('selectShape')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <button
                onClick={() => setShape('pointMass')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  shape === 'pointMass'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('pointMass')}
              </button>
              <button
                onClick={() => setShape('rod')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  shape === 'rod'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('rod')}
              </button>
              <button
                onClick={() => setShape('disk')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  shape === 'disk'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('disk')}
              </button>
              <button
                onClick={() => setShape('sphere')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  shape === 'sphere'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('sphere')}
              </button>
              <button
                onClick={() => setShape('rectangle')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  shape === 'rectangle'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('rectangle')}
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center font-mono">
              {shape === 'pointMass' && 'I = mr²'}
              {shape === 'rod' && 'I = mL²/12'}
              {shape === 'disk' && 'I = ½mr²'}
              {shape === 'sphere' && 'I = ⅖mr²'}
              {shape === 'rectangle' && 'I = m(L² + w²)/12'}
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t('formulaDescription')}
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
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {(shape === 'pointMass' || shape === 'disk' || shape === 'sphere') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('radius')} (r) - meters
                </label>
                <input
                  type="number"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  placeholder="0.5"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            )}

            {(shape === 'rod' || shape === 'rectangle') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('length')} (L) - meters
                </label>
                <input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="2"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            )}

            {shape === 'rectangle' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('width')} (w) - meters
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="1"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            )}
          </div>

          {result !== null && (
            <div className={`mt-6 p-6 rounded-lg border-2 ${
              shape === 'pointMass' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' :
              shape === 'rod' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' :
              shape === 'disk' ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200' :
              shape === 'sphere' ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200' :
              'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
            }`}>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">{t('result')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {result.toFixed(4)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  kg·m² (kilogram-meter squared)
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
