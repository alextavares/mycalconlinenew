'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Zap, ChevronDown, ChevronUp, Calculator } from 'lucide-react';

type CalculationMode = 'voltage' | 'current' | 'resistance' | 'power';

export default function OhmsLawClientPage() {
  const t = useTranslations('OhmsLawCalculator');

  const [mode, setMode] = useState<CalculationMode>('voltage');
  const [voltage, setVoltage] = useState<string>('12');
  const [current, setCurrent] = useState<string>('2');
  const [resistance, setResistance] = useState<string>('6');
  const [power, setPower] = useState<string>('24');

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    formulas: false,
    examples: false,
    faq: false
  });

  const modes = [
    { id: 'voltage', label: t('voltage'), symbol: 'V', unit: 'Volts', color: 'yellow' },
    { id: 'current', label: t('current'), symbol: 'I', unit: 'Amps', color: 'blue' },
    { id: 'resistance', label: t('resistance'), symbol: 'R', unit: 'Ohms', color: 'green' },
    { id: 'power', label: t('power'), symbol: 'P', unit: 'Watts', color: 'orange' },
  ];

  const result = useMemo(() => {
    const V = parseFloat(voltage);
    const I = parseFloat(current);
    const R = parseFloat(resistance);
    const P = parseFloat(power);

    if (mode === 'voltage') {
      // V = I × R or V = P / I or V = √(P × R)
      if (!isNaN(I) && !isNaN(R) && I > 0 && R > 0) {
        const calcV = I * R;
        const calcP = I * I * R;
        return { value: calcV, unit: 'V', formula: `V = I × R = ${I} × ${R}`, power: calcP, current: I, resistance: R, voltage: calcV };
      }
      if (!isNaN(P) && !isNaN(I) && I > 0 && P > 0) {
        const calcV = P / I;
        const calcR = P / (I * I);
        return { value: calcV, unit: 'V', formula: `V = P / I = ${P} / ${I}`, power: P, current: I, resistance: calcR, voltage: calcV };
      }
      if (!isNaN(P) && !isNaN(R) && P > 0 && R > 0) {
        const calcV = Math.sqrt(P * R);
        const calcI = Math.sqrt(P / R);
        return { value: calcV, unit: 'V', formula: `V = √(P × R) = √(${P} × ${R})`, power: P, current: calcI, resistance: R, voltage: calcV };
      }
    }

    if (mode === 'current') {
      // I = V / R or I = P / V or I = √(P / R)
      if (!isNaN(V) && !isNaN(R) && R > 0 && V >= 0) {
        const calcI = V / R;
        const calcP = V * V / R;
        return { value: calcI, unit: 'A', formula: `I = V / R = ${V} / ${R}`, power: calcP, current: calcI, resistance: R, voltage: V };
      }
      if (!isNaN(P) && !isNaN(V) && V > 0 && P > 0) {
        const calcI = P / V;
        const calcR = V * V / P;
        return { value: calcI, unit: 'A', formula: `I = P / V = ${P} / ${V}`, power: P, current: calcI, resistance: calcR, voltage: V };
      }
      if (!isNaN(P) && !isNaN(R) && P > 0 && R > 0) {
        const calcI = Math.sqrt(P / R);
        const calcV = Math.sqrt(P * R);
        return { value: calcI, unit: 'A', formula: `I = √(P / R) = √(${P} / ${R})`, power: P, current: calcI, resistance: R, voltage: calcV };
      }
    }

    if (mode === 'resistance') {
      // R = V / I or R = V² / P or R = P / I²
      if (!isNaN(V) && !isNaN(I) && I > 0 && V >= 0) {
        const calcR = V / I;
        const calcP = V * I;
        return { value: calcR, unit: 'Ω', formula: `R = V / I = ${V} / ${I}`, power: calcP, current: I, resistance: calcR, voltage: V };
      }
      if (!isNaN(V) && !isNaN(P) && P > 0 && V > 0) {
        const calcR = (V * V) / P;
        const calcI = P / V;
        return { value: calcR, unit: 'Ω', formula: `R = V² / P = ${V}² / ${P}`, power: P, current: calcI, resistance: calcR, voltage: V };
      }
      if (!isNaN(P) && !isNaN(I) && I > 0 && P > 0) {
        const calcR = P / (I * I);
        const calcV = P / I;
        return { value: calcR, unit: 'Ω', formula: `R = P / I² = ${P} / ${I}²`, power: P, current: I, resistance: calcR, voltage: calcV };
      }
    }

    if (mode === 'power') {
      // P = V × I or P = V² / R or P = I² × R
      if (!isNaN(V) && !isNaN(I) && V >= 0 && I >= 0) {
        const calcP = V * I;
        const calcR = I > 0 ? V / I : 0;
        return { value: calcP, unit: 'W', formula: `P = V × I = ${V} × ${I}`, power: calcP, current: I, resistance: calcR, voltage: V };
      }
      if (!isNaN(V) && !isNaN(R) && R > 0 && V >= 0) {
        const calcP = (V * V) / R;
        const calcI = V / R;
        return { value: calcP, unit: 'W', formula: `P = V² / R = ${V}² / ${R}`, power: calcP, current: calcI, resistance: R, voltage: V };
      }
      if (!isNaN(I) && !isNaN(R) && R > 0 && I >= 0) {
        const calcP = I * I * R;
        const calcV = I * R;
        return { value: calcP, unit: 'W', formula: `P = I² × R = ${I}² × ${R}`, power: calcP, current: I, resistance: R, voltage: calcV };
      }
    }

    return null;
  }, [mode, voltage, current, resistance, power]);

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    if (Math.abs(num) < 0.001) return num.toExponential(3);
    if (Math.abs(num) >= 1000000) return num.toExponential(3);
    return num.toFixed(4).replace(/\.?0+$/, '');
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getColorClasses = (color: string, type: 'bg' | 'border' | 'text') => {
    const colors: Record<string, Record<string, string>> = {
      yellow: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700' },
      green: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700' },
    };
    return colors[color][type];
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
          {/* Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('selectCalculation')}
            </label>
            <div className="grid grid-cols-4 gap-3">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as CalculationMode)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    mode === m.id
                      ? `${getColorClasses(m.color, 'border')} ${getColorClasses(m.color, 'bg')} ${getColorClasses(m.color, 'text')}`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl font-bold">{m.symbol}</div>
                  <div className="text-xs mt-1">{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Formula Display */}
          <div className="p-4 bg-gray-100 rounded-xl text-center mb-6">
            <div className="text-lg font-mono font-bold text-gray-800">
              V = I × R &nbsp;&nbsp;|&nbsp;&nbsp; P = V × I
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {t('formulaDescription')}
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {mode !== 'voltage' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('voltage')} (V) - Volts
                </label>
                <input
                  type="number"
                  value={voltage}
                  onChange={(e) => setVoltage(e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-yellow-200 rounded-xl focus:border-yellow-500 focus:ring-0 transition-colors bg-yellow-50"
                  placeholder="12"
                />
              </div>
            )}
            {mode !== 'current' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('current')} (I) - Amps
                </label>
                <input
                  type="number"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors bg-blue-50"
                  placeholder="2"
                />
              </div>
            )}
            {mode !== 'resistance' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('resistance')} (R) - Ohms
                </label>
                <input
                  type="number"
                  value={resistance}
                  onChange={(e) => setResistance(e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-0 transition-colors bg-green-50"
                  placeholder="6"
                />
              </div>
            )}
            {mode !== 'power' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('power')} (P) - Watts
                </label>
                <input
                  type="number"
                  value={power}
                  onChange={(e) => setPower(e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors bg-orange-50"
                  placeholder="24"
                />
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Main Result */}
              <div className={`p-5 rounded-xl border-2 ${
                getColorClasses(modes.find(m => m.id === mode)?.color || 'blue', 'bg')
              } ${getColorClasses(modes.find(m => m.id === mode)?.color || 'blue', 'border')}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className={`w-5 h-5 ${getColorClasses(modes.find(m => m.id === mode)?.color || 'blue', 'text')}`} />
                  <span className={`text-sm font-medium ${getColorClasses(modes.find(m => m.id === mode)?.color || 'blue', 'text')}`}>
                    {modes.find(m => m.id === mode)?.label}
                  </span>
                </div>
                <div className={`text-4xl font-bold ${getColorClasses(modes.find(m => m.id === mode)?.color || 'blue', 'text')}`}>
                  {formatNumber(result.value)} {result.unit}
                </div>
                <div className="text-sm mt-2 font-mono opacity-75">
                  {result.formula}
                </div>
              </div>

              {/* All Values */}
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200 text-center">
                  <div className="text-xs text-yellow-600 mb-1">V</div>
                  <div className="text-lg font-bold text-yellow-700">{formatNumber(result.voltage)}</div>
                  <div className="text-xs text-yellow-600">Volts</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
                  <div className="text-xs text-blue-600 mb-1">I</div>
                  <div className="text-lg font-bold text-blue-700">{formatNumber(result.current)}</div>
                  <div className="text-xs text-blue-600">Amps</div>
                </div>
                <div className="p-3 bg-green-50 rounded-xl border border-green-200 text-center">
                  <div className="text-xs text-green-600 mb-1">R</div>
                  <div className="text-lg font-bold text-green-700">{formatNumber(result.resistance)}</div>
                  <div className="text-xs text-green-600">Ohms</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-center">
                  <div className="text-xs text-orange-600 mb-1">P</div>
                  <div className="text-lg font-bold text-orange-700">{formatNumber(result.power)}</div>
                  <div className="text-xs text-orange-600">Watts</div>
                </div>
              </div>
            </div>
          )}

          {!result && (
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-center">
              <p className="text-sm text-yellow-800">{t('invalidInput')}</p>
            </div>
          )}
        </div>

        {/* SEO Content Sections */}
        <div className="space-y-4">
          {['whatIs', 'formulas', 'examples', 'faq'].map((section) => (
            <div key={section} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection(section)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-900">{t(`${section}Title`)}</h2>
                {expandedSections[section] ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>
              {expandedSections[section] && (
                <div className="px-6 pb-6">
                  {section === 'faq' ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i}>
                          <h3 className="font-medium text-gray-900 mb-1">{t(`faqQ${i}`)}</h3>
                          <p className="text-gray-600 text-sm">{t(`faqA${i}`)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 leading-relaxed">{t(`${section}Content`)}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
