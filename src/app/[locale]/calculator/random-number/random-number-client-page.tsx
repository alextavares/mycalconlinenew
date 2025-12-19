'use client';

import React, { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dices,
  Shuffle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Hash,
  ListOrdered,
  Sparkles
} from 'lucide-react';

type GeneratorMode = 'single' | 'multiple' | 'list' | 'dice';

export default function RandomNumberClientPage() {
  const t = useTranslations('RandomNumberGenerator');

  const [mode, setMode] = useState<GeneratorMode>('single');
  const [min, setMin] = useState<string>('1');
  const [max, setMax] = useState<string>('100');
  const [count, setCount] = useState<string>('5');
  const [diceCount, setDiceCount] = useState<string>('2');
  const [diceSides, setDiceSides] = useState<string>('6');
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(true);
  const [results, setResults] = useState<number[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<number[][]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howTo: false,
    useCases: false,
    faq: false
  });

  const modes = [
    { id: 'single', icon: Hash, label: t('modeSingle') },
    { id: 'multiple', icon: ListOrdered, label: t('modeMultiple') },
    { id: 'list', icon: Shuffle, label: t('modeList') },
    { id: 'dice', icon: Dices, label: t('modeDice') },
  ];

  const generateRandom = useCallback(() => {
    const minNum = parseInt(min) || 1;
    const maxNum = parseInt(max) || 100;
    const countNum = parseInt(count) || 5;
    const diceCountNum = parseInt(diceCount) || 2;
    const diceSidesNum = parseInt(diceSides) || 6;

    let newResults: number[] = [];

    switch (mode) {
      case 'single':
        newResults = [Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum];
        break;

      case 'multiple':
        for (let i = 0; i < countNum; i++) {
          newResults.push(Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
        }
        break;

      case 'list':
        if (allowDuplicates) {
          for (let i = 0; i < countNum; i++) {
            newResults.push(Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
          }
        } else {
          const range = maxNum - minNum + 1;
          const actualCount = Math.min(countNum, range);
          const available = Array.from({ length: range }, (_, i) => minNum + i);
          for (let i = 0; i < actualCount; i++) {
            const idx = Math.floor(Math.random() * available.length);
            newResults.push(available[idx]);
            available.splice(idx, 1);
          }
        }
        break;

      case 'dice':
        let total = 0;
        for (let i = 0; i < diceCountNum; i++) {
          const roll = Math.floor(Math.random() * diceSidesNum) + 1;
          newResults.push(roll);
          total += roll;
        }
        newResults.push(total); // Last element is the total
        break;
    }

    setResults(newResults);
    if (newResults.length > 0) {
      setHistory(prev => [newResults, ...prev].slice(0, 10));
    }
  }, [mode, min, max, count, diceCount, diceSides, allowDuplicates]);

  const copyToClipboard = () => {
    const text = mode === 'dice'
      ? results.slice(0, -1).join(', ') + ` (Total: ${results[results.length - 1]})`
      : results.join(', ');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const quickPresets = [
    { label: '1-10', min: 1, max: 10 },
    { label: '1-100', min: 1, max: 100 },
    { label: '1-1000', min: 1, max: 1000 },
    { label: '0-1', min: 0, max: 1 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-purple-100 rounded-2xl mb-4">
            <Dices className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('selectMode')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {modes.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as GeneratorMode)}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    mode === m.id
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <m.icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Presets (for single/multiple/list) */}
          {mode !== 'dice' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('quickPresets')}
              </label>
              <div className="flex flex-wrap gap-2">
                {quickPresets.map(preset => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setMin(preset.min.toString());
                      setMax(preset.max.toString());
                    }}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Inputs based on mode */}
          {mode === 'dice' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('numberOfDice')}
                </label>
                <input
                  type="number"
                  value={diceCount}
                  onChange={(e) => setDiceCount(e.target.value)}
                  min="1"
                  max="20"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('sidesPerDie')}
                </label>
                <select
                  value={diceSides}
                  onChange={(e) => setDiceSides(e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                >
                  <option value="4">D4 (4 sides)</option>
                  <option value="6">D6 (6 sides)</option>
                  <option value="8">D8 (8 sides)</option>
                  <option value="10">D10 (10 sides)</option>
                  <option value="12">D12 (12 sides)</option>
                  <option value="20">D20 (20 sides)</option>
                  <option value="100">D100 (100 sides)</option>
                </select>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('minimum')}
                  </label>
                  <input
                    type="number"
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('maximum')}
                  </label>
                  <input
                    type="number"
                    value={max}
                    onChange={(e) => setMax(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                  />
                </div>
              </div>

              {(mode === 'multiple' || mode === 'list') && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('howMany')}
                  </label>
                  <input
                    type="number"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    min="1"
                    max="1000"
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                  />
                </div>
              )}

              {mode === 'list' && (
                <div className="mb-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowDuplicates}
                      onChange={(e) => setAllowDuplicates(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{t('allowDuplicates')}</span>
                  </label>
                </div>
              )}
            </>
          )}

          {/* Generate Button */}
          <button
            onClick={generateRandom}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {t('generate')}
          </button>

          {/* Results */}
          {results.length > 0 && (
            <div className="mt-6 p-5 bg-purple-50 rounded-xl border-2 border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-purple-700">{t('result')}</h3>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? t('copied') : t('copy')}
                </button>
              </div>

              {mode === 'dice' ? (
                <div className="text-center">
                  <div className="flex flex-wrap justify-center gap-3 mb-4">
                    {results.slice(0, -1).map((roll, idx) => (
                      <div
                        key={idx}
                        className="w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center text-2xl font-bold text-purple-600 border-2 border-purple-300"
                      >
                        {roll}
                      </div>
                    ))}
                  </div>
                  <p className="text-lg text-purple-700">
                    {t('total')}: <span className="text-3xl font-bold">{results[results.length - 1]}</span>
                  </p>
                </div>
              ) : mode === 'single' ? (
                <p className="text-5xl font-bold text-purple-600 text-center">
                  {results[0]}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {results.map((num, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-white rounded-lg text-purple-600 font-medium border border-purple-200"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* History */}
          {history.length > 1 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <h3 className="text-sm font-medium text-gray-700 mb-2">{t('history')}</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {history.slice(1).map((item, idx) => (
                  <div key={idx} className="text-sm text-gray-500">
                    {mode === 'dice'
                      ? `${item.slice(0, -1).join(', ')} = ${item[item.length - 1]}`
                      : item.join(', ')
                    }
                  </div>
                ))}
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

          {/* How To Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('howTo')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('howTo.title')}</h2>
              {expandedSections.howTo ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.howTo && (
              <div className="px-6 pb-6">
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('howTo.content') }}
                />
              </div>
            )}
          </div>

          {/* Use Cases Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('useCases')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('useCases.title')}</h2>
              {expandedSections.useCases ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.useCases && (
              <div className="px-6 pb-6">
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('useCases.content') }}
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
