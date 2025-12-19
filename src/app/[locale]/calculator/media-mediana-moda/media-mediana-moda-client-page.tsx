'use client';
import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface StatisticsResult {
  mean: number | null;
  median: number | null;
  mode: number[] | null;
  count: number;
  sum: number;
  min: number | null;
  max: number | null;
}

const calculateUnGroupedStatistics = (data: number[]): StatisticsResult => {
  if (data.length === 0) {
    return { mean: null, median: null, mode: null, count: 0, sum: 0, min: null, max: null };
  }

  const sum = data.reduce((acc, value) => acc + value, 0);
  const mean = sum / data.length;

  const sortedData = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sortedData.length / 2);
  const median = sortedData.length % 2 === 0 ? (sortedData[mid - 1] + sortedData[mid]) / 2 : sortedData[mid];

  const frequencyMap: { [key: number]: number } = {};
  sortedData.forEach(num => {
    frequencyMap[num] = (frequencyMap[num] || 0) + 1;
  });

  let maxFrequency = 0;
  let modes: number[] = [];
  for (const num in frequencyMap) {
    if (frequencyMap[num] > maxFrequency) {
      maxFrequency = frequencyMap[num];
      modes = [Number(num)];
    } else if (frequencyMap[num] === maxFrequency) {
      modes.push(Number(num));
    }
  }
  if (Object.values(frequencyMap).every(value => value === 1)) {
    return { mean, median, mode: null, count: data.length, sum, min: sortedData[0], max: sortedData[sortedData.length - 1] };
  }

  return { mean, median, mode: modes, count: data.length, sum, min: sortedData[0], max: sortedData[sortedData.length - 1] };
};

export default function MediaMedianaModaClientPage() {
  const t = useTranslations('MeanMedianModeCalculator');
  const locale = useLocale();
  const [dataInput, setDataInput] = useState<string>('');
  const [statistics, setStatistics] = useState<StatisticsResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateStatistics = () => {
    setError(null);
    const data = dataInput.split(/[;,\s]+/)
      .map((item) => item.trim())
      .filter(item => item.length > 0)
      .map(Number)
      .filter(num => !isNaN(num));

    if (data.length === 0) {
      setError(t('alertMessage'));
      setStatistics(null);
      return;
    }

    const result = calculateUnGroupedStatistics(data);
    setStatistics(result);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="data-input">{t('dataInputLabel')}</Label>
            <Textarea
              className="resize-none min-h-[100px]"
              id="data-input"
              placeholder={t('dataInputPlaceholder')}
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">{t('inputHint')}</p>
          </div>

          <Button onClick={calculateStatistics} className="w-full" size="lg">
            {t('calculateButton')}
          </Button>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {statistics && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-green-700">{t('resultsTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center border">
                <p className="text-sm text-muted-foreground">{t('meanLabel')}</p>
                <p className="text-2xl font-bold text-blue-600">
                  {statistics.mean !== null ? statistics.mean.toLocaleString(locale, { maximumFractionDigits: 4 }) : t('noData')}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border">
                <p className="text-sm text-muted-foreground">{t('medianLabel')}</p>
                <p className="text-2xl font-bold text-purple-600">
                  {statistics.median !== null ? statistics.median.toLocaleString(locale, { maximumFractionDigits: 4 }) : t('noData')}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border">
                <p className="text-sm text-muted-foreground">{t('modeLabel')}</p>
                <p className="text-2xl font-bold text-green-600">
                  {statistics.mode !== null ? statistics.mode.join(', ') : t('noMode')}
                </p>
              </div>
            </div>

            {/* Additional stats */}
            <div className="mt-4 pt-4 border-t grid grid-cols-4 gap-2 text-center">
              <div>
                <p className="text-xs text-muted-foreground">{t('countLabel')}</p>
                <p className="font-semibold">{statistics.count}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('sumLabel')}</p>
                <p className="font-semibold">{statistics.sum.toLocaleString(locale)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('minLabel')}</p>
                <p className="font-semibold">{statistics.min?.toLocaleString(locale) ?? '-'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('maxLabel')}</p>
                <p className="font-semibold">{statistics.max?.toLocaleString(locale) ?? '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
