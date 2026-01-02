'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ArrowRight,
  Clock
} from 'lucide-react';

interface DateDifferenceResult {
  totalDays: number;
  weekdays: number;
  weekends: number;
  weeks: number;
  months: number;
  years: number;
  hours: number;
  minutes: number;
  seconds: number;
  breakdown: {
    years: number;
    months: number;
    days: number;
  };
}

export default function DateDifferenceClientPage() {
  const t = useTranslations('DateDifferenceCalculator');

  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    today.setMonth(today.getMonth() - 1);
    return today.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [includeEndDate, setIncludeEndDate] = useState<boolean>(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howTo: false,
    examples: false,
    faq: false
  });

  const result = useMemo((): DateDifferenceResult | null => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    // Ensure start is before end
    const [actualStart, actualEnd] = start <= end ? [start, end] : [end, start];

    const timeDifference = actualEnd.getTime() - actualStart.getTime();
    let totalDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (includeEndDate) {
      totalDays += 1;
    }

    // Count weekdays and weekends
    let weekdays = 0;
    let weekends = 0;
    const currentDate = new Date(actualStart);
    const loopEnd = new Date(actualEnd);
    if (includeEndDate) {
      loopEnd.setDate(loopEnd.getDate() + 1);
    }

    while (currentDate < loopEnd) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekends++;
      } else {
        weekdays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate years, months, days breakdown
    let years = actualEnd.getFullYear() - actualStart.getFullYear();
    let months = actualEnd.getMonth() - actualStart.getMonth();
    let days = actualEnd.getDate() - actualStart.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(actualEnd.getFullYear(), actualEnd.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    return {
      totalDays,
      weekdays,
      weekends,
      weeks: Math.floor(totalDays / 7),
      months: Math.floor(totalDays / 30.437),
      years: Math.floor(totalDays / 365.25),
      hours: totalDays * 24,
      minutes: totalDays * 24 * 60,
      seconds: totalDays * 24 * 60 * 60,
      breakdown: {
        years,
        months,
        days: includeEndDate ? days + 1 : days
      }
    };
  }, [startDate, endDate, includeEndDate]);

  const handleReset = () => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    setStartDate(lastMonth.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
    setIncludeEndDate(true);
  };

  const setQuickRange = (daysAgo: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - daysAgo);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-blue-100 rounded-2xl mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Quick Range Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('quickRanges')}
            </label>
            <div className="flex flex-wrap gap-2">
              {[7, 14, 30, 60, 90, 180, 365].map(days => (
                <button
                  key={days}
                  onClick={() => setQuickRange(days)}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  {days} {t('days')}
                </button>
              ))}
            </div>
          </div>

          {/* Date Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('startDate')}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('endDate')}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Include End Date Toggle */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeEndDate}
                onChange={(e) => setIncludeEndDate(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{t('includeEndDate')}</span>
            </label>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {t('reset')}
          </button>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Main Result */}
              <div className="p-5 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-medium text-blue-700">{t('totalDays')}</h3>
                </div>
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  {formatNumber(result.totalDays)} {t('days')}
                </p>
                {result.breakdown.years > 0 || result.breakdown.months > 0 ? (
                  <p className="text-sm text-blue-600">
                    {result.breakdown.years > 0 && `${result.breakdown.years} ${result.breakdown.years === 1 ? t('year') : t('years')}, `}
                    {result.breakdown.months > 0 && `${result.breakdown.months} ${result.breakdown.months === 1 ? t('month') : t('months')}, `}
                    {result.breakdown.days} {result.breakdown.days === 1 ? t('day') : t('days')}
                  </p>
                ) : null}
              </div>

              {/* Date Range Display */}
              <div className="flex items-center justify-center gap-4 p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-700 font-medium">{new Date(startDate).toLocaleDateString()}</span>
                <ArrowRight className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700 font-medium">{new Date(endDate).toLocaleDateString()}</span>
              </div>

              {/* Detailed Results Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {/* Weeks */}
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <span className="text-xs text-green-600 block mb-1">{t('weeks')}</span>
                  <span className="text-2xl font-bold text-green-700">{formatNumber(result.weeks)}</span>
                </div>

                {/* Weekdays */}
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <span className="text-xs text-purple-600 block mb-1">{t('weekdays')}</span>
                  <span className="text-2xl font-bold text-purple-700">{formatNumber(result.weekdays)}</span>
                </div>

                {/* Weekends */}
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <span className="text-xs text-orange-600 block mb-1">{t('weekends')}</span>
                  <span className="text-2xl font-bold text-orange-700">{formatNumber(result.weekends)}</span>
                </div>

                {/* Hours */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-xs text-gray-500 block mb-1">{t('hours')}</span>
                  <span className="text-xl font-bold text-gray-700">{formatNumber(result.hours)}</span>
                </div>

                {/* Minutes */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-xs text-gray-500 block mb-1">{t('minutes')}</span>
                  <span className="text-xl font-bold text-gray-700">{formatNumber(result.minutes)}</span>
                </div>

                {/* Seconds */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-xs text-gray-500 block mb-1">{t('seconds')}</span>
                  <span className="text-xl font-bold text-gray-700">{formatNumber(result.seconds)}</span>
                </div>
              </div>

              {/* Approximate Conversions */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="text-sm font-medium text-gray-700 mb-3">{t('approximateConversions')}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('inMonths')}:</span>
                    <span className="font-medium text-gray-700">{result.months}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('inYears')}:</span>
                    <span className="font-medium text-gray-700">{result.years}</span>
                  </div>
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

          {/* Examples Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('examples')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('examples.title')}</h2>
              {expandedSections.examples ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.examples && (
              <div className="px-6 pb-6">
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('examples.content') }}
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
