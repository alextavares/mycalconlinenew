'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { DollarSign, TrendingUp, Calendar, Percent, ChevronDown, ChevronUp } from 'lucide-react';

type CompoundingFrequency = 'annually' | 'semiannually' | 'quarterly' | 'monthly' | 'daily';

export default function CompoundInterestClientPage() {
  const t = useTranslations('CompoundInterestCalculator');

  const [principal, setPrincipal] = useState<string>('1000');
  const [rate, setRate] = useState<string>('5');
  const [time, setTime] = useState<string>('10');
  const [frequency, setFrequency] = useState<CompoundingFrequency>('monthly');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('100');

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howTo: false,
    examples: false,
    faq: false
  });

  const frequencies = [
    { id: 'annually', label: t('annually'), value: 1 },
    { id: 'semiannually', label: t('semiannually'), value: 2 },
    { id: 'quarterly', label: t('quarterly'), value: 4 },
    { id: 'monthly', label: t('monthly'), value: 12 },
    { id: 'daily', label: t('daily'), value: 365 },
  ];

  const result = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t_years = parseFloat(time);
    const contribution = parseFloat(monthlyContribution) || 0;

    if (isNaN(p) || isNaN(r) || isNaN(t_years) || p < 0 || r < 0 || t_years < 0) {
      return null;
    }

    const selectedFreq = frequencies.find(f => f.id === frequency);
    if (!selectedFreq) return null;

    const n = selectedFreq.value;

    // Compound interest formula: A = P(1 + r/n)^(nt)
    const compoundAmount = p * Math.pow(1 + r / n, n * t_years);

    // Future value of monthly contributions (annuity)
    // FV = PMT × [((1 + r/n)^(nt) - 1) / (r/n)]
    const monthlyRate = r / 12;
    const monthlyPeriods = t_years * 12;
    const contributionAmount = contribution > 0
      ? contribution * ((Math.pow(1 + monthlyRate, monthlyPeriods) - 1) / monthlyRate)
      : 0;

    const totalAmount = compoundAmount + contributionAmount;
    const totalContributions = contribution * monthlyPeriods;
    const totalPrincipal = p + totalContributions;
    const totalInterest = totalAmount - totalPrincipal;

    return {
      finalAmount: totalAmount,
      totalPrincipal: totalPrincipal,
      totalInterest: totalInterest,
      principalAmount: p,
      contributionAmount: totalContributions,
      interestPercentage: (totalInterest / totalPrincipal) * 100
    };
  }, [principal, rate, time, frequency, monthlyContribution, frequencies]);

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
          <div className="space-y-4">
            {/* Principal Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                {t('principalAmount')}
              </label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-colors"
                placeholder={t('principalPlaceholder')}
                min="0"
                step="100"
              />
            </div>

            {/* Annual Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Percent className="w-4 h-4 inline mr-1" />
                {t('annualRate')}
              </label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-colors"
                placeholder={t('ratePlaceholder')}
                min="0"
                max="100"
                step="0.1"
              />
            </div>

            {/* Time Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                {t('timePeriod')}
              </label>
              <input
                type="number"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-colors"
                placeholder={t('timePlaceholder')}
                min="0"
                step="1"
              />
            </div>

            {/* Compounding Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                {t('compoundingFrequency')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {frequencies.map(freq => (
                  <button
                    key={freq.id}
                    onClick={() => setFrequency(freq.id as CompoundingFrequency)}
                    className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
                      frequency === freq.id
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Monthly Contribution */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                {t('monthlyContribution')}
              </label>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-colors"
                placeholder={t('contributionPlaceholder')}
                min="0"
                step="10"
              />
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="mt-6 space-y-4">
              {/* Final Amount */}
              <div className="p-5 bg-emerald-50 rounded-xl border-2 border-emerald-200">
                <div className="text-sm text-emerald-600 font-medium mb-1">{t('finalAmount')}</div>
                <div className="text-3xl font-bold text-emerald-900">
                  ${result.finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Total Principal */}
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-xs text-blue-600 font-medium mb-1">{t('totalPrincipal')}</div>
                  <div className="text-lg font-bold text-blue-900">
                    ${result.totalPrincipal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                {/* Total Interest */}
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="text-xs text-orange-600 font-medium mb-1">{t('totalInterest')}</div>
                  <div className="text-lg font-bold text-orange-900">
                    ${result.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                {/* Interest Rate of Return */}
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="text-xs text-purple-600 font-medium mb-1">{t('interestReturn')}</div>
                  <div className="text-lg font-bold text-purple-900">
                    {result.interestPercentage.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Visual Breakdown */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-sm font-medium text-gray-700 mb-3">{t('breakdown')}</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('initialPrincipal')}:</span>
                    <span className="font-medium text-gray-900">
                      ${result.principalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('totalContributions')}:</span>
                    <span className="font-medium text-gray-900">
                      ${result.contributionAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('interestEarned')}:</span>
                    <span className="font-medium text-emerald-600">
                      ${result.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between">
                    <span className="text-gray-900 font-semibold">{t('totalValue')}:</span>
                    <span className="font-bold text-emerald-600">
                      ${result.finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Visual Bar */}
                <div className="mt-4 h-8 flex rounded-lg overflow-hidden">
                  <div
                    className="bg-blue-500 flex items-center justify-center text-xs text-white font-medium"
                    style={{ width: `${(result.principalAmount / result.finalAmount) * 100}%` }}
                  >
                    {((result.principalAmount / result.finalAmount) * 100).toFixed(0)}%
                  </div>
                  {result.contributionAmount > 0 && (
                    <div
                      className="bg-blue-400 flex items-center justify-center text-xs text-white font-medium"
                      style={{ width: `${(result.contributionAmount / result.finalAmount) * 100}%` }}
                    >
                      {((result.contributionAmount / result.finalAmount) * 100).toFixed(0)}%
                    </div>
                  )}
                  <div
                    className="bg-emerald-500 flex items-center justify-center text-xs text-white font-medium"
                    style={{ width: `${(result.totalInterest / result.finalAmount) * 100}%` }}
                  >
                    {((result.totalInterest / result.finalAmount) * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>{t('principal')}</span>
                  <span>{t('interest')}</span>
                </div>
              </div>
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
              {expandedSections.whatIs ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.whatIs && (
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">
                  {t('whatIsContent')}
                </p>
              </div>
            )}
          </div>

          {/* How To Use */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('howTo')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('howToCalculate')}</h2>
              {expandedSections.howTo ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.howTo && (
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">
                  {t('howToCalculateContent')}
                </p>
              </div>
            )}
          </div>

          {/* Examples */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('examples')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('benefits')}</h2>
              {expandedSections.examples ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.examples && (
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">
                  {t('benefitsContent')}
                </p>
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
              {expandedSections.faq ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
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
