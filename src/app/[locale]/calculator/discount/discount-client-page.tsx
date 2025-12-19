'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Tag, Percent, DollarSign, ChevronDown, ChevronUp, Calculator, ShoppingCart, BadgePercent } from 'lucide-react';

type CalculationMode = 'final-price' | 'savings' | 'original-price' | 'discount-percent';

export default function DiscountClientPage() {
  const t = useTranslations('DiscountCalculator');

  // Mode selection
  const [mode, setMode] = useState<CalculationMode>('final-price');

  // Input states
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<string>('');
  const [finalPrice, setFinalPrice] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<string>('');

  // SEO sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howToCalculate: false,
    examples: false,
    faq: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const modes = [
    {
      id: 'final-price' as CalculationMode,
      icon: ShoppingCart,
      label: t('modeFinalPrice'),
      desc: t('modeFinalPriceDesc'),
    },
    {
      id: 'savings' as CalculationMode,
      icon: DollarSign,
      label: t('modeSavings'),
      desc: t('modeSavingsDesc'),
    },
    {
      id: 'original-price' as CalculationMode,
      icon: Tag,
      label: t('modeOriginalPrice'),
      desc: t('modeOriginalPriceDesc'),
    },
    {
      id: 'discount-percent' as CalculationMode,
      icon: BadgePercent,
      label: t('modeDiscountPercent'),
      desc: t('modeDiscountPercentDesc'),
    },
  ];

  // Calculate results based on mode
  const result = useMemo(() => {
    switch (mode) {
      case 'final-price': {
        const original = parseFloat(originalPrice);
        const discount = parseFloat(discountPercent);
        if (!original || !discount || original <= 0 || discount < 0 || discount > 100) {
          return null;
        }
        const savings = (original * discount) / 100;
        const final = original - savings;
        return {
          finalPrice: final,
          savings: savings,
          originalPrice: original,
          discountPercent: discount,
        };
      }
      case 'savings': {
        const original = parseFloat(originalPrice);
        const discount = parseFloat(discountPercent);
        if (!original || !discount || original <= 0 || discount < 0 || discount > 100) {
          return null;
        }
        const savings = (original * discount) / 100;
        const final = original - savings;
        return {
          finalPrice: final,
          savings: savings,
          originalPrice: original,
          discountPercent: discount,
        };
      }
      case 'original-price': {
        const final = parseFloat(finalPrice);
        const discount = parseFloat(discountPercent);
        if (!final || !discount || final <= 0 || discount < 0 || discount >= 100) {
          return null;
        }
        const original = final / (1 - discount / 100);
        const savings = original - final;
        return {
          finalPrice: final,
          savings: savings,
          originalPrice: original,
          discountPercent: discount,
        };
      }
      case 'discount-percent': {
        const original = parseFloat(originalPrice);
        const final = parseFloat(finalPrice);
        if (!original || !final || original <= 0 || final < 0 || final > original) {
          return null;
        }
        const savings = original - final;
        const discount = (savings / original) * 100;
        return {
          finalPrice: final,
          savings: savings,
          originalPrice: original,
          discountPercent: discount,
        };
      }
      default:
        return null;
    }
  }, [mode, originalPrice, discountPercent, finalPrice, discountAmount]);

  const clearAll = () => {
    setOriginalPrice('');
    setDiscountPercent('');
    setFinalPrice('');
    setDiscountAmount('');
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Quick discount buttons
  const quickDiscounts = [10, 15, 20, 25, 30, 50];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Tag className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Calculator Widget */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8">
          {/* Mode Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('calculationType')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {modes.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      mode === m.id
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs font-medium block">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Fields based on mode */}
          <div className="space-y-4 mb-6">
            {/* Original Price - for modes that need it */}
            {(mode === 'final-price' || mode === 'savings' || mode === 'discount-percent') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  {t('originalPrice')}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-medium">$</span>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="100.00"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-0 outline-none transition-colors text-lg"
                  />
                </div>
              </div>
            )}

            {/* Discount Percent - for modes that need it */}
            {(mode === 'final-price' || mode === 'savings' || mode === 'original-price') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Percent className="w-4 h-4 inline mr-1" />
                  {t('discountPercent')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    placeholder="20"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-0 outline-none transition-colors text-lg"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">%</span>
                </div>
                {/* Quick discount buttons */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {quickDiscounts.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDiscountPercent(d.toString())}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        discountPercent === d.toString()
                          ? 'bg-red-500 text-white border-red-500'
                          : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {d}%
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Final Price - for modes that need it */}
            {(mode === 'original-price' || mode === 'discount-percent') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ShoppingCart className="w-4 h-4 inline mr-1" />
                  {t('salePrice')}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-medium">$</span>
                  <input
                    type="number"
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(e.target.value)}
                    placeholder="80.00"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-0 outline-none transition-colors text-lg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Clear Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={clearAll}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {t('clear')}
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Main Result based on mode */}
              {mode === 'final-price' && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border-2 border-red-200">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 mb-1">{t('youPay')}</p>
                    <div className="text-5xl font-bold text-red-600 mb-2">
                      ${formatCurrency(result.finalPrice)}
                    </div>
                    <p className="text-lg text-gray-500 line-through">
                      ${formatCurrency(result.originalPrice)}
                    </p>
                  </div>
                </div>
              )}

              {mode === 'savings' && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 mb-1">{t('youSave')}</p>
                    <div className="text-5xl font-bold text-green-600 mb-2">
                      ${formatCurrency(result.savings)}
                    </div>
                    <p className="text-sm text-gray-500">
                      {result.discountPercent}% {t('off')}
                    </p>
                  </div>
                </div>
              )}

              {mode === 'original-price' && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 mb-1">{t('originalPriceWas')}</p>
                    <div className="text-5xl font-bold text-blue-600 mb-2">
                      ${formatCurrency(result.originalPrice)}
                    </div>
                    <p className="text-sm text-gray-500">
                      {t('beforeDiscount')}
                    </p>
                  </div>
                </div>
              )}

              {mode === 'discount-percent' && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 mb-1">{t('discountIs')}</p>
                    <div className="text-5xl font-bold text-purple-600 mb-2">
                      {result.discountPercent.toFixed(1)}%
                    </div>
                    <p className="text-sm text-gray-500">
                      ${formatCurrency(result.savings)} {t('saved')}
                    </p>
                  </div>
                </div>
              )}

              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">{t('originalPrice')}</p>
                  <p className="font-bold text-gray-700">${formatCurrency(result.originalPrice)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">{t('discount')}</p>
                  <p className="font-bold text-red-600">{result.discountPercent.toFixed(1)}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">{t('savings')}</p>
                  <p className="font-bold text-green-600">${formatCurrency(result.savings)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">{t('finalPrice')}</p>
                  <p className="font-bold text-blue-600">${formatCurrency(result.finalPrice)}</p>
                </div>
              </div>

              {/* Formula */}
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-700">{t('calculation')}</span>
                </div>
                <div className="text-gray-600 font-mono text-xs space-y-1">
                  <p>{t('savings')}: ${formatCurrency(result.originalPrice)} × {result.discountPercent}% = ${formatCurrency(result.savings)}</p>
                  <p>{t('finalPrice')}: ${formatCurrency(result.originalPrice)} - ${formatCurrency(result.savings)} = ${formatCurrency(result.finalPrice)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content Sections */}
        <div className="space-y-4">
          {/* What is a Discount */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => toggleSection('whatIs')}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <h2 className="text-xl font-semibold text-gray-900">{t('whatIs.title')}</h2>
              {expandedSections.whatIs ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.whatIs && (
              <div className="px-6 pb-6">
                <div
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('whatIs.content') }}
                />
              </div>
            )}
          </div>

          {/* How to Calculate */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => toggleSection('howToCalculate')}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <h2 className="text-xl font-semibold text-gray-900">{t('howToCalculate.title')}</h2>
              {expandedSections.howToCalculate ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.howToCalculate && (
              <div className="px-6 pb-6">
                <div
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('howToCalculate.content') }}
                />
              </div>
            )}
          </div>

          {/* Examples */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => toggleSection('examples')}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <h2 className="text-xl font-semibold text-gray-900">{t('examples.title')}</h2>
              {expandedSections.examples ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.examples && (
              <div className="px-6 pb-6">
                <div
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('examples.content') }}
                />
              </div>
            )}
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => toggleSection('faq')}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <h2 className="text-xl font-semibold text-gray-900">{t('faq.title')}</h2>
              {expandedSections.faq ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.faq && (
              <div className="px-6 pb-6 space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <h3 className="font-medium text-gray-900 mb-2">{t(`faq.q${i}`)}</h3>
                    <p className="text-gray-600">{t(`faq.a${i}`)}</p>
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
