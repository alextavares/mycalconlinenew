'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Scale, Ruler, ChevronDown, ChevronUp, Info, Heart, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

type UnitSystem = 'metric' | 'imperial';

interface BmiCategory {
  min: number;
  max: number;
  key: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
}

const BMI_CATEGORIES: BmiCategory[] = [
  { min: 0, max: 18.5, key: 'underweight', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', icon: AlertTriangle },
  { min: 18.5, max: 25, key: 'normal', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200', icon: CheckCircle },
  { min: 25, max: 30, key: 'overweight', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', icon: AlertTriangle },
  { min: 30, max: 35, key: 'obese', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', icon: XCircle },
  { min: 35, max: Infinity, key: 'severelyObese', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200', icon: XCircle },
];

export default function BmiClientPage() {
  const t = useTranslations('BmiCalculator');

  // Unit system
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');

  // Metric inputs
  const [weightKg, setWeightKg] = useState<string>('');
  const [heightCm, setHeightCm] = useState<string>('');

  // Imperial inputs
  const [weightLb, setWeightLb] = useState<string>('');
  const [heightFt, setHeightFt] = useState<string>('');
  const [heightIn, setHeightIn] = useState<string>('');

  // SEO sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howToCalculate: false,
    bmiRanges: false,
    limitations: false,
    faq: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Calculate BMI
  const { bmi, category, formula } = useMemo(() => {
    let weight: number;
    let height: number;
    let formulaStr: string;

    if (unitSystem === 'metric') {
      weight = parseFloat(weightKg);
      height = parseFloat(heightCm) / 100; // Convert cm to m

      if (!weight || !height || weight <= 0 || height <= 0) {
        return { bmi: null, category: null, formula: '' };
      }

      const bmiValue = weight / (height * height);
      formulaStr = `BMI = ${weight} kg ÷ (${height.toFixed(2)} m)² = ${weight} ÷ ${(height * height).toFixed(4)} = ${bmiValue.toFixed(1)}`;

      const cat = BMI_CATEGORIES.find(c => bmiValue >= c.min && bmiValue < c.max);
      return { bmi: bmiValue, category: cat, formula: formulaStr };
    } else {
      const lbs = parseFloat(weightLb);
      const feet = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      const totalInches = (feet * 12) + inches;

      if (!lbs || totalInches <= 0 || lbs <= 0) {
        return { bmi: null, category: null, formula: '' };
      }

      // BMI = (weight in lbs × 703) / (height in inches)²
      const bmiValue = (lbs * 703) / (totalInches * totalInches);
      formulaStr = `BMI = (${lbs} lb × 703) ÷ (${totalInches} in)² = ${(lbs * 703).toFixed(0)} ÷ ${(totalInches * totalInches).toFixed(0)} = ${bmiValue.toFixed(1)}`;

      const cat = BMI_CATEGORIES.find(c => bmiValue >= c.min && bmiValue < c.max);
      return { bmi: bmiValue, category: cat, formula: formulaStr };
    }
  }, [unitSystem, weightKg, heightCm, weightLb, heightFt, heightIn]);

  // Calculate healthy weight range
  const healthyWeightRange = useMemo(() => {
    if (unitSystem === 'metric') {
      const height = parseFloat(heightCm) / 100;
      if (!height || height <= 0) return null;
      const minWeight = 18.5 * height * height;
      const maxWeight = 24.9 * height * height;
      return { min: minWeight.toFixed(1), max: maxWeight.toFixed(1), unit: 'kg' };
    } else {
      const feet = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      const totalInches = (feet * 12) + inches;
      if (totalInches <= 0) return null;
      const minWeight = (18.5 * totalInches * totalInches) / 703;
      const maxWeight = (24.9 * totalInches * totalInches) / 703;
      return { min: minWeight.toFixed(1), max: maxWeight.toFixed(1), unit: 'lb' };
    }
  }, [unitSystem, heightCm, heightFt, heightIn]);

  const clearInputs = () => {
    setWeightKg('');
    setHeightCm('');
    setWeightLb('');
    setHeightFt('');
    setHeightIn('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Scale className="w-8 h-8 text-primary" />
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
          {/* Unit System Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('unitSystem')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setUnitSystem('metric')}
                className={`py-3 px-4 rounded-lg border-2 transition-all font-medium ${
                  unitSystem === 'metric'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                {t('metric')} (kg, cm)
              </button>
              <button
                onClick={() => setUnitSystem('imperial')}
                className={`py-3 px-4 rounded-lg border-2 transition-all font-medium ${
                  unitSystem === 'imperial'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                {t('imperial')} (lb, ft/in)
              </button>
            </div>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Weight Input */}
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition-colors text-lg"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">kg</span>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="number"
                    value={weightLb}
                    onChange={(e) => setWeightLb(e.target.value)}
                    placeholder="154"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition-colors text-lg"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">lb</span>
                </div>
              )}
            </div>

            {/* Height Input */}
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition-colors text-lg"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">cm</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      placeholder="5"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition-colors text-lg"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">ft</span>
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      placeholder="9"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-0 outline-none transition-colors text-lg"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">in</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Clear Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={clearInputs}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {t('clear')}
            </button>
          </div>

          {/* Result */}
          {bmi !== null && category && (
            <div className={`rounded-xl p-6 ${category.bgColor} border-2 ${category.borderColor}`}>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-1">{t('yourBmi')}</p>
                <div className={`text-5xl font-bold ${category.color} mb-2`}>
                  {bmi.toFixed(1)}
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${category.bgColor} ${category.color} font-semibold`}>
                  <category.icon className="w-5 h-5" />
                  {t(`categories.${category.key}`)}
                </div>
              </div>

              {/* Formula */}
              <div className="mt-4 p-3 bg-white/60 rounded-lg">
                <p className="text-sm text-gray-600 font-mono text-center">{formula}</p>
              </div>

              {/* Healthy Weight Range */}
              {healthyWeightRange && (
                <div className="mt-4 p-4 bg-white/60 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Heart className="w-5 h-5 text-green-500" />
                    <span className="font-medium">{t('healthyWeightRange')}</span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    {healthyWeightRange.min} - {healthyWeightRange.max} {healthyWeightRange.unit}
                  </p>
                </div>
              )}

              {/* Health Tips */}
              <div className="mt-4 p-4 bg-white/60 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600">
                    {t(`tips.${category.key}`)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* BMI Scale Visual */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-3">{t('bmiScale')}</p>
            <div className="flex rounded-lg overflow-hidden h-8">
              <div className="bg-blue-400 flex-1 flex items-center justify-center text-white text-xs font-medium">
                &lt;18.5
              </div>
              <div className="bg-green-400 flex-1 flex items-center justify-center text-white text-xs font-medium">
                18.5-25
              </div>
              <div className="bg-yellow-400 flex-1 flex items-center justify-center text-white text-xs font-medium">
                25-30
              </div>
              <div className="bg-orange-400 flex-1 flex items-center justify-center text-white text-xs font-medium">
                30-35
              </div>
              <div className="bg-red-400 flex-1 flex items-center justify-center text-white text-xs font-medium">
                &gt;35
              </div>
            </div>
            <div className="flex mt-1 text-xs text-gray-500">
              <div className="flex-1 text-center">{t('categories.underweight')}</div>
              <div className="flex-1 text-center">{t('categories.normal')}</div>
              <div className="flex-1 text-center">{t('categories.overweight')}</div>
              <div className="flex-1 text-center">{t('categories.obese')}</div>
              <div className="flex-1 text-center">{t('categories.severelyObese')}</div>
            </div>
          </div>
        </div>

        {/* SEO Content Sections */}
        <div className="space-y-4">
          {/* What is BMI */}
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

          {/* How to Calculate BMI */}
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

          {/* BMI Ranges */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => toggleSection('bmiRanges')}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <h2 className="text-xl font-semibold text-gray-900">{t('bmiRanges.title')}</h2>
              {expandedSections.bmiRanges ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.bmiRanges && (
              <div className="px-6 pb-6">
                <div
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('bmiRanges.content') }}
                />
              </div>
            )}
          </div>

          {/* Limitations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => toggleSection('limitations')}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <h2 className="text-xl font-semibold text-gray-900">{t('limitations.title')}</h2>
              {expandedSections.limitations ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.limitations && (
              <div className="px-6 pb-6">
                <div
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: t.raw('limitations.content') }}
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
