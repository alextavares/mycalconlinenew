'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { DollarSign, Percent, Calendar, ChevronDown, ChevronUp, TrendingUp, PiggyBank, CreditCard, Table } from 'lucide-react';

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function LoanClientPage() {
  const t = useTranslations('LoanCalculator');

  // Input states
  const [principal, setPrincipal] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [termYears, setTermYears] = useState<string>('');
  const [termMonths, setTermMonths] = useState<string>('');
  const [showAmortization, setShowAmortization] = useState(false);

  // SEO sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howToCalculate: false,
    loanTypes: false,
    tips: false,
    faq: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Calculate loan details
  const { monthlyPayment, totalPayment, totalInterest, amortization } = useMemo(() => {
    const P = parseFloat(principal);
    const annualRate = parseFloat(interestRate);
    const years = parseFloat(termYears) || 0;
    const months = parseFloat(termMonths) || 0;
    const totalMonths = years * 12 + months;

    if (!P || !annualRate || totalMonths <= 0 || P <= 0 || annualRate < 0) {
      return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0, amortization: [] };
    }

    const monthlyRate = annualRate / 100 / 12;

    // Monthly payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    let M: number;
    if (monthlyRate === 0) {
      M = P / totalMonths;
    } else {
      M = P * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    const total = M * totalMonths;
    const interest = total - P;

    // Generate amortization schedule
    const schedule: AmortizationRow[] = [];
    let balance = P;

    for (let month = 1; month <= totalMonths; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = M - interestPayment;
      balance = Math.max(0, balance - principalPayment);

      schedule.push({
        month,
        payment: M,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance,
      });
    }

    return {
      monthlyPayment: M,
      totalPayment: total,
      totalInterest: interest,
      amortization: schedule,
    };
  }, [principal, interestRate, termYears, termMonths]);

  const totalMonths = (parseFloat(termYears) || 0) * 12 + (parseFloat(termMonths) || 0);

  const clearAll = () => {
    setPrincipal('');
    setInterestRate('');
    setTermYears('');
    setTermMonths('');
    setShowAmortization(false);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Calculate percentages for visual
  const principalPercent = totalPayment > 0 ? (parseFloat(principal) / totalPayment) * 100 : 0;
  const interestPercent = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <CreditCard className="w-8 h-8 text-emerald-600" />
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
          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Loan Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                {t('loanAmount')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-medium">$</span>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="100,000"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition-colors text-lg"
                />
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Percent className="w-4 h-4 inline mr-1" />
                {t('interestRate')}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="5.5"
                  step="0.1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition-colors text-lg"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">% {t('perYear')}</span>
              </div>
            </div>

            {/* Loan Term */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                {t('loanTerm')}
              </label>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={termYears}
                    onChange={(e) => setTermYears(e.target.value)}
                    placeholder="30"
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition-colors text-lg"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">{t('years')}</span>
                </div>
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={termMonths}
                    onChange={(e) => setTermMonths(e.target.value)}
                    placeholder="0"
                    min="0"
                    max="11"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition-colors text-lg"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">{t('months')}</span>
                </div>
              </div>
            </div>
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
          {monthlyPayment > 0 && (
            <div className="space-y-4">
              {/* Monthly Payment - Main Result */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border-2 border-emerald-200">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 mb-1">{t('monthlyPayment')}</p>
                  <div className="text-5xl font-bold text-emerald-600 mb-2">
                    ${formatCurrency(monthlyPayment)}
                  </div>
                  <p className="text-sm text-gray-500">
                    {t('for')} {totalMonths} {t('monthsTotal')}
                  </p>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Principal */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <PiggyBank className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-700">{t('totalPrincipal')}</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">${formatCurrency(parseFloat(principal))}</div>
                  <p className="text-xs text-blue-600 mt-1">{principalPercent.toFixed(1)}% {t('ofTotal')}</p>
                </div>

                {/* Total Interest */}
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-orange-700">{t('totalInterest')}</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">${formatCurrency(totalInterest)}</div>
                  <p className="text-xs text-orange-600 mt-1">{interestPercent.toFixed(1)}% {t('ofTotal')}</p>
                </div>

                {/* Total Cost */}
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-700">{t('totalCost')}</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">${formatCurrency(totalPayment)}</div>
                  <p className="text-xs text-purple-600 mt-1">{t('principalPlusInterest')}</p>
                </div>
              </div>

              {/* Visual Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">{t('paymentBreakdown')}</p>
                <div className="h-6 rounded-full overflow-hidden flex">
                  <div
                    className="bg-blue-500 h-full transition-all"
                    style={{ width: `${principalPercent}%` }}
                  />
                  <div
                    className="bg-orange-500 h-full transition-all"
                    style={{ width: `${interestPercent}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    {t('principal')} ({principalPercent.toFixed(1)}%)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                    {t('interest')} ({interestPercent.toFixed(1)}%)
                  </span>
                </div>
              </div>

              {/* Amortization Table Toggle */}
              <button
                onClick={() => setShowAmortization(!showAmortization)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Table className="w-5 h-5" />
                <span className="font-medium">
                  {showAmortization ? t('hideAmortization') : t('showAmortization')}
                </span>
                {showAmortization ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {/* Amortization Table */}
              {showAmortization && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-3 text-left font-medium text-gray-700">{t('month')}</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">{t('payment')}</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">{t('principal')}</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">{t('interest')}</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">{t('balance')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amortization.slice(0, 60).map((row) => (
                        <tr key={row.month} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-2 text-gray-900">{row.month}</td>
                          <td className="px-4 py-2 text-right text-gray-700">${formatCurrency(row.payment)}</td>
                          <td className="px-4 py-2 text-right text-blue-600">${formatCurrency(row.principal)}</td>
                          <td className="px-4 py-2 text-right text-orange-600">${formatCurrency(row.interest)}</td>
                          <td className="px-4 py-2 text-right text-gray-700">${formatCurrency(row.balance)}</td>
                        </tr>
                      ))}
                      {amortization.length > 60 && (
                        <tr className="bg-gray-50">
                          <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
                            {t('showing60of')} {amortization.length} {t('monthsShown')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SEO Content Sections */}
        <div className="space-y-4">
          {/* What is a Loan */}
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

          {/* Loan Types */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => toggleSection('loanTypes')}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <h2 className="text-xl font-semibold text-gray-900">{t('loanTypes.title')}</h2>
              {expandedSections.loanTypes ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.loanTypes && (
              <div className="px-6 pb-6">
                <div
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('loanTypes.content') }}
                />
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => toggleSection('tips')}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <h2 className="text-xl font-semibold text-gray-900">{t('tips.title')}</h2>
              {expandedSections.tips ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.tips && (
              <div className="px-6 pb-6">
                <div
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('tips.content') }}
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
