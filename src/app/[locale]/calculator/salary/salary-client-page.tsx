'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  DollarSign,
  Clock,
  Calendar,
  CalendarDays,
  Briefcase,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';

type SalaryPeriod = 'hourly' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';

export default function SalaryClientPage() {
  const t = useTranslations('SalaryCalculator');

  const [amount, setAmount] = useState<string>('');
  const [period, setPeriod] = useState<SalaryPeriod>('yearly');
  const [hoursPerWeek, setHoursPerWeek] = useState<string>('40');
  const [daysPerWeek, setDaysPerWeek] = useState<string>('5');
  const [weeksPerYear, setWeeksPerYear] = useState<string>('52');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howToCalculate: false,
    salaryTypes: false,
    tips: false,
    faq: false
  });

  const periods: { id: SalaryPeriod; icon: React.ElementType; label: string }[] = [
    { id: 'hourly', icon: Clock, label: t('hourly') },
    { id: 'daily', icon: Calendar, label: t('daily') },
    { id: 'weekly', icon: CalendarDays, label: t('weekly') },
    { id: 'biweekly', icon: Briefcase, label: t('biweekly') },
    { id: 'monthly', icon: TrendingUp, label: t('monthly') },
    { id: 'yearly', icon: DollarSign, label: t('yearly') },
  ];

  const conversions = useMemo(() => {
    const amountNum = parseFloat(amount);
    const hoursNum = parseFloat(hoursPerWeek) || 40;
    const daysNum = parseFloat(daysPerWeek) || 5;
    const weeksNum = parseFloat(weeksPerYear) || 52;

    if (!amountNum || amountNum <= 0) return null;

    // Calculate hours per day
    const hoursPerDay = hoursNum / daysNum;

    // Calculate yearly salary first, then derive others
    let yearly: number;

    switch (period) {
      case 'hourly':
        yearly = amountNum * hoursNum * weeksNum;
        break;
      case 'daily':
        yearly = amountNum * daysNum * weeksNum;
        break;
      case 'weekly':
        yearly = amountNum * weeksNum;
        break;
      case 'biweekly':
        yearly = amountNum * (weeksNum / 2);
        break;
      case 'monthly':
        yearly = amountNum * 12;
        break;
      case 'yearly':
      default:
        yearly = amountNum;
        break;
    }

    // Calculate all periods from yearly
    const hourly = yearly / (hoursNum * weeksNum);
    const daily = yearly / (daysNum * weeksNum);
    const weekly = yearly / weeksNum;
    const biweekly = yearly / (weeksNum / 2);
    const monthly = yearly / 12;

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      monthly,
      yearly,
      hoursPerDay
    };
  }, [amount, period, hoursPerWeek, daysPerWeek, weeksPerYear]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleClear = () => {
    setAmount('');
    setPeriod('yearly');
    setHoursPerWeek('40');
    setDaysPerWeek('5');
    setWeeksPerYear('52');
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
          {/* Period Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('enterSalaryAs')}
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {periods.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setPeriod(id)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                    period === id
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('salaryAmount')}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-4 text-2xl font-semibold border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-colors"
                min="0"
                step="0.01"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                {t(`per${period.charAt(0).toUpperCase() + period.slice(1)}`)}
              </span>
            </div>
          </div>

          {/* Work Schedule Settings */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="text-sm font-medium text-gray-700 mb-3">{t('workSchedule')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t('hoursPerWeek')}</label>
                <input
                  type="number"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-0 text-center"
                  min="1"
                  max="168"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t('daysPerWeek')}</label>
                <input
                  type="number"
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-0 text-center"
                  min="1"
                  max="7"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t('weeksPerYear')}</label>
                <input
                  type="number"
                  value={weeksPerYear}
                  onChange={(e) => setWeeksPerYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-0 text-center"
                  min="1"
                  max="52"
                />
              </div>
            </div>
          </div>

          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {t('clear')}
          </button>

          {/* Results */}
          {conversions && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('salaryConversions')}</h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Hourly */}
                <div className={`p-4 rounded-xl ${period === 'hourly' ? 'bg-emerald-100 border-2 border-emerald-500' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{t('hourly')}</span>
                  </div>
                  <p className={`text-xl font-bold ${period === 'hourly' ? 'text-emerald-700' : 'text-gray-900'}`}>
                    {formatCurrency(conversions.hourly)}
                  </p>
                </div>

                {/* Daily */}
                <div className={`p-4 rounded-xl ${period === 'daily' ? 'bg-emerald-100 border-2 border-emerald-500' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{t('daily')}</span>
                  </div>
                  <p className={`text-xl font-bold ${period === 'daily' ? 'text-emerald-700' : 'text-gray-900'}`}>
                    {formatCurrency(conversions.daily)}
                  </p>
                </div>

                {/* Weekly */}
                <div className={`p-4 rounded-xl ${period === 'weekly' ? 'bg-emerald-100 border-2 border-emerald-500' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{t('weekly')}</span>
                  </div>
                  <p className={`text-xl font-bold ${period === 'weekly' ? 'text-emerald-700' : 'text-gray-900'}`}>
                    {formatCurrency(conversions.weekly)}
                  </p>
                </div>

                {/* Biweekly */}
                <div className={`p-4 rounded-xl ${period === 'biweekly' ? 'bg-emerald-100 border-2 border-emerald-500' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{t('biweekly')}</span>
                  </div>
                  <p className={`text-xl font-bold ${period === 'biweekly' ? 'text-emerald-700' : 'text-gray-900'}`}>
                    {formatCurrency(conversions.biweekly)}
                  </p>
                </div>

                {/* Monthly */}
                <div className={`p-4 rounded-xl ${period === 'monthly' ? 'bg-emerald-100 border-2 border-emerald-500' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{t('monthly')}</span>
                  </div>
                  <p className={`text-xl font-bold ${period === 'monthly' ? 'text-emerald-700' : 'text-gray-900'}`}>
                    {formatCurrency(conversions.monthly)}
                  </p>
                </div>

                {/* Yearly */}
                <div className={`p-4 rounded-xl ${period === 'yearly' ? 'bg-emerald-100 border-2 border-emerald-500' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{t('yearly')}</span>
                  </div>
                  <p className={`text-xl font-bold ${period === 'yearly' ? 'text-emerald-700' : 'text-gray-900'}`}>
                    {formatCurrency(conversions.yearly)}
                  </p>
                </div>
              </div>

              {/* Summary Card */}
              <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <h4 className="font-semibold text-emerald-800 mb-2">{t('summary')}</h4>
                <p className="text-emerald-700 text-sm">
                  {t('summaryText', {
                    hourly: formatCurrency(conversions.hourly),
                    yearly: formatCurrency(conversions.yearly),
                    hoursPerWeek: hoursPerWeek,
                    weeksPerYear: weeksPerYear
                  })}
                </p>
                <div className="mt-3 pt-3 border-t border-emerald-200">
                  <p className="text-xs text-emerald-600">
                    {t('hoursPerDay')}: {conversions.hoursPerDay.toFixed(1)} {t('hours')} |
                    {t('totalHoursYear')}: {(parseFloat(hoursPerWeek) * parseFloat(weeksPerYear)).toLocaleString()} {t('hours')}
                  </p>
                </div>
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

          {/* Salary Types Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('salaryTypes')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('salaryTypes.title')}</h2>
              {expandedSections.salaryTypes ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.salaryTypes && (
              <div className="px-6 pb-6">
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('salaryTypes.content') }}
                />
              </div>
            )}
          </div>

          {/* Tips Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('tips')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('tips.title')}</h2>
              {expandedSections.tips ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.tips && (
              <div className="px-6 pb-6">
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('tips.content') }}
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
