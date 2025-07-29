'use client';
import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface StatisticsResult {
  mean: number | null;
  median: number | null;
  mode: number[] | null;
}

const calculateUnGroupedStatistics = (data: number[]): StatisticsResult => {
    if (data.length === 0) {
        return { mean: null, median: null, mode: null };
    }

    const mean = data.reduce((sum, value) => sum + value, 0) / data.length;

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
    if(Object.values(frequencyMap).every(value => value === 1)) return {mean, median, mode: null}

    return { mean, median, mode: modes };
};

const StatisticsCalculator: React.FC = () => {
  const t = useTranslations('MeanMedianModeCalculator');
  const locale = useLocale();
  const [selectedDataType, setSelectedDataType] = useState<string>(t('ungroupedOption'));
  const [dataInput, setDataInput] = useState<string>('');
  const [statistics, setStatistics] = useState<StatisticsResult>({ mean: null, median: null, mode: null });

  const calculateStatistics = () => {
    if(selectedDataType === t('ungroupedOption')){
      const data = dataInput.split(';')
        .map((item) => item.trim())
        .filter(item => item.length > 0)
        .map(Number)
        .filter(num => !isNaN(num));
        
      if (data.length === 0) {
        alert(t('alertMessage'));
        return;
      }
      
      const result = calculateUnGroupedStatistics(data);
      setStatistics(result);
    } else {
      alert(t('notImplemented'));
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      <p className="mb-4">{t('description')}</p>
      
      <div className="flex gap-4">
        <div className="">
          <Card>
            <CardHeader>
              <CardTitle>{t('calculateButton')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-4">
                <Label htmlFor="data-type">{t('dataTypeLabel')}</Label>
                <Select onValueChange={setSelectedDataType}>
                  <SelectTrigger id="data-type">
                    <SelectValue placeholder={t('ungroupedOption')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={t('ungroupedOption')}>{t('ungroupedOption')}</SelectItem>
                    <SelectItem value={t('groupedOption')}>{t('groupedOption')}</SelectItem>
                  </SelectContent>
                </Select>
                
                <Label htmlFor="data-input">{t('dataInputLabel')}</Label>
                <Textarea
                  className="resize-none"
                  id="data-input"
                  placeholder={t('dataInputPlaceholder')}
                  value={dataInput}
                  onChange={(e) => setDataInput(e.target.value)}
                />
              </div>
              
              <Button onClick={calculateStatistics} className="w-full mt-4">
                {t('calculateButton')}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>{t('resultsTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <p>{t('meanLabel')}</p>
                <p>{statistics.mean !== null ? statistics.mean.toLocaleString(locale) : t('noData')}</p>
              </div>
              <div className="flex justify-between">
                <p>{t('medianLabel')}</p>
                <p>{statistics.median !== null ? statistics.median.toLocaleString(locale) : t('noData')}</p>
              </div>
              <div className="flex justify-between">
                <p>{t('modeLabel')}</p>
                <p>{statistics.mode !== null ? statistics.mode.map(String).join(', ') : t('noData')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCalculator;
