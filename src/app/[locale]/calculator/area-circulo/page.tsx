'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AreaCirculoCalculator() {
  const t = useTranslations('CircleAreaCalculator')
  const [radius, setRadius] = useState<string>('')
  const [area, setArea] = useState<number | null>(null)
  const [error, setError] = useState<string>('')

  const calculateArea = () => {
    setError('')
    const r = parseFloat(radius)

    if (!isNaN(r) && r > 0) {
      const calculatedArea = Math.PI * Math.pow(r, 2)
      setArea(calculatedArea)
    } else {
      setArea(null)
      setError(t('errorInvalidInput', { default: 'Valor inválido. Informe um número maior que zero.' }) as unknown as string)
    }
  }

  return (
    <div className="flex justify-center items-center py-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex justify-center items-center">
            <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <circle cx="75" cy="75" r="60" stroke="currentColor" strokeWidth="2"/>
              <line x1="75" y1="75" x2="135" y2="75" stroke="currentColor" strokeWidth="1" />
              <text x="100" y="70" fontSize="12" fill="currentColor">r</text>
            </svg>
          </div>
          <div className="space-y-4 flex flex-col justify-center">
            <div>
              <Label htmlFor="radius">{t('radiusLabel')}</Label>
              <Input
                id="radius"
                type="number"
                placeholder={t('radiusPlaceholder')}
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                min="0"
                step="any"
                inputMode="decimal"
                aria-invalid={!!error}
                aria-describedby={error ? 'radius-error' : undefined}
              />
            </div>
            <Button onClick={calculateArea} className="w-full bg-purple-600 hover:bg-purple-700 text-white" type="button">
              {t('calculateButton')}
            </Button>
            {error && <p id="radius-error" className="text-red-500 text-sm mt-2" role="alert">{error}</p>}
            {area !== null && (
              <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-md text-center" aria-live="polite" role="status">
                <p className="text-sm font-medium text-gray-800">{t('resultLabel')}</p>
                <p className="text-2xl font-bold text-black">{area.toFixed(2)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
