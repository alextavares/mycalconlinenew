'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalculatorWrapper } from '@/components/layout/calculator-wrapper'

export default function AreaQuadradoCalculator() {
  const t = useTranslations('AreaQuadradoCalculator');
  
  const translations = {
    title: t('title'),
    description: t('description'),
    sideLabel: t('sideLabel'),
    sidePlaceholder: t('sidePlaceholder'),
    calculateButton: t('calculateButton'),
    resultText: t('resultText'),
    errorInvalidInput: t('errorInvalidInput')
  };
  
  const [side, setSide] = useState<string>('')
  const [area, setArea] = useState<number | null>(null)
  const [error, setError] = useState<string>('')

  const calculateArea = () => {
    setError('')
    setArea(null)
    const a = parseFloat(side)

    if (isNaN(a) || a <= 0) {
      setError(translations.errorInvalidInput)
      return
    }

    const calculatedArea = Math.pow(a, 2)
    setArea(calculatedArea)
  }

  return (
    <CalculatorWrapper title={translations.title}>
      <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-purple-600">{translations.title}</CardTitle>
          <CardDescription>{translations.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex justify-center items-center">
            <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <rect x="25" y="25" width="100" height="100" stroke="currentColor" strokeWidth="2"/>
              <text x="70" y="20" fontSize="16" fill="currentColor" className="font-sans">a</text>
              <text x="70" y="145" fontSize="16" fill="currentColor" className="font-sans">a</text>
              <text x="5" y="80" fontSize="16" fill="currentColor" className="font-sans">a</text>
              <text x="130" y="80" fontSize="16" fill="currentColor" className="font-sans">a</text>
            </svg>
          </div>
          <div className="space-y-4 flex flex-col justify-center">
            <div>
              <Label htmlFor="side">{translations.sideLabel}</Label>
              <Input
                id="side"
                type="number"
                placeholder={translations.sidePlaceholder}
                value={side}
                onChange={(e) => setSide(e.target.value)}
                min="0"
                step="any"
                inputMode="decimal"
                className="mt-1"
                aria-invalid={!!error}
                aria-describedby={error ? 'side-error' : undefined}
              />
            </div>
            <Button
              onClick={calculateArea}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              type="button"
            >
              {translations.calculateButton}
            </Button>
            {error && <p id="side-error" className="text-red-500 text-sm mt-2" role="alert">{error}</p>}
            {area !== null && (
              <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-md text-center" aria-live="polite" role="status">
                <p className="text-sm font-medium text-gray-800">{translations.resultText}</p>
                <p className="text-2xl font-bold text-black">{area.toFixed(2)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </CalculatorWrapper>
  )
}
