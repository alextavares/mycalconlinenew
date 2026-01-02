'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Clock, Globe, ArrowRight, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

type TimezoneInfo = {
  id: string;
  name: string;
  offset: number; // in minutes
  abbr: string;
};

const TIMEZONES: TimezoneInfo[] = [
  { id: 'UTC', name: 'UTC (Coordinated Universal Time)', offset: 0, abbr: 'UTC' },
  { id: 'GMT', name: 'GMT (Greenwich Mean Time)', offset: 0, abbr: 'GMT' },
  // Americas
  { id: 'America/New_York', name: 'New York (Eastern)', offset: -300, abbr: 'EST/EDT' },
  { id: 'America/Chicago', name: 'Chicago (Central)', offset: -360, abbr: 'CST/CDT' },
  { id: 'America/Denver', name: 'Denver (Mountain)', offset: -420, abbr: 'MST/MDT' },
  { id: 'America/Los_Angeles', name: 'Los Angeles (Pacific)', offset: -480, abbr: 'PST/PDT' },
  { id: 'America/Anchorage', name: 'Anchorage (Alaska)', offset: -540, abbr: 'AKST' },
  { id: 'Pacific/Honolulu', name: 'Honolulu (Hawaii)', offset: -600, abbr: 'HST' },
  { id: 'America/Sao_Paulo', name: 'São Paulo (Brazil)', offset: -180, abbr: 'BRT' },
  { id: 'America/Buenos_Aires', name: 'Buenos Aires (Argentina)', offset: -180, abbr: 'ART' },
  { id: 'America/Mexico_City', name: 'Mexico City', offset: -360, abbr: 'CST' },
  { id: 'America/Toronto', name: 'Toronto (Canada)', offset: -300, abbr: 'EST/EDT' },
  { id: 'America/Vancouver', name: 'Vancouver (Canada)', offset: -480, abbr: 'PST/PDT' },
  // Europe
  { id: 'Europe/London', name: 'London (UK)', offset: 0, abbr: 'GMT/BST' },
  { id: 'Europe/Paris', name: 'Paris (France)', offset: 60, abbr: 'CET/CEST' },
  { id: 'Europe/Berlin', name: 'Berlin (Germany)', offset: 60, abbr: 'CET/CEST' },
  { id: 'Europe/Madrid', name: 'Madrid (Spain)', offset: 60, abbr: 'CET/CEST' },
  { id: 'Europe/Rome', name: 'Rome (Italy)', offset: 60, abbr: 'CET/CEST' },
  { id: 'Europe/Amsterdam', name: 'Amsterdam (Netherlands)', offset: 60, abbr: 'CET/CEST' },
  { id: 'Europe/Moscow', name: 'Moscow (Russia)', offset: 180, abbr: 'MSK' },
  { id: 'Europe/Istanbul', name: 'Istanbul (Turkey)', offset: 180, abbr: 'TRT' },
  { id: 'Europe/Lisbon', name: 'Lisbon (Portugal)', offset: 0, abbr: 'WET/WEST' },
  // Asia
  { id: 'Asia/Dubai', name: 'Dubai (UAE)', offset: 240, abbr: 'GST' },
  { id: 'Asia/Kolkata', name: 'Mumbai/Delhi (India)', offset: 330, abbr: 'IST' },
  { id: 'Asia/Bangkok', name: 'Bangkok (Thailand)', offset: 420, abbr: 'ICT' },
  { id: 'Asia/Singapore', name: 'Singapore', offset: 480, abbr: 'SGT' },
  { id: 'Asia/Hong_Kong', name: 'Hong Kong', offset: 480, abbr: 'HKT' },
  { id: 'Asia/Shanghai', name: 'Shanghai/Beijing (China)', offset: 480, abbr: 'CST' },
  { id: 'Asia/Tokyo', name: 'Tokyo (Japan)', offset: 540, abbr: 'JST' },
  { id: 'Asia/Seoul', name: 'Seoul (South Korea)', offset: 540, abbr: 'KST' },
  // Oceania
  { id: 'Australia/Sydney', name: 'Sydney (Australia)', offset: 600, abbr: 'AEST/AEDT' },
  { id: 'Australia/Melbourne', name: 'Melbourne (Australia)', offset: 600, abbr: 'AEST/AEDT' },
  { id: 'Australia/Perth', name: 'Perth (Australia)', offset: 480, abbr: 'AWST' },
  { id: 'Pacific/Auckland', name: 'Auckland (New Zealand)', offset: 720, abbr: 'NZST/NZDT' },
  // Africa
  { id: 'Africa/Cairo', name: 'Cairo (Egypt)', offset: 120, abbr: 'EET' },
  { id: 'Africa/Johannesburg', name: 'Johannesburg (South Africa)', offset: 120, abbr: 'SAST' },
  { id: 'Africa/Lagos', name: 'Lagos (Nigeria)', offset: 60, abbr: 'WAT' },
];

