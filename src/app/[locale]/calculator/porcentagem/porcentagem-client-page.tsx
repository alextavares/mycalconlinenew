'use client'

import React, { useState, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
// import { CalculatorWrapper } from '@/components/layout/calculator-wrapper' // REMOVIDO PARA TESTE

export default function PorcentagemClientPage() {
  const t = useTranslations('PercentageCalculator');
  const locale = useLocale();

  const [percentValue, setPercentValue] = useState<string>('')
  const [baseValue, setBaseValue] = useState<string>('')
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string>('')

  const sanitizeNumberInput = useCallback((input: string): string => {
    // Remove extra whitespace and handle multiple decimal separators
    return input.trim()
      .replace(/,/g, '.') // Convert all commas to dots
      .replace(/\.+/g, '.') // Replace multiple dots with single dot
      .replace(/^\.|\.$/, '') // Remove leading/trailing dots
  }, [])

  const validateNumberInput = useCallback((value: number, fieldName: string): string | null => {
    // Check for NaN
    if (isNaN(value)) {
      return `${fieldName} deve ser um número válido`
    }
    
    // Check for infinite values
    if (!isFinite(value)) {
      return `${fieldName} não pode ser infinito`
    }
    
    // Check for numbers that are too large for safe calculation
    if (Math.abs(value) > Number.MAX_SAFE_INTEGER) {
      return `${fieldName} muito grande para cálculo preciso (máx: ${Number.MAX_SAFE_INTEGER.toLocaleString()})`
    }
    
    // Reasonable limits for percentage calculations
    if (Math.abs(value) > 1e15) {
      return `${fieldName} muito grande para exibição adequada`
    }
    
    return null
  }, [])

  const calculatePercentage = useCallback(() => {
    setError('')
    setResult(null)

    // Input validation
    if (percentValue.trim() === '' || baseValue.trim() === '') {
        setError(t('errorInvalidInput'));
        return;
    }

    // Sanitize inputs
    const cleanPercentValue = sanitizeNumberInput(percentValue)
    const cleanBaseValue = sanitizeNumberInput(baseValue)
    
    // Parse numbers
    const percent = parseFloat(cleanPercentValue)
    const base = parseFloat(cleanBaseValue)

    // Validate numbers
    const percentError = validateNumberInput(percent, 'Porcentagem')
    if (percentError) {
      setError(percentError)
      return
    }
    
    const baseError = validateNumberInput(base, 'Valor base')
    if (baseError) {
      setError(baseError)
      return
    }
    
    // Warning for extreme values
    if (Math.abs(percent) > 10000) {
      setError('⚠️ Porcentagem muito alta - resultado pode ser inesperado')
      // Continue calculation but with warning
    }
    
    // Calculate with precision control
    const rawResult = (percent / 100) * base
    
    // Handle very small results that might have floating-point precision issues
    const calculatedResult = Math.abs(rawResult) < 1e-10 ? 0 : rawResult
    
    // Additional validation for result
    if (!isFinite(calculatedResult)) {
      setError('Resultado do cálculo é inválido')
      return
    }
    
    setResult(calculatedResult)
  }, [percentValue, baseValue, t, sanitizeNumberInput, validateNumberInput])

  const formatResult = useCallback((value: number): string => {
    // Handle edge cases for display
    if (value === 0) return '0'
    
    // Very small numbers
    if (Math.abs(value) < 1e-10) return '≈ 0'
    
    // Very large numbers - use exponential notation
    if (Math.abs(value) > 1e12) {
      return value.toExponential(3).replace('e+', ' × 10^').replace('e-', ' × 10^-')
    }
    
    // Numbers with many decimal places
    if (Math.abs(value) < 1 && value.toString().includes('.')) {
      const decimalPlaces = Math.min(10, Math.max(2, Math.ceil(-Math.log10(Math.abs(value))) + 2))
      return value.toLocaleString(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimalPlaces
      })
    }
    
    // Standard formatting
    return value.toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 5
    })
  }, [locale])

  return (
    <div className="w-full flex justify-center p-4">
      <div className="w-full max-w-3xl">
        <Card className="w-full my-8">
          <CardHeader>
            {/* H1 semântico forte para SEO */}
            <CardTitle asChild>
              <h1 className="text-2xl md:text-3xl font-bold">
                {t('title')}
              </h1>
            </CardTitle>
            <CardDescription className="text-base md:text-lg">
              {t('description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Linha: Quanto é X% de Y */}
            <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
              <Label htmlFor="percentValue" className="sm:text-right">
                {t('labelPercentValue')}
              </Label>
              <div className="flex items-center col-span-2 space-x-2">
                <Input
                  id="percentValue"
                  type="text"
                  inputMode="decimal"
                  placeholder={t('placeholderPercentValue')}
                  value={percentValue}
                  onChange={(e) => setPercentValue(e.target.value)}
                  className="w-full"
                  aria-label={t('labelPercentValue')}
                />
                <span className="font-semibold">%</span>
              </div>
            </div>

            {/* Campo: valor base */}
            <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
              <Label htmlFor="baseValue" className="sm:text-right">
                {t('labelBaseValue')}
              </Label>
              <Input
                id="baseValue"
                type="text"
                inputMode="decimal"
                placeholder={t('placeholderBaseValue')}
                value={baseValue}
                onChange={(e) => setBaseValue(e.target.value)}
                className="col-span-2"
                aria-label={t('labelBaseValue')}
              />
            </div>

            {/* Mensagens de erro */}
            {error && (
              <div
                className={`text-sm px-3 py-2 rounded-lg border ${
                  error.startsWith('⚠️')
                    ? 'text-orange-700 bg-orange-50 border-orange-200'
                    : 'text-red-700 bg-red-50 border-red-200'
                }`}
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Resultado */}
            {result !== null && (
              <div className="pt-4 text-center bg-green-50 p-4 rounded-lg border border-green-200">
                <h2 className="text-lg font-semibold text-green-800 mb-2">
                  {t('labelResult')}
                </h2>
                <p className="text-2xl font-bold text-green-700">
                  {formatResult(result)}
                </p>

                {/* Fórmula exibida para transparência */}
                <div className="mt-3 text-xs text-gray-600 font-mono bg-white p-2 rounded border">
                  {percentValue}% de {baseValue} = ({percentValue} ÷ 100) × {baseValue} ={' '}
                  {formatResult(result)}
                </div>

                {/* Mensagens adicionais para extremos */}
                {Math.abs(result) > 1e6 && (
                  <p className="text-xs text-orange-600 mt-2">
                    📈 Resultado muito grande - verifique os valores inseridos.
                  </p>
                )}
                {Math.abs(result) < 0.01 && result !== 0 && (
                  <p className="text-xs text-blue-600 mt-2">
                    🔍 Resultado muito pequeno - confira se a porcentagem está correta.
                  </p>
                )}
              </div>
            )}

            {/* CTA principal */}
            <div className="flex justify-end pt-2">
              <Button
                onClick={calculatePercentage}
                className="w-full sm:w-auto"
              >
                {t('buttonCalculate')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Seção explicativa principal */}
        <section
          aria-labelledby="percentage-description"
          className="w-full mt-2 mb-4 p-4 bg-slate-50 rounded-lg shadow-sm border border-slate-200"
        >
          <h2
            id="percentage-description"
            className="text-xl font-semibold mb-3 text-slate-700"
          >
            {t('descriptionTitle')}
          </h2>
          <p
            className="text-sm text-slate-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t.raw('descriptionDetail') }}
          />
        </section>

        {/* Seção: Como usar */}
        <section
          aria-labelledby="percentage-howto"
          className="w-full mb-4 p-4 bg-white rounded-lg border border-slate-200"
        >
          <h2
            id="percentage-howto"
            className="text-lg font-semibold mb-2 text-slate-800"
          >
            {t('howToUseTitle')}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            {t('howToUseDetail')}
          </p>
        </section>

        {/* Seção FAQ */}
        <section
          aria-labelledby="percentage-faq"
          className="w-full mb-8 p-4 bg-white rounded-lg border border-slate-200"
        >
          <h2
            id="percentage-faq"
            className="text-lg font-semibold mb-3 text-slate-800"
          >
            {t('faqTitle')}
          </h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-sm text-slate-900">
                {t('faqQ1')}
              </h3>
              <p className="text-sm text-slate-700">
                {t('faqA1')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900">
                {t('faqQ2')}
              </h3>
              <p className="text-sm text-slate-700">
                {t('faqA2')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900">
                {t('faqQ3')}
              </h3>
              <p className="text-sm text-slate-700">
                {t('faqA3')}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
