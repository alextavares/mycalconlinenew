'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Calculator,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BarChart3,
  TrendingUp,
  Hash
} from 'lucide-react';

export default function AverageClientPage() {
  const t = useTranslations('AverageCalculator');

  const [inputValue, setInputValue] = useState<string>('');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howToCalculate: false,
    differences: false,
    faq: false
  });

  const addNumber = () => {
    const num = parseFloat(inputValue);
    if (!isNaN(num)) {
      setNumbers([...numbers, num]);
      setInputValue('');
    }
  };

  const addFromPaste = (text: string) => {
    const nums = text.split(/[,\s]+/).map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    if (nums.length > 0) {
      setNumbers([...numbers, ...nums]);
      setInputValue('');
    }
  };

  const removeNumber = (index: number) => {
    setNumbers(numbers.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    setNumbers([]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addNumber();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text');
    if (text.includes(',') || text.includes(' ')) {
      e.preventDefault();
      addFromPaste(text);
    }
  };

  const results = useMemo(() => {
    if (numbers.length === 0) return null;

    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = numbers.reduce((acc, n) => acc + n, 0);
    const count = numbers.length;

    // Mean (Average)
    const mean = sum / count;

    // Median
    let median: number;
    const mid = Math.floor(count / 2);
    if (count % 2 === 0) {
      median = (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
      median = sorted[mid];
    }

    // Mode
    const frequency: Record<number, number> = {};
    let maxFreq = 0;
    numbers.forEach(n => {
      frequency[n] = (frequency[n] || 0) + 1;
      if (frequency[n] > maxFreq) maxFreq = frequency[n];
    });

    const modes = Object.entries(frequency)
      .filter(([_, freq]) => freq === maxFreq)
      .map(([num, _]) => parseFloat(num));

    const hasMode = maxFreq > 1;
    const mode = hasMode ? modes : null;

    // Range
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const range = max - min;

    // Geometric Mean (only for positive numbers)
    const allPositive = numbers.every(n => n > 0);
    const geometricMean = allPositive
      ? Math.pow(numbers.reduce((acc, n) => acc * n, 1), 1 / count)
      : null;

    return {
      mean,
      median,
      mode,
      hasMode,
      sum,
      count,
      min,
      max,
      range,
      geometricMean,
      sorted
    };
  }, [numbers]);

  const formatNumber = (value: number): string => {
    if (Number.isInteger(value)) return value.toString();
    return value.toFixed(4).replace(/\.?0+$/, '');
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('enterNumbers')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder={t('placeholder')}
                className="flex-1 px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
              />
              <button
                onClick={addNumber}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {t('add')}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">{t('tip')}</p>
          </div>

          {/* Numbers List */}
          {numbers.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  {t('yourNumbers')} ({numbers.length})
                </span>
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t('clearAll')}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {numbers.map((num, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg group"
                  >
                    <span className="font-medium">{formatNumber(num)}</span>
                    <button
                      onClick={() => removeNumber(index)}
                      className="p-0.5 hover:bg-blue-200 rounded opacity-50 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="pt-6 border-t border-gray-200">
              {/* Main Results */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Mean */}
                <div className="p-5 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">{t('mean')}</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{formatNumber(results.mean)}</p>
                  <p className="text-xs text-blue-500 mt-1">{t('meanFormula')}</p>
                </div>

                {/* Median */}
                <div className="p-5 bg-green-50 rounded-xl border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">{t('median')}</span>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{formatNumber(results.median)}</p>
                  <p className="text-xs text-green-500 mt-1">{t('medianFormula')}</p>
                </div>

                {/* Mode */}
                <div className="p-5 bg-purple-50 rounded-xl border-2 border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Hash className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">{t('mode')}</span>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">
                    {results.hasMode ? results.mode!.map(m => formatNumber(m)).join(', ') : t('noMode')}
                  </p>
                  <p className="text-xs text-purple-500 mt-1">{t('modeFormula')}</p>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-xs text-gray-500">{t('sum')}</p>
                  <p className="text-lg font-bold text-gray-800">{formatNumber(results.sum)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-xs text-gray-500">{t('count')}</p>
                  <p className="text-lg font-bold text-gray-800">{results.count}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-xs text-gray-500">{t('min')}</p>
                  <p className="text-lg font-bold text-gray-800">{formatNumber(results.min)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-xs text-gray-500">{t('max')}</p>
                  <p className="text-lg font-bold text-gray-800">{formatNumber(results.max)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-xs text-gray-500">{t('range')}</p>
                  <p className="text-lg font-bold text-gray-800">{formatNumber(results.range)}</p>
                </div>
              </div>

              {/* Geometric Mean (if applicable) */}
              {results.geometricMean && (
                <div className="mt-4 p-3 bg-amber-50 rounded-xl">
                  <p className="text-sm text-amber-700">
                    <strong>{t('geometricMean')}:</strong> {formatNumber(results.geometricMean)}
                    <span className="text-xs ml-2 text-amber-600">{t('geometricNote')}</span>
                  </p>
                </div>
              )}

              {/* Sorted Numbers */}
              <div className="mt-4 p-3 bg-gray-100 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">{t('sorted')}</p>
                <p className="text-sm font-mono text-gray-700">
                  {results.sorted.map(n => formatNumber(n)).join(', ')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content Sections */}
        <div className="space-y-4">
          {/* What Is Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('whatIs')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('whatIs.title')}</h2>
              {expandedSections.whatIs ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.whatIs && (
              <div className="px-6 pb-6">
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('whatIs.content') }}
                />
              </div>
            )}
          </div>

          {/* How To Calculate Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('howToCalculate')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('howToCalculate.title')}</h2>
              {expandedSections.howToCalculate ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.howToCalculate && (
              <div className="px-6 pb-6">
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('howToCalculate.content') }}
                />
              </div>
            )}
          </div>

          {/* Differences Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('differences')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('differences.title')}</h2>
              {expandedSections.differences ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.differences && (
              <div className="px-6 pb-6">
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('differences.content') }}
                />
              </div>
            )}
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('faq')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('faq.title')}</h2>
              {expandedSections.faq ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.faq && (
              <div className="px-6 pb-6 space-y-4">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num} className="border-b border-gray-100 pb-4 last:border-0">
                    <h3 className="font-medium text-gray-900 mb-2">{t(`faq.q${num}`)}</h3>
                    <p className="text-gray-600 text-sm">{t(`faq.a${num}`)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
