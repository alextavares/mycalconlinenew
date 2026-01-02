'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Dices, ChevronDown, ChevronUp, Target, Shuffle, Layers } from 'lucide-react';

type CalculationMode = 'single' | 'multiple' | 'conditional' | 'complement';

export default function ProbabilityClientPage() {
  const t = useTranslations('ProbabilityCalculator');

  const [mode, setMode] = useState<CalculationMode>('single');

  // Single event
  const [favorable, setFavorable] = useState<string>('3');
  const [total, setTotal] = useState<string>('10');

  // Multiple events
  const [probA, setProbA] = useState<string>('0.5');
  const [probB, setProbB] = useState<string>('0.3');
  const [eventType, setEventType] = useState<'and' | 'or'>('and');
  const [independent, setIndependent] = useState<boolean>(true);
  const [probAandB, setProbAandB] = useState<string>(''); // For dependent P(A∩B)

  // Conditional
  const [probBgivenA, setProbBgivenA] = useState<string>('0.6');

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    formulas: false,
    examples: false,
    faq: false
  });

  const modes = [
    { id: 'single', icon: Target, label: t('modeSingle'), desc: t('modeSingleDesc') },
    { id: 'multiple', icon: Shuffle, label: t('modeMultiple'), desc: t('modeMultipleDesc') },
    { id: 'conditional', icon: Layers, label: t('modeConditional'), desc: t('modeConditionalDesc') },
    { id: 'complement', icon: Dices, label: t('modeComplement'), desc: t('modeComplementDesc') },
  ];

  const result = useMemo(() => {
    switch (mode) {
      case 'single': {
        const fav = parseFloat(favorable);
        const tot = parseFloat(total);
        if (isNaN(fav) || isNaN(tot) || tot <= 0 || fav < 0 || fav > tot) {
          return null;
        }
        const probability = fav / tot;
        const odds = fav / (tot - fav);
        return {
          probability,
          percentage: probability * 100,
          fraction: `${fav}/${tot}`,
          odds: tot - fav > 0 ? odds : Infinity,
          oddsAgainst: fav > 0 ? (tot - fav) / fav : Infinity,
        };
      }

      case 'multiple': {
        const pA = parseFloat(probA);
        const pB = parseFloat(probB);
        if (isNaN(pA) || isNaN(pB) || pA < 0 || pA > 1 || pB < 0 || pB > 1) {
          return null;
        }

        if (eventType === 'and') {
          // P(A ∩ B)
          if (independent) {
            const pAandB = pA * pB;
            return {
              probability: pAandB,
              percentage: pAandB * 100,
              formula: `P(A) × P(B) = ${pA} × ${pB}`,
              type: 'intersection',
            };
          } else {
            const pAB = parseFloat(probAandB);
            if (isNaN(pAB) || pAB < 0 || pAB > Math.min(pA, pB)) {
              return null;
            }
            return {
              probability: pAB,
              percentage: pAB * 100,
              formula: `P(A ∩ B) = ${pAB}`,
              type: 'intersection',
            };
          }
        } else {
          // P(A ∪ B)
          let pAandB: number;
          if (independent) {
            pAandB = pA * pB;
          } else {
            pAandB = parseFloat(probAandB) || 0;
          }
          const pAorB = pA + pB - pAandB;
          return {
            probability: Math.min(1, pAorB),
            percentage: Math.min(100, pAorB * 100),
            formula: `P(A) + P(B) - P(A∩B) = ${pA} + ${pB} - ${pAandB.toFixed(4)}`,
            type: 'union',
            pAandB,
          };
        }
      }

      case 'conditional': {
        const pA = parseFloat(probA);
        const pBgA = parseFloat(probBgivenA);
        if (isNaN(pA) || isNaN(pBgA) || pA < 0 || pA > 1 || pBgA < 0 || pBgA > 1) {
          return null;
        }
        // P(A ∩ B) = P(B|A) × P(A)
        const pAandB = pBgA * pA;
        return {
          probability: pAandB,
          percentage: pAandB * 100,
          formula: `P(B|A) × P(A) = ${pBgA} × ${pA}`,
          pA,
          pBgivenA: pBgA,
        };
      }

      case 'complement': {
        const pA = parseFloat(probA);
        if (isNaN(pA) || pA < 0 || pA > 1) {
          return null;
        }
        const pNotA = 1 - pA;
        return {
          probability: pNotA,
          percentage: pNotA * 100,
          original: pA,
          formula: `1 - P(A) = 1 - ${pA}`,
        };
      }

      default:
        return null;
    }
  }, [mode, favorable, total, probA, probB, eventType, independent, probAandB, probBgivenA]);

  const formatNumber = (num: number): string => {
    if (!isFinite(num)) return '∞';
    if (Number.isInteger(num)) return num.toString();
    return num.toFixed(4).replace(/\.?0+$/, '');
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
          {/* Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('selectMode')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as CalculationMode)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    mode === m.id
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <m.icon className={`w-5 h-5 mx-auto mb-1 ${mode === m.id ? 'text-purple-600' : 'text-gray-500'}`} />
                  <div className="text-xs font-medium">{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Single Event Mode */}
          {mode === 'single' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-center mb-4">
                <div className="text-sm text-purple-600">{t('formula')}</div>
                <div className="text-lg font-mono text-purple-800">P(E) = {t('favorableOutcomes')} / {t('totalOutcomes')}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('favorableOutcomes')}
                  </label>
                  <input
                    type="number"
                    value={favorable}
                    onChange={(e) => setFavorable(e.target.value)}
                    min="0"
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                    placeholder="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('totalOutcomes')}
                  </label>
                  <input
                    type="number"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    min="1"
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                    placeholder="10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Multiple Events Mode */}
          {mode === 'multiple' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    P(A)
                  </label>
                  <input
                    type="number"
                    value={probA}
                    onChange={(e) => setProbA(e.target.value)}
                    min="0"
                    max="1"
                    step="0.01"
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                    placeholder="0.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    P(B)
                  </label>
                  <input
                    type="number"
                    value={probB}
                    onChange={(e) => setProbB(e.target.value)}
                    min="0"
                    max="1"
                    step="0.01"
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                    placeholder="0.3"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setEventType('and')}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                    eventType === 'and'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  P(A ∩ B) - {t('and')}
                </button>
                <button
                  onClick={() => setEventType('or')}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                    eventType === 'or'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  P(A ∪ B) - {t('or')}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="independent"
                  checked={independent}
                  onChange={(e) => setIndependent(e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded"
                />
                <label htmlFor="independent" className="text-sm text-gray-700">
                  {t('independentEvents')}
                </label>
              </div>

              {!independent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    P(A ∩ B) - {t('intersection')}
                  </label>
                  <input
                    type="number"
                    value={probAandB}
                    onChange={(e) => setProbAandB(e.target.value)}
                    min="0"
                    max="1"
                    step="0.01"
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                    placeholder="0.15"
                  />
                </div>
              )}
            </div>
          )}

          {/* Conditional Mode */}
          {mode === 'conditional' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-center mb-4">
                <div className="text-sm text-purple-600">{t('conditionalFormula')}</div>
                <div className="text-lg font-mono text-purple-800">P(A ∩ B) = P(B|A) × P(A)</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    P(A)
                  </label>
                  <input
                    type="number"
                    value={probA}
                    onChange={(e) => setProbA(e.target.value)}
                    min="0"
                    max="1"
                    step="0.01"
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                    placeholder="0.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    P(B|A) - {t('bGivenA')}
                  </label>
                  <input
                    type="number"
                    value={probBgivenA}
                    onChange={(e) => setProbBgivenA(e.target.value)}
                    min="0"
                    max="1"
                    step="0.01"
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                    placeholder="0.6"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Complement Mode */}
          {mode === 'complement' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-center mb-4">
                <div className="text-sm text-purple-600">{t('complementFormula')}</div>
                <div className="text-lg font-mono text-purple-800">P(A') = 1 - P(A)</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  P(A) - {t('eventProbability')}
                </label>
                <input
                  type="number"
                  value={probA}
                  onChange={(e) => setProbA(e.target.value)}
                  min="0"
                  max="1"
                  step="0.01"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                  placeholder="0.3"
                />
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="mt-6 space-y-4">
              <div className="p-5 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Dices className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">{t('result')}</span>
                </div>
                <div className="text-4xl font-bold text-green-700 mb-1">
                  {formatNumber(result.probability)}
                </div>
                <div className="text-lg text-green-600">
                  {formatNumber(result.percentage)}%
                </div>
              </div>

              {mode === 'single' && 'fraction' in result && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
                    <div className="text-xs text-blue-600 mb-1">{t('asFraction')}</div>
                    <div className="text-lg font-bold text-blue-700 font-mono">{result.fraction}</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-center">
                    <div className="text-xs text-orange-600 mb-1">{t('oddsFor')}</div>
                    <div className="text-lg font-bold text-orange-700 font-mono">
                      {formatNumber(result.odds)}:1
                    </div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-center">
                    <div className="text-xs text-red-600 mb-1">{t('oddsAgainst')}</div>
                    <div className="text-lg font-bold text-red-700 font-mono">
                      {formatNumber(result.oddsAgainst)}:1
                    </div>
                  </div>
                </div>
              )}

              {'formula' in result && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                  <div className="text-sm text-gray-600 mb-1">{t('calculation')}</div>
                  <div className="font-mono text-gray-800">{result.formula}</div>
                </div>
              )}
            </div>
          )}

          {!result && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-center">
              <p className="text-sm text-yellow-800">{t('invalidInput')}</p>
            </div>
          )}
        </div>

        {/* SEO Content Sections */}
        <div className="space-y-4">
          {/* What Is */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('whatIs')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('whatIs')}</h2>
              {expandedSections.whatIs ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {expandedSections.whatIs && (
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">{t('whatIsContent')}</p>
              </div>
            )}
          </div>

          {/* Formulas */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('formulas')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('formulasTitle')}</h2>
              {expandedSections.formulas ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {expandedSections.formulas && (
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">{t('formulasContent')}</p>
              </div>
            )}
          </div>

          {/* Examples */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('examples')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('examplesTitle')}</h2>
              {expandedSections.examples ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {expandedSections.examples && (
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">{t('examplesContent')}</p>
              </div>
            )}
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('faq')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('faq')}</h2>
              {expandedSections.faq ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {expandedSections.faq && (
              <div className="px-6 pb-6 space-y-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i}>
                    <h3 className="font-medium text-gray-900 mb-1">{t(`faqQ${i}`)}</h3>
                    <p className="text-gray-600 text-sm">{t(`faqA${i}`)}</p>
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
