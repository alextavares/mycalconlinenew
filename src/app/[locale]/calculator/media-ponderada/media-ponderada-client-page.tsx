'use client';

import React, {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Plus, Trash2} from 'lucide-react';

interface ValueWeightPair {
  id: string; 
  value: string;
  weight: string;
}

export default function MediaPonderadaClientPage() {
  const t = useTranslations('WeightedAverageCalculator');
  const [pairs, setPairs] = useState<ValueWeightPair[]>([{ id: Date.now().toString(), value: '', weight: '' }]);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const handlePairChange = (index: number, type: 'value' | 'weight', event: React.ChangeEvent<HTMLInputElement>) => {
    const newPairs = [...pairs];
    newPairs[index][type] = event.target.value;
    setPairs(newPairs);
    setResult(null); 
    setError(''); 
  };

  const addPair = () => {
    setPairs([...pairs, { id: Date.now().toString(), value: '', weight: '' }]);
    setError('');
  };

  const removePair = (index: number) => {
    const newPairs = pairs.filter((_, i) => i !== index);
    setPairs(newPairs);
    setResult(null);
    setError('');
  };

  const calculateMediaPonderada = () => {
    setError('');
    setResult(null);

    if (pairs.length === 0) {
      setError(t('errorNoPairs'));
      return;
    }

    let weightedSum = 0;
    let weightSum = 0;
    let hasValidInput = false;

    for (const item of pairs) {
      const valueStr = item.value.replace(',', '.');
      const weightStr = item.weight.replace(',', '.');

      if (valueStr.trim() === '' && weightStr.trim() === '') {
        continue; 
      }
      
      const value = parseFloat(valueStr);
      const weight = parseFloat(weightStr);

      if (isNaN(value) || isNaN(weight) || weight < 0) {
        setError(t('errorInput'));
        setResult(null);
        return;
      }
      
      if (valueStr.trim() !== '' || weightStr.trim() !== '') {
        hasValidInput = true;
      }

      weightedSum += value * weight;
      weightSum += weight;
    }

    if (!hasValidInput && pairs.length > 0 && pairs.every(p => p.value === '' && p.weight === '')) {
      setError(t('errorNoPairs')); 
      return;
    }
    
    if (weightSum === 0) {
      let allValuesTimesWeightsAreZero = true;
      for (const item of pairs) {
        const v = parseFloat(item.value.replace(',', '.'));
        const w = parseFloat(item.weight.replace(',', '.'));
        if (v * w !== 0 && !isNaN(v) && !isNaN(w)) {
          allValuesTimesWeightsAreZero = false;
          break;
        }
      }

      if (allValuesTimesWeightsAreZero && hasValidInput) {
        setResult(0); 
      } else {
        setError(t('errorSumOfWeightsZero'));
        setResult(null);
        return;
      }
    }
    
    if (weightSum !== 0) {
        setResult(weightedSum / weightSum);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto my-8">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {pairs.map((item, index) => (
          <div key={item.id} className="flex items-end space-x-2 p-3 border rounded-md relative">
            <div className="grid gap-1.5 flex-grow">
              <Label htmlFor={`value-${index}`}>{t('valueLabel')} {index + 1}</Label>
              <Input
                type="text" 
                inputMode="decimal"
                id={`value-${index}`}
                placeholder={t('valuePlaceholder') || t('valueLabel')}
                value={item.value}
                onChange={(event) => handlePairChange(index, 'value', event)}
              />
            </div>
            <div className="grid gap-1.5 flex-grow">
              <Label htmlFor={`weight-${index}`}>{t('weightLabel')} {index + 1}</Label>
              <Input
                type="text" 
                inputMode="decimal"
                id={`weight-${index}`}
                placeholder={t('weightPlaceholder') || t('weightLabel')}
                value={item.weight}
                onChange={(event) => handlePairChange(index, 'weight', event)}
              />
            </div>
            {pairs.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removePair(index)}
                aria-label={t('removePairButtonLabel') || `Remove item ${index + 1}`}
                className="self-center"
              >
                <Trash2 className="h-4 w-4 text-red-500"/>
              </Button>
            )}
          </div>
        ))}
        <Button variant="outline" onClick={addPair} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4"/>
          {t('addPairButton')}
        </Button>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {result !== null && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md text-center">
            <p className="text-sm text-green-700">
              {t('resultLabel')} <span className="font-bold text-lg">{result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}</span>
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
          <Button onClick={calculateMediaPonderada} size="lg">{t('calculateButton')}</Button>
      </CardFooter>
    </Card>
  );
}
