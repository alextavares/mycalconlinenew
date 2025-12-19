'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { DollarSign, Users, Percent, ChevronDown, ChevronUp, Calculator, Receipt } from 'lucide-react';

const PRESET_TIPS = [10, 15, 18, 20, 25];

export default function TipClientPage() {
  const t = useTranslations('TipCalculator');

  // Input states
  const [billAmount, setBillAmount] = useState<string>('');
  const [customTip, setCustomTip] = useState<string>('');
  const [selectedTip, setSelectedTip] = useState<number>(15);
  const [numberOfPeople, setNumberOfPeople] = useState<string>('1');

  // SEO sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howToCalculate: false,
    tippingGuide: false,
    whenToTip: false,
    faq: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Calculate results
  const { tipAmount, totalAmount, perPersonAmount, tipPerPerson } = useMemo(() => {
    const bill = parseFloat(billAmount);
    const people = parseInt(numberOfPeople) || 1;

    // Use custom tip if entered, otherwise use selected preset
    const tipPercent = customTip ? parseFloat(customTip) : selectedTip;

    if (!bill || bill <= 0 || !tipPercent || tipPercent < 0) {
      return { tipAmount: 0, totalAmount: 0, perPersonAmount: 0, tipPerPerson: 0 };
    }

    const tip = (bill * tipPercent) / 100;
    const total = bill + tip;
    const perPerson = total / people;
    const tipPer = tip / people;

    return {
      tipAmount: tip,
      totalAmount: total,
      perPersonAmount: perPerson,
      tipPerPerson: tipPer,
    };
  }, [billAmount, customTip, selectedTip, numberOfPeople]);

  const handlePresetClick = (percent: number) => {
    setSelectedTip(percent);
    setCustomTip(''); // Clear custom when preset is clicked
  };

  const handleCustomChange = (value: string) => {
    setCustomTip(value);
    if (value) {
      setSelectedTip(0); // Deselect preset when custom is entered
    }
  };

  const clearAll = () => {
    setBillAmount('');
    setCustomTip('');
    setSelectedTip(15);
    setNumberOfPeople('1');
  };

  const formatCurrency = (value: number) => {
    return value.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Receipt className="w-8 h-8 text-primary" />
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
          {/* Bill Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              {t('billAmount')}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-medium">$</span>
              <input
                type="number"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition-colors text-lg"
              />
            </div>
          </div>

          {/* Tip Percentage - Preset Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Percent className="w-4 h-4 inline mr-1" />
              {t('tipPercentage')}
            </label>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {PRESET_TIPS.map((percent) => (
                <button
                  key={percent}
                  onClick={() => handlePresetClick(percent)}
                  className={`py-3 px-2 rounded-lg border-2 transition-all font-semibold ${
                    selectedTip === percent && !customTip
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {percent}%
                </button>
              ))}
            </div>

            {/* Custom Tip */}
            <div className="relative">
              <input
                type="number"
                value={customTip}
                onChange={(e) => handleCustomChange(e.target.value)}
                placeholder={t('customTipPlaceholder')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">%</span>
            </div>
          </div>

          {/* Number of People */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              {t('numberOfPeople')}
            </label>
            <input
              type="number"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(e.target.value)}
              min="1"
              placeholder="1"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition-colors text-lg"
            />
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
          {billAmount && parseFloat(billAmount) > 0 && (
            <div className="space-y-4">
              {/* Tip Amount */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 mb-1">{t('tipAmount')}</p>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    ${formatCurrency(tipAmount)}
                  </div>
                  <p className="text-sm text-gray-500">
                    {customTip || selectedTip}% {t('tip')}
                  </p>
                </div>
              </div>

              {/* Total Amount */}
              <div className="bg-gradient-to-r from-blue-50 to-primary/10 rounded-xl p-6 border-2 border-primary/30">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 mb-1">{t('totalAmount')}</p>
                  <div className="text-4xl font-bold text-primary mb-2">
                    ${formatCurrency(totalAmount)}
                  </div>
                  <p className="text-sm text-gray-500">
                    ${formatCurrency(parseFloat(billAmount))} + ${formatCurrency(tipAmount)}
                  </p>
                </div>
              </div>

              {/* Per Person (if more than 1) */}
              {parseInt(numberOfPeople) > 1 && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{t('perPerson')}</p>
                      <div className="text-2xl font-bold text-purple-600">
                        ${formatCurrency(perPersonAmount)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{t('totalPerPerson')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{t('tipPerPerson')}</p>
                      <div className="text-2xl font-bold text-pink-600">
                        ${formatCurrency(tipPerPerson)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{t('tipOnly')}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-700">{t('breakdown')}</span>
                </div>
                <div className="space-y-1 text-gray-600">
                  <div className="flex justify-between">
                    <span>{t('originalBill')}:</span>
                    <span className="font-medium">${formatCurrency(parseFloat(billAmount))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('tipAmount')} ({customTip || selectedTip}%):</span>
                    <span className="font-medium">${formatCurrency(tipAmount)}</span>
                  </div>
                  <div className="h-px bg-gray-300 my-2"></div>
                  <div className="flex justify-between font-semibold text-gray-900">
                    <span>{t('total')}:</span>
                    <span>${formatCurrency(totalAmount)}</span>
                  </div>
                  {parseInt(numberOfPeople) > 1 && (
                    <>
                      <div className="h-px bg-gray-300 my-2"></div>
                      <div className="flex justify-between text-purple-700">
                        <span>{t('splitBetween')} {numberOfPeople} {t('people')}:</span>
                        <span className="font-semibold">${formatCurrency(perPersonAmount)} {t('each')}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content Sections */}
        <div className="space-y-4">
          {/* What is a Tip */}
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

          {/* Tipping Guide */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => toggleSection('tippingGuide')}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <h2 className="text-xl font-semibold text-gray-900">{t('tippingGuide.title')}</h2>
              {expandedSections.tippingGuide ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.tippingGuide && (
              <div className="px-6 pb-6">
                <div
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('tippingGuide.content') }}
                />
              </div>
            )}
          </div>

          {/* When to Tip */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => toggleSection('whenToTip')}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <h2 className="text-xl font-semibold text-gray-900">{t('whenToTip.title')}</h2>
              {expandedSections.whenToTip ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.whenToTip && (
              <div className="px-6 pb-6">
                <div
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('whenToTip.content') }}
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
