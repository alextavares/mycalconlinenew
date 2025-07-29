'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AreaCilindroCalculator() {
  const t = useTranslations('CylinderAreaCalculator')
  const [radius, setRadius] = useState<string>('')
  const [height, setHeight] = useState<string>('')
  const [area, setArea] = useState<number | null>(null)
  const [error, setError] = useState<string>('');

  const calculateArea = () => {
    setError('');
    setArea(null);

    const r = parseFloat(radius);
    const h = parseFloat(height);

    if (isNaN(r) || r <= 0 || isNaN(h) || h <= 0) {
        setError('Por favor, insira valores numéricos positivos para o raio e a altura.');
        return;
    }

    const calculatedArea = 2 * Math.PI * r * (r + h);
    setArea(calculatedArea);
}

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-md bg-card border-muted shadow-md rounded-lg">
        <CardHeader className="bg-secondary p-4 rounded-t-lg">
          <CardTitle className="text-lg font-semibold text-foreground">{t('title')}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="radius" className="text-sm font-medium leading-none">
              {t('radiusLabel')}
            </Label>
            <Input
              type="number"
              id="radius"
              placeholder={t('radiusPlaceholder')}
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="text-sm"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="height" className="text-sm font-medium leading-none">
              {t('heightLabel')}
            </Label>
            <Input
              type="number"
              id="height"
              placeholder={t('heightPlaceholder')}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="text-sm"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{t('errorInvalidInput')}</p>}
          <Button className="bg-blue-500 hover:bg-blue-700 text-white rounded-md p-3 text-sm font-semibold" onClick={calculateArea}>
            {t('calculateButton')}
          </Button>
          {area !== null && (
            <div className="mt-4 p-4 rounded-md bg-accent text-accent-foreground">
              <h2 className="text-base font-semibold">{t('resultLabel')}</h2>
              <p className="text-xl font-bold">{area.toFixed(2)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
