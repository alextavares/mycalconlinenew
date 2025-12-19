'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Flame, User, Ruler, Scale, Calendar, Activity, ChevronDown, ChevronUp, TrendingDown, TrendingUp, Minus } from 'lucide-react';

type Gender = 'male' | 'female';
type UnitSystem = 'metric' | 'imperial';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,      // Little or no exercise
  light: 1.375,        // Light exercise 1-3 days/week
  moderate: 1.55,      // Moderate exercise 3-5 days/week
  active: 1.725,       // Hard exercise 6-7 days/week
  veryActive: 1.9,     // Very hard exercise, physical job
};

export default function CalorieClientPage() {
  const t = useTranslations('CalorieCalculator');

  // Input states
  const [gender, setGender] = useState<Gender>('male');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [age, setAge] = useState<string>('');
  const [weightKg, setWeightKg] = useState<string>('');
  const [weightLb, setWeightLb] = useState<string>('');
  const [heightCm, setHeightCm] = useState<string>('');
  const [heightFt, setHeightFt] = useState<string>('');
  const [heightIn, setHeightIn] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');

  // SEO sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howToCalculate: false,
    activityLevels: false,
    weightGoals: false,
    faq: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Calculate BMR and TDEE using Mifflin-St Jeor equation
  const { bmr, tdee, loseWeight, loseFast, gainWeight } = useMemo(() => {
    let weight: number;
    let height: number;
    const ageNum = parseInt(age);

    if (unitSystem === 'metric') {
      weight = parseFloat(weightKg);
      height = parseFloat(heightCm);
    } else {
      weight = parseFloat(weightLb) * 0.453592; // Convert to kg
      const feet = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      height = (feet * 12 + inches) * 2.54; // Convert to cm
    }

    if (!weight || !height || !ageNum || weight <= 0 || height <= 0 || ageNum <= 0) {
      return { bmr: 0, tdee: 0, loseWeight: 0, loseFast: 0, gainWeight: 0 };
    }

    // Mifflin-St Jeor Equation
    // Men: BMR = 10W + 6.25H - 5A + 5
    // Women: BMR = 10W + 6.25H - 5A - 161
    let bmrValue: number;
    if (gender === 'male') {
      bmrValue = 10 * weight + 6.25 * height - 5 * ageNum + 5;
    } else {
      bmrValue = 10 * weight + 6.25 * height - 5 * ageNum - 161;
    }

    const tdeeValue = bmrValue * ACTIVITY_MULTIPLIERS[activityLevel];

    return {
      bmr: Math.round(bmrValue),
      tdee: Math.round(tdeeValue),
      loseWeight: Math.round(tdeeValue - 500),  // 0.5 kg/week loss
      loseFast: Math.round(tdeeValue - 1000),   // 1 kg/week loss
      gainWeight: Math.round(tdeeValue + 500),  // 0.5 kg/week gain
    };
  }, [gender, unitSystem, age, weightKg, weightLb, heightCm, heightFt, heightIn, activityLevel]);

  const clearAll = () => {
    setAge('');
    setWeightKg('');
    setWeightLb('');
    setHeightCm('');
    setHeightFt('');
    setHeightIn('');
    setActivityLevel('moderate');
  };

  const activityLevels: { key: ActivityLevel; multiplier: number }[] = [
    { key: 'sedentary', multiplier: 1.2 },
    { key: 'light', multiplier: 1.375 },
    { key: 'moderate', multiplier: 1.55 },
    { key: 'active', multiplier: 1.725 },
    { key: 'veryActive', multiplier: 1.9 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <Flame className="w-8 h-8 text-orange-500" />
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
          {/* Gender Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              {t('gender')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setGender('male')}
                className={`py-3 px-4 rounded-lg border-2 transition-all font-medium ${
                  gender === 'male'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                {t('male')}
              </button>
              <button
                onClick={() => setGender('female')}
                className={`py-3 px-4 rounded-lg border-2 transition-all font-medium ${
                  gender === 'female'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                {t('female')}
              </button>
            </div>
          </div>

          {/* Unit System */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('unitSystem')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setUnitSystem('metric')}
                className={`py-2 px-4 rounded-lg border-2 transition-all text-sm ${
                  unitSystem === 'metric'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                {t('metric')} (kg, cm)
              </button>
              <button
                onClick={() => setUnitSystem('imperial')}
                className={`py-2 px-4 rounded-lg border-2 transition-all text-sm ${
                  unitSystem === 'imperial'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                {t('imperial')} (lb, ft)
              </button>
            </div>
          </div>

          {/* Age, Weight, Height */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                {t('age')}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="25"
                  min="1"
                  max="120"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{t('years')}</span>
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Scale className="w-4 h-4 inline mr-1" />
                {t('weight')}
              </label>
              {unitSystem === 'metric' ? (
                <div className="relative">
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="70"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">kg</span>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="number"
                    value={weightLb}
                    onChange={(e) => setWeightLb(e.target.value)}
                    placeholder="154"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">lb</span>
                </div>
              )}
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Ruler className="w-4 h-4 inline mr-1" />
                {t('height')}
              </label>
              {unitSystem === 'metric' ? (
                <div className="relative">
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="175"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">cm</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      placeholder="5"
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition-colors"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">ft</span>
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      placeholder="9"
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition-colors"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">in</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Level */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Activity className="w-4 h-4 inline mr-1" />
              {t('activityLevel')}
            </label>
            <div className="space-y-2">
              {activityLevels.map((level) => (
                <button
                  key={level.key}
                  onClick={() => setActivityLevel(level.key)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    activityLevel === level.key
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-900">{t(`activity.${level.key}`)}</span>
                      <p className="text-sm text-gray-500">{t(`activity.${level.key}Desc`)}</p>
                    </div>
                    <span className="text-sm text-gray-400">×{level.multiplier}</span>
                  </div>
                </button>
              ))}
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
          {tdee > 0 && (
            <div className="space-y-4">
              {/* Main TDEE Result */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 mb-1">{t('dailyCalories')}</p>
                  <div className="text-5xl font-bold text-orange-600 mb-2">
                    {tdee.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">{t('caloriesPerDay')}</p>
                </div>
              </div>

              {/* BMR */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-700">{t('bmr')}</p>
                    <p className="text-sm text-gray-500">{t('bmrDesc')}</p>
                  </div>
                  <div className="text-2xl font-bold text-gray-700">
                    {bmr.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Weight Goals */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Lose Weight */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-700">{t('loseWeight')}</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{loseWeight.toLocaleString()}</div>
                  <p className="text-xs text-green-600 mt-1">{t('loseWeightDesc')}</p>
                </div>

                {/* Maintain Weight */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Minus className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-700">{t('maintainWeight')}</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{tdee.toLocaleString()}</div>
                  <p className="text-xs text-blue-600 mt-1">{t('maintainWeightDesc')}</p>
                </div>

                {/* Gain Weight */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-700">{t('gainWeight')}</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{gainWeight.toLocaleString()}</div>
                  <p className="text-xs text-purple-600 mt-1">{t('gainWeightDesc')}</p>
                </div>
              </div>

              {/* Formula Used */}
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <p className="font-medium text-gray-700 mb-2">{t('formulaUsed')}</p>
                <p className="text-gray-600 font-mono text-xs">
                  {gender === 'male'
                    ? 'BMR = 10×weight(kg) + 6.25×height(cm) - 5×age + 5'
                    : 'BMR = 10×weight(kg) + 6.25×height(cm) - 5×age - 161'
                  }
                </p>
                <p className="text-gray-500 text-xs mt-1">{t('mifflinStJeor')}</p>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content Sections */}
        <div className="space-y-4">
          {/* What are Calories */}
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

          {/* Activity Levels */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => toggleSection('activityLevels')}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <h2 className="text-xl font-semibold text-gray-900">{t('activityLevelsSection.title')}</h2>
              {expandedSections.activityLevels ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.activityLevels && (
              <div className="px-6 pb-6">
                <div
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('activityLevelsSection.content') }}
                />
              </div>
            )}
          </div>

          {/* Weight Goals */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => toggleSection('weightGoals')}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <h2 className="text-xl font-semibold text-gray-900">{t('weightGoals.title')}</h2>
              {expandedSections.weightGoals ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.weightGoals && (
              <div className="px-6 pb-6">
                <div
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('weightGoals.content') }}
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
