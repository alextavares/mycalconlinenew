'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function GastoGasolinaClientPage() {
  const t = useTranslations('GasCalculator');
  const [distance, setDistance] = useState<string>('');
  const [efficiency, setEfficiency] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [result, setResult] = useState<{ cost: number; liters: number } | null>(null);

  const calculateCost = () => {
    const distanceNum = parseFloat(distance);
    const efficiencyNum = parseFloat(efficiency);
    const priceNum = parseFloat(price);

    if (isNaN(distanceNum) || isNaN(efficiencyNum) || isNaN(priceNum) || efficiencyNum === 0) {
      setResult(null);
      return;
    }

    const liters = distanceNum / efficiencyNum;
    const cost = liters * priceNum;
    setResult({ cost, liters });
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="distance">{t('distanceLabel')}</Label>
          <div className="flex items-center gap-2">
            <Input
              id="distance"
              type="number"
              placeholder={t('distancePlaceholder')}
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="text-right"
            />
            <span className="text-sm text-muted-foreground w-16">km</span>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="efficiency">{t('efficiencyLabel')}</Label>
          <div className="flex items-center gap-2">
            <Input
              id="efficiency"
              type="number"
              placeholder={t('efficiencyPlaceholder')}
              value={efficiency}
              onChange={(e) => setEfficiency(e.target.value)}
              className="text-right"
            />
            <span className="text-sm text-muted-foreground w-16">km/l</span>
          </div>
          <p className="text-xs text-muted-foreground">{t('efficiencyHint')}</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="price">{t('priceLabel')}</Label>
          <div className="flex items-center gap-2">
            <Input
              id="price"
              type="number"
              placeholder={t('pricePlaceholder')}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="text-right"
            />
            <span className="text-sm text-muted-foreground w-16">/litro</span>
          </div>
        </div>

        <Button onClick={calculateCost} className="w-full" size="lg">
          {t('calculateButton')}
        </Button>
      </CardContent>

      {result && (
        <CardFooter>
          <div className="w-full space-y-3">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm text-muted-foreground">{t('totalCostLabel')}</p>
              <p className="text-3xl font-bold text-green-700">
                {result.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">{t('litersNeededLabel')}</p>
                <p className="text-xl font-semibold">{result.liters.toFixed(2)} L</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">{t('costPerKmLabel')}</p>
                <p className="text-xl font-semibold">
                  {(result.cost / parseFloat(distance)).toFixed(3)}
                </p>
              </div>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