export default function TimezoneClientPage() {
  const t = useTranslations('TimezoneCalculator');

  const [fromTimezone, setFromTimezone] = useState<string>('America/New_York');
  const [toTimezone, setToTimezone] = useState<string>('Europe/London');
  const [hour, setHour] = useState<string>('12');
  const [minute, setMinute] = useState<string>('00');
  const [is24Hour, setIs24Hour] = useState<boolean>(true);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('PM');

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howTo: false,
    common: false,
    faq: false
  });

  const result = useMemo(() => {
    let hourNum = parseInt(hour) || 0;
    const minuteNum = parseInt(minute) || 0;

    if (!is24Hour) {
      if (ampm === 'PM' && hourNum !== 12) {
        hourNum += 12;
      } else if (ampm === 'AM' && hourNum === 12) {
        hourNum = 0;
      }
    }

    if (hourNum < 0 || hourNum > 23 || minuteNum < 0 || minuteNum > 59) {
      return null;
    }

    const fromTz = TIMEZONES.find(tz => tz.id === fromTimezone);
    const toTz = TIMEZONES.find(tz => tz.id === toTimezone);

    if (!fromTz || !toTz) return null;

    // Convert to UTC first, then to target timezone
    const totalMinutesFrom = hourNum * 60 + minuteNum;
    const utcMinutes = totalMinutesFrom - fromTz.offset;
    let targetMinutes = utcMinutes + toTz.offset;

    // Handle day overflow/underflow
    let dayDiff = 0;
    if (targetMinutes < 0) {
      targetMinutes += 1440; // Add 24 hours
      dayDiff = -1;
    } else if (targetMinutes >= 1440) {
      targetMinutes -= 1440;
      dayDiff = 1;
    }

    const targetHour = Math.floor(targetMinutes / 60);
    const targetMinute = targetMinutes % 60;

    // Calculate offset difference
    const offsetDiff = (toTz.offset - fromTz.offset) / 60;

    return {
      fromTime: { hour: hourNum, minute: minuteNum },
      toTime: { hour: targetHour, minute: targetMinute },
      fromTz,
      toTz,
      dayDiff,
      offsetDiff,
    };
  }, [fromTimezone, toTimezone, hour, minute, is24Hour, ampm]);

  const formatTime = (hour: number, minute: number, use24: boolean = true) => {
    if (use24) {
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    } else {
      const h = hour % 12 || 12;
      const period = hour < 12 ? 'AM' : 'PM';
      return `${h}:${minute.toString().padStart(2, '0')} ${period}`;
    }
  };

  const formatOffset = (offset: number) => {
    const hours = Math.floor(Math.abs(offset) / 60);
    const mins = Math.abs(offset) % 60;
    const sign = offset >= 0 ? '+' : '-';
    return `UTC${sign}${hours}${mins > 0 ? `:${mins.toString().padStart(2, '0')}` : ''}`;
  };

  const swapTimezones = () => {
    setFromTimezone(toTimezone);
    setToTimezone(fromTimezone);
  };

  const setCurrentTime = () => {
    const now = new Date();
    setHour(now.getHours().toString().padStart(2, '0'));
    setMinute(now.getMinutes().toString().padStart(2, '0'));
    setIs24Hour(true);
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
          {/* Time Format Toggle */}
          <div className="flex justify-between items-center mb-6">
            <label className="text-sm font-medium text-gray-700">{t('timeFormat')}</label>
            <div className="flex gap-2">
              <button
                onClick={() => setIs24Hour(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  is24Hour
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                24h
              </button>
              <button
                onClick={() => setIs24Hour(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !is24Hour
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                12h
              </button>
            </div>
          </div>

          {/* Time Input */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">{t('enterTime')}</label>
              <button
                onClick={setCurrentTime}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Clock className="w-4 h-4" />
                {t('useCurrentTime')}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                min={is24Hour ? 0 : 1}
                max={is24Hour ? 23 : 12}
                className="w-20 px-3 py-3 text-xl text-center border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                placeholder="12"
              />
              <span className="text-2xl text-gray-400">:</span>
              <input
                type="number"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                min={0}
                max={59}
                className="w-20 px-3 py-3 text-xl text-center border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                placeholder="00"
              />
              {!is24Hour && (
                <div className="flex gap-1">
                  <button
                    onClick={() => setAmpm('AM')}
                    className={`px-3 py-3 rounded-lg font-medium transition-colors ${
                      ampm === 'AM'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    AM
                  </button>
                  <button
                    onClick={() => setAmpm('PM')}
                    className={`px-3 py-3 rounded-lg font-medium transition-colors ${
                      ampm === 'PM'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    PM
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Timezone Selection */}
          <div className="space-y-4 mb-6">
            {/* From Timezone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                {t('fromTimezone')}
              </label>
              <select
                value={fromTimezone}
                onChange={(e) => setFromTimezone(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors bg-white"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz.id} value={tz.id}>
                    {tz.name} ({formatOffset(tz.offset)})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={swapTimezones}
                className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                title={t('swap')}
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* To Timezone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                {t('toTimezone')}
              </label>
              <select
                value={toTimezone}
                onChange={(e) => setToTimezone(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors bg-white"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz.id} value={tz.id}>
                    {tz.name} ({formatOffset(tz.offset)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="mt-6 space-y-4">
              {/* Main Result */}
              <div className="p-5 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  {/* From Time */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800">
                      {formatTime(result.fromTime.hour, result.fromTime.minute, is24Hour)}
                    </div>
                    <div className="text-sm text-gray-600">{result.fromTz.abbr}</div>
                    <div className="text-xs text-gray-500">{formatOffset(result.fromTz.offset)}</div>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="w-8 h-8 text-blue-500" />

                  {/* To Time */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-700">
                      {formatTime(result.toTime.hour, result.toTime.minute, is24Hour)}
                    </div>
                    <div className="text-sm text-blue-600">{result.toTz.abbr}</div>
                    <div className="text-xs text-gray-500">{formatOffset(result.toTz.offset)}</div>
                  </div>
                </div>

                {/* Day Change Indicator */}
                {result.dayDiff !== 0 && (
                  <div className={`mt-3 text-center text-sm font-medium ${
                    result.dayDiff > 0 ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {result.dayDiff > 0 ? t('nextDay') : t('previousDay')}
                  </div>
                )}
              </div>

              {/* Time Difference */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-center">
                  <div className="text-xs text-purple-600 mb-1">{t('timeDifference')}</div>
                  <div className="text-xl font-bold text-purple-700">
                    {result.offsetDiff >= 0 ? '+' : ''}{result.offsetDiff} {t('hours')}
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
                  <div className="text-xs text-green-600 mb-1">{t('direction')}</div>
                  <div className="text-xl font-bold text-green-700">
                    {result.offsetDiff > 0 ? t('ahead') : result.offsetDiff < 0 ? t('behind') : t('same')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Reference */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('quickReference')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'].map(tzId => {
              const tz = TIMEZONES.find(t => t.id === tzId);
              if (!tz) return null;
              return (
                <div key={tzId} className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="font-medium text-gray-900">{tz.name.split(' ')[0]}</div>
                  <div className="text-gray-500">{formatOffset(tz.offset)}</div>
                </div>
              );
            })}
          </div>
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

          {/* How To */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('howTo')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('howToConvert')}</h2>
              {expandedSections.howTo ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.howTo && (
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">
                  {t('howToConvertContent')}
                </p>
              </div>
            )}
          </div>

          {/* Common Conversions */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('common')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('commonConversions')}</h2>
              {expandedSections.common ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.common && (
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">
                  {t('commonConversionsContent')}
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
