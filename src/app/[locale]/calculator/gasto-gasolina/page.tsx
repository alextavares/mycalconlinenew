'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardFooter } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

export default function GastoGasolinaCalculator() {
  const t = useTranslations('Calculators.gasto-gasolina.calculator');
  const [distance, setDistance] = useState<string>('');
  const [efficiency, setEfficiency] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [totalCost, setTotalCost] = useState<number>(0);

  const calculateCost = () => {
    const distanceNum = parseFloat(distance);
    const efficiencyNum = parseFloat(efficiency);
    const priceNum = parseFloat(price);

    if (isNaN(distanceNum) || isNaN(efficiencyNum) || isNaN(priceNum)) {
      setTotalCost(0);
      return;
    }

    const cost = (distanceNum / efficiencyNum) * priceNum;
    setTotalCost(cost);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="distance">{t('distanceLabel')}</Label>
            <div className="flex items-center">
              <Input
                id="distance"
                type="number"
                placeholder="0.0"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="text-right"
              />
              <Select>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder={t('distanceUnit')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kms">{t('distanceUnit')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="efficiency">{t('efficiencyLabel')}</Label>
            <div className="flex items-center">
              <Input
                id="efficiency"
                type="number"
                placeholder="0.0"
                value={efficiency}
                onChange={(e) => setEfficiency(e.target.value)}
                className="text-right"
              />
              <Select>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder={t('efficiencyUnit')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="km/l">{t('efficiencyUnit')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">{t('priceLabel')}</Label>
            <div className="flex items-center">
              <Input
                id="price"
                type="number"
                placeholder="0.0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="text-right"
              />
              <Select>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder={t('priceUnit')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="litro">{t('priceUnit')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={calculateCost} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            {t('calculateButton')}
          </Button>
        </CardContent>
        <CardFooter>
          <div className="w-full p-4 rounded-md bg-amber-50">
            {t('resultText')} {totalCost.toFixed(2)}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
