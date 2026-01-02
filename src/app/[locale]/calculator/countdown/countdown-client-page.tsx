'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
  Timer,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Calendar,
  Clock,
  PartyPopper,
  Bell,
  Share2,
  Copy,
  Check
} from 'lucide-react';

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  percentComplete: number;
  isPast: boolean;
}

interface SavedEvent {
  id: string;
  name: string;
  date: string;
  time: string;
}

export default function CountdownClientPage() {
  const t = useTranslations('CountdownCalculator');

  const [eventName, setEventName] = useState<string>('');
  const [targetDate, setTargetDate] = useState<string>('');
  const [targetTime, setTargetTime] = useState<string>('00:00');
  const [startDate, setStartDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>([]);
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howTo: false,
    ideas: false,
    faq: false
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load saved events from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('countdownEvents');
    if (saved) {
      setSavedEvents(JSON.parse(saved));
    }
  }, []);

  const result = useMemo((): CountdownResult | null => {
    if (!targetDate) return null;

    const target = new Date(`${targetDate}T${targetTime}`);
    const start = new Date(startDate);
    const now = currentTime;

    if (isNaN(target.getTime())) return null;

    const diff = target.getTime() - now.getTime();
    const totalDiff = target.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();

    const isPast = diff < 0;
    const absDiff = Math.abs(diff);

    const totalSeconds = Math.floor(absDiff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    const days = totalDays;
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    const percentComplete = totalDiff > 0
      ? Math.min(100, Math.max(0, (elapsed / totalDiff) * 100))
      : 0;

    return {
      days,
      hours,
      minutes,
      seconds,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      percentComplete,
      isPast
    };
  }, [targetDate, targetTime, startDate, currentTime]);

  const handleReset = () => {
    setEventName('');
    setTargetDate('');
    setTargetTime('00:00');
    setStartDate(new Date().toISOString().split('T')[0]);
  };

  const setQuickDate = (daysFromNow: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    setTargetDate(date.toISOString().split('T')[0]);
  };

  const setPresetEvent = (type: string) => {
    const now = new Date();
    let date: Date;
    let name: string;

    switch (type) {
      case 'newYear':
        date = new Date(now.getFullYear() + 1, 0, 1);
        name = t('presets.newYear');
        break;
      case 'christmas':
        date = new Date(now.getFullYear(), 11, 25);
        if (date < now) date.setFullYear(date.getFullYear() + 1);
        name = t('presets.christmas');
        break;
      case 'halloween':
        date = new Date(now.getFullYear(), 9, 31);
        if (date < now) date.setFullYear(date.getFullYear() + 1);
        name = t('presets.halloween');
        break;
      case 'valentine':
        date = new Date(now.getFullYear(), 1, 14);
        if (date < now) date.setFullYear(date.getFullYear() + 1);
        name = t('presets.valentine');
        break;
      default:
        return;
    }

    setEventName(name);
    setTargetDate(date.toISOString().split('T')[0]);
    setTargetTime('00:00');
  };

  const saveEvent = () => {
    if (!eventName || !targetDate) return;

    const newEvent: SavedEvent = {
      id: Date.now().toString(),
      name: eventName,
      date: targetDate,
      time: targetTime
    };

    const updated = [...savedEvents, newEvent];
    setSavedEvents(updated);
    localStorage.setItem('countdownEvents', JSON.stringify(updated));
  };

  const loadEvent = (event: SavedEvent) => {
    setEventName(event.name);
    setTargetDate(event.date);
    setTargetTime(event.time);
  };

  const deleteEvent = (id: string) => {
    const updated = savedEvents.filter(e => e.id !== id);
    setSavedEvents(updated);
    localStorage.setItem('countdownEvents', JSON.stringify(updated));
  };

  const copyShareLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}?event=${encodeURIComponent(eventName)}&date=${targetDate}&time=${targetTime}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-100 rounded-2xl mb-4">
            <Timer className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Preset Events */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('presetEvents')}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setPresetEvent('newYear')}
                className="px-3 py-1.5 text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition-colors"
              >
                🎆 {t('presets.newYear')}
              </button>
              <button
                onClick={() => setPresetEvent('christmas')}
                className="px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"
              >
                🎄 {t('presets.christmas')}
              </button>
              <button
                onClick={() => setPresetEvent('halloween')}
                className="px-3 py-1.5 text-sm bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg transition-colors"
              >
                🎃 {t('presets.halloween')}
              </button>
              <button
                onClick={() => setPresetEvent('valentine')}
                className="px-3 py-1.5 text-sm bg-pink-100 hover:bg-pink-200 text-pink-800 rounded-lg transition-colors"
              >
                💕 {t('presets.valentine')}
              </button>
            </div>
          </div>

          {/* Quick Days */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('quickDays')}
            </label>
            <div className="flex flex-wrap gap-2">
              {[7, 14, 30, 60, 90, 180, 365].map(days => (
                <button
                  key={days}
                  onClick={() => setQuickDate(days)}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  {days} {t('days')}
                </button>
              ))}
            </div>
          </div>

          {/* Event Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('eventName')}
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder={t('eventNamePlaceholder')}
              className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Date and Time Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                {t('targetDate')}
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                {t('targetTime')}
              </label>
              <input
                type="time"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {t('reset')}
            </button>
            {eventName && targetDate && (
              <>
                <button
                  onClick={saveEvent}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {t('saveEvent')}
                </button>
                <button
                  onClick={copyShareLink}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  {copied ? t('copied') : t('share')}
                </button>
              </>
            )}
          </div>

          {/* Countdown Display */}
          {result && (
            <div className="space-y-4">
              {/* Event Name Display */}
              {eventName && (
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">{eventName}</h2>
                </div>
              )}

              {/* Main Countdown */}
              {result.isPast ? (
                <div className="p-6 bg-green-50 rounded-xl border-2 border-green-200 text-center">
                  <PartyPopper className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-green-700 mb-2">{t('eventPassed')}</h3>
                  <p className="text-green-600">
                    {result.days} {t('days')}, {result.hours} {t('hours')} {t('ago')}
                  </p>
                </div>
              ) : (
                <>
                  {/* Countdown Boxes */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-4 bg-indigo-50 rounded-xl border-2 border-indigo-200 text-center">
                      <span className="text-3xl md:text-5xl font-bold text-indigo-600 block">
                        {formatNumber(result.days)}
                      </span>
                      <span className="text-xs md:text-sm text-indigo-500 uppercase tracking-wide">
                        {t('days')}
                      </span>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200 text-center">
                      <span className="text-3xl md:text-5xl font-bold text-purple-600 block">
                        {formatNumber(result.hours)}
                      </span>
                      <span className="text-xs md:text-sm text-purple-500 uppercase tracking-wide">
                        {t('hours')}
                      </span>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-xl border-2 border-pink-200 text-center">
                      <span className="text-3xl md:text-5xl font-bold text-pink-600 block">
                        {formatNumber(result.minutes)}
                      </span>
                      <span className="text-xs md:text-sm text-pink-500 uppercase tracking-wide">
                        {t('minutes')}
                      </span>
                    </div>
                    <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200 text-center">
                      <span className="text-3xl md:text-5xl font-bold text-red-600 block animate-pulse">
                        {formatNumber(result.seconds)}
                      </span>
                      <span className="text-xs md:text-sm text-red-500 uppercase tracking-wide">
                        {t('seconds')}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>{t('progress')}</span>
                      <span>{result.percentComplete.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${result.percentComplete}%` }}
                      />
                    </div>
                  </div>

                  {/* Total Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <span className="text-xs text-gray-500 block">{t('totalDays')}</span>
                      <span className="text-lg font-bold text-gray-700">{result.totalDays.toLocaleString()}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <span className="text-xs text-gray-500 block">{t('totalHours')}</span>
                      <span className="text-lg font-bold text-gray-700">{result.totalHours.toLocaleString()}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <span className="text-xs text-gray-500 block">{t('totalMinutes')}</span>
                      <span className="text-lg font-bold text-gray-700">{result.totalMinutes.toLocaleString()}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <span className="text-xs text-gray-500 block">{t('totalSeconds')}</span>
                      <span className="text-lg font-bold text-gray-700">{result.totalSeconds.toLocaleString()}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Saved Events */}
          {savedEvents.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="text-sm font-medium text-gray-700 mb-3">{t('savedEvents')}</h3>
              <div className="space-y-2">
                {savedEvents.map(event => (
                  <div key={event.id} className="flex items-center justify-between p-2 bg-white rounded-lg border">
                    <button
                      onClick={() => loadEvent(event)}
                      className="flex-1 text-left text-sm text-gray-700 hover:text-indigo-600"
                    >
                      <span className="font-medium">{event.name}</span>
                      <span className="text-gray-400 ml-2">{event.date}</span>
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="text-red-400 hover:text-red-600 px-2"
                    >
                      ×
                    </button>
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

          {/* Ideas Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('ideas')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('ideas.title')}</h2>
              {expandedSections.ideas ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.ideas && (
              <div className="px-6 pb-6">
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('ideas.content') }}
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
