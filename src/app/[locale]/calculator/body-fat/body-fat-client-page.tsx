'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Activity, User, Users, ChevronDown, ChevronUp, Ruler, Scale } from 'lucide-react';

type Gender = 'male' | 'female';
type UnitSystem = 'metric' | 'imperial';
type Method = 'navy' | 'bmi';

export default function BodyFatClientPage() {
  const t = useTranslations('BodyFatCalculator');

  const [gender, setGender] = useState<Gender>('male');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [method, setMethod] = useState<Method>('navy');

  // Navy method measurements
  const [height, setHeight] = useState<string>('175');
  const [weight, setWeight] = useState<string>('75');
  const [waist, setWaist] = useState<string>('85');
  const [neck, setNeck] = useState<string>('38');
  const [hip, setHip] = useState<string>('95'); // Only for females

  // Imperial inputs
  const [heightFeet, setHeightFeet] = useState<string>('5');
  const [heightInches, setHeightInches] = useState<string>('9');
  const [weightLbs, setWeightLbs] = useState<string>('165');
  const [waistInches, setWaistInches] = useState<string>('33.5');
  const [neckInches, setNeckInches] = useState<string>('15');
  const [hipInches, setHipInches] = useState<string>('37.5');

  const [age, setAge] = useState<string>('30');

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howTo: false,
    categories: false,
    faq: false
  });

  const result = useMemo(() => {
    let heightCm: number, weightKg: number, waistCm: number, neckCm: number, hipCm: number;

    if (unitSystem === 'metric') {
      heightCm = parseFloat(height);
      weightKg = parseFloat(weight);
      waistCm = parseFloat(waist);
      neckCm = parseFloat(neck);
      hipCm = parseFloat(hip);
    } else {
      const feet = parseFloat(heightFeet) || 0;
      const inches = parseFloat(heightInches) || 0;
      heightCm = (feet * 12 + inches) * 2.54;
      weightKg = parseFloat(weightLbs) * 0.453592;
      waistCm = parseFloat(waistInches) * 2.54;
      neckCm = parseFloat(neckInches) * 2.54;
      hipCm = parseFloat(hipInches) * 2.54;
    }

    const ageVal = parseFloat(age);

    if (method === 'navy') {
      // US Navy Method
      if (isNaN(heightCm) || isNaN(waistCm) || isNaN(neckCm) || heightCm <= 0) {
        return null;
      }

      if (gender === 'female' && isNaN(hipCm)) {
        return null;
      }

      let bodyFat: number;

      if (gender === 'male') {
        // Male formula: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
        const logWaistNeck = Math.log10(waistCm - neckCm);
        const logHeight = Math.log10(heightCm);
        bodyFat = 495 / (1.0324 - 0.19077 * logWaistNeck + 0.15456 * logHeight) - 450;
      } else {
        // Female formula: 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
        const logMeasurement = Math.log10(waistCm + hipCm - neckCm);
        const logHeight = Math.log10(heightCm);
        bodyFat = 495 / (1.29579 - 0.35004 * logMeasurement + 0.221 * logHeight) - 450;
      }

      if (isNaN(bodyFat) || !isFinite(bodyFat)) {
        return null;
      }

      bodyFat = Math.max(0, Math.min(60, bodyFat));

      return {
        bodyFat: bodyFat,
        method: 'navy',
        leanMass: isNaN(weightKg) ? null : weightKg * (1 - bodyFat / 100),
        fatMass: isNaN(weightKg) ? null : weightKg * (bodyFat / 100),
        category: getCategory(bodyFat, gender)
      };
    } else {
      // BMI-based estimation (less accurate)
      if (isNaN(heightCm) || isNaN(weightKg) || isNaN(ageVal) || heightCm <= 0 || weightKg <= 0) {
        return null;
      }

      const heightM = heightCm / 100;
      const bmi = weightKg / (heightM * heightM);

      let bodyFat: number;
      if (gender === 'male') {
        bodyFat = 1.20 * bmi + 0.23 * ageVal - 16.2;
      } else {
        bodyFat = 1.20 * bmi + 0.23 * ageVal - 5.4;
      }

      bodyFat = Math.max(0, Math.min(60, bodyFat));

      return {
        bodyFat: bodyFat,
        method: 'bmi',
        bmi: bmi,
        leanMass: weightKg * (1 - bodyFat / 100),
        fatMass: weightKg * (bodyFat / 100),
        category: getCategory(bodyFat, gender)
      };
    }
  }, [gender, unitSystem, method, height, weight, waist, neck, hip, heightFeet, heightInches, weightLbs, waistInches, neckInches, hipInches, age]);

  function getCategory(bodyFat: number, gender: Gender): { name: string; color: string; bgColor: string; borderColor: string } {
    if (gender === 'male') {
      if (bodyFat < 6) return { name: t('categoryEssential'), color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
      if (bodyFat < 14) return { name: t('categoryAthlete'), color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
      if (bodyFat < 18) return { name: t('categoryFitness'), color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
      if (bodyFat < 25) return { name: t('categoryAcceptable'), color: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
      return { name: t('categoryObese'), color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
    } else {
      if (bodyFat < 14) return { name: t('categoryEssential'), color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
      if (bodyFat < 21) return { name: t('categoryAthlete'), color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
      if (bodyFat < 25) return { name: t('categoryFitness'), color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
      if (bodyFat < 32) return { name: t('categoryAcceptable'), color: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
      return { name: t('categoryObese'), color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
    }
  }

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
          {/* Gender Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('gender')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setGender('male')}
                className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                  gender === 'male'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">{t('male')}</span>
              </button>
              <button
                onClick={() => setGender('female')}
                className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                  gender === 'female'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">{t('female')}</span>
              </button>
            </div>
          </div>

          {/* Unit System Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('unitSystem')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setUnitSystem('metric')}
                className={`p-3 rounded-xl border-2 transition-all ${
                  unitSystem === 'metric'
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-medium">{t('metric')}</span>
                <span className="text-xs block text-gray-500">cm, kg</span>
              </button>
              <button
                onClick={() => setUnitSystem('imperial')}
                className={`p-3 rounded-xl border-2 transition-all ${
                  unitSystem === 'imperial'
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-medium">{t('imperial')}</span>
                <span className="text-xs block text-gray-500">ft/in, lbs</span>
              </button>
            </div>
          </div>

          {/* Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('method')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMethod('navy')}
                className={`p-3 rounded-xl border-2 transition-all ${
                  method === 'navy'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Ruler className="w-5 h-5 mx-auto mb-1" />
                <span className="font-medium text-sm">{t('navyMethod')}</span>
                <span className="text-xs block text-gray-500">{t('navyMethodDesc')}</span>
              </button>
              <button
                onClick={() => setMethod('bmi')}
                className={`p-3 rounded-xl border-2 transition-all ${
                  method === 'bmi'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Scale className="w-5 h-5 mx-auto mb-1" />
                <span className="font-medium text-sm">{t('bmiMethod')}</span>
                <span className="text-xs block text-gray-500">{t('bmiMethodDesc')}</span>
              </button>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            {/* Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('height')}
              </label>
              {unitSystem === 'metric' ? (
                <div className="relative">
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 transition-colors"
                    placeholder="175"
                    step="1"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">cm</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(e.target.value)}
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 transition-colors"
                      placeholder="5"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">ft</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={heightInches}
                      onChange={(e) => setHeightInches(e.target.value)}
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 transition-colors"
                      placeholder="9"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">in</span>
                  </div>
                </div>
              )}
            </div>

            {/* Weight (for BMI method) */}
            {method === 'bmi' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('weight')}
                </label>
                {unitSystem === 'metric' ? (
                  <div className="relative">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 transition-colors"
                      placeholder="75"
                      step="0.1"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">kg</span>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="number"
                      value={weightLbs}
                      onChange={(e) => setWeightLbs(e.target.value)}
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 transition-colors"
                      placeholder="165"
                      step="0.1"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">lbs</span>
                  </div>
                )}
              </div>
            )}

            {/* Age (for BMI method) */}
            {method === 'bmi' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('age')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 transition-colors"
                    placeholder="30"
                    min="18"
                    max="100"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">{t('years')}</span>
                </div>
              </div>
            )}

            {/* Navy Method Measurements */}
            {method === 'navy' && (
              <>
                {/* Waist */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('waist')} <span className="text-gray-400 text-xs">({t('waistHint')})</span>
                  </label>
                  {unitSystem === 'metric' ? (
                    <div className="relative">
                      <input
                        type="number"
                        value={waist}
                        onChange={(e) => setWaist(e.target.value)}
                        className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 transition-colors"
                        placeholder="85"
                        step="0.5"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">cm</span>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="number"
                        value={waistInches}
                        onChange={(e) => setWaistInches(e.target.value)}
                        className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 transition-colors"
                        placeholder="33.5"
                        step="0.25"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">in</span>
                    </div>
                  )}
                </div>

                {/* Neck */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('neck')} <span className="text-gray-400 text-xs">({t('neckHint')})</span>
                  </label>
                  {unitSystem === 'metric' ? (
                    <div className="relative">
                      <input
                        type="number"
                        value={neck}
                        onChange={(e) => setNeck(e.target.value)}
                        className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 transition-colors"
                        placeholder="38"
                        step="0.5"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">cm</span>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="number"
                        value={neckInches}
                        onChange={(e) => setNeckInches(e.target.value)}
                        className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 transition-colors"
                        placeholder="15"
                        step="0.25"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">in</span>
                    </div>
                  )}
                </div>

                {/* Hip (females only) */}
                {gender === 'female' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('hip')} <span className="text-gray-400 text-xs">({t('hipHint')})</span>
                    </label>
                    {unitSystem === 'metric' ? (
                      <div className="relative">
                        <input
                          type="number"
                          value={hip}
                          onChange={(e) => setHip(e.target.value)}
                          className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 transition-colors"
                          placeholder="95"
                          step="0.5"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">cm</span>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="number"
                          value={hipInches}
                          onChange={(e) => setHipInches(e.target.value)}
                          className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 transition-colors"
                          placeholder="37.5"
                          step="0.25"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">in</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Optional Weight for Mass calculations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('weight')} <span className="text-gray-400 text-xs">({t('optionalForMass')})</span>
                  </label>
                  {unitSystem === 'metric' ? (
                    <div className="relative">
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 transition-colors"
                        placeholder="75"
                        step="0.1"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">kg</span>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="number"
                        value={weightLbs}
                        onChange={(e) => setWeightLbs(e.target.value)}
                        className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 transition-colors"
                        placeholder="165"
                        step="0.1"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">lbs</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="mt-6 space-y-4">
              {/* Main Result */}
              <div className={`p-5 rounded-xl border-2 ${result.category.bgColor} ${result.category.borderColor}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className={`w-6 h-6 ${result.category.color}`} />
                  <span className={`text-sm font-medium ${result.category.color}`}>
                    {result.category.name}
                  </span>
                </div>
                <div className={`text-4xl font-bold mb-2 ${result.category.color}`}>
                  {result.bodyFat.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">
                  {t('bodyFatPercentage')}
                </div>
              </div>

              {/* Body Fat Scale */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-600 mb-2">{t('bodyFatScale')}</div>
                <div className="h-4 rounded-full flex overflow-hidden">
                  <div className="bg-red-400 flex-1" title={t('categoryEssential')}></div>
                  <div className="bg-blue-400 flex-1" title={t('categoryAthlete')}></div>
                  <div className="bg-green-400 flex-1" title={t('categoryFitness')}></div>
                  <div className="bg-yellow-400 flex-1" title={t('categoryAcceptable')}></div>
                  <div className="bg-red-500 flex-1" title={t('categoryObese')}></div>
                </div>
                <div className="relative h-6 mt-1">
                  <div
                    className="absolute w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-gray-800 -translate-x-1/2"
                    style={{ left: `${Math.min(100, Math.max(0, (result.bodyFat / 50) * 100))}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>10%</span>
                  <span>20%</span>
                  <span>30%</span>
                  <span>40%</span>
                  <span>50%</span>
                </div>
              </div>

              {/* Breakdown */}
              {result.leanMass !== null && result.fatMass !== null && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="text-xs text-green-600 mb-1">{t('leanMass')}</div>
                    <div className="text-2xl font-bold text-green-700">
                      {result.leanMass.toFixed(1)} {unitSystem === 'metric' ? 'kg' : 'lbs'}
                    </div>
                    <div className="text-xs text-green-600">
                      {(100 - result.bodyFat).toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="text-xs text-orange-600 mb-1">{t('fatMass')}</div>
                    <div className="text-2xl font-bold text-orange-700">
                      {result.fatMass.toFixed(1)} {unitSystem === 'metric' ? 'kg' : 'lbs'}
                    </div>
                    <div className="text-xs text-orange-600">
                      {result.bodyFat.toFixed(1)}%
                    </div>
                  </div>
                </div>
              )}

              {/* Method Info */}
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="text-sm text-purple-600 font-medium mb-1">
                  {result.method === 'navy' ? t('navyMethodFull') : t('bmiMethodFull')}
                </div>
                <div className="text-xs text-purple-700">
                  {result.method === 'navy' ? t('navyMethodNote') : t('bmiMethodNote')}
                </div>
              </div>
            </div>
          )}

          {!result && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-center">
              <p className="text-sm text-yellow-800">{t('invalidInput')}</p>
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

          {/* How To Measure */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('howTo')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('howToMeasure')}</h2>
              {expandedSections.howTo ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.howTo && (
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">
                  {t('howToMeasureContent')}
                </p>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('categories')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('categoriesTitle')}</h2>
              {expandedSections.categories ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.categories && (
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">
                  {t('categoriesContent')}
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
