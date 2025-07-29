
'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function VarianciaEstatisticaCalculator() {
  const [dataInput, setDataInput] = useState<string>('')
  const [sampleVariance, setSampleVariance] = useState<number | string | null>(null)
  const [populationVariance, setPopulationVariance] = useState<number | string | null>(null)
  const [error, setError] = useState<string>('')

  const calculateVariance = () => {
    setError('')
    setSampleVariance(null)
    setPopulationVariance(null)

    if (!dataInput.trim()) {
      setError('Por favor, insira os dados.')
      return
    }

    // Replace commas with dots for decimal consistency, then split
    const dataPointsStr = dataInput.replace(/,/g, '.').split(';')
    const dataPoints = dataPointsStr.map(s => parseFloat(s.trim())).filter(n => !isNaN(n))

    if (dataPoints.length === 0) {
      setError('Nenhum número válido encontrado. Separe os números com ponto e vírgula (;).')
      return
    }

    const n = dataPoints.length
    const mean = dataPoints.reduce((a, b) => a + b, 0) / n
    const squaredDifferences = dataPoints.map(x => (x - mean) ** 2)
    const sumOfSquaredDifferences = squaredDifferences.reduce((a, b) => a + b, 0)

    // Population Variance (σ²)
    const popVar = sumOfSquaredDifferences / n
    setPopulationVariance(popVar.toLocaleString(undefined, { maximumFractionDigits: 5 }))

    // Sample Variance (s²)
    if (n > 1) {
      const sampleVar = sumOfSquaredDifferences / (n - 1)
      setSampleVariance(sampleVar.toLocaleString(undefined, { maximumFractionDigits: 5 }))
    } else {
      setSampleVariance('n < 2') // Not enough data for sample variance
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Calculadora de Variância Estatística</CardTitle>
          <CardDescription>
            Calcule a variância amostral e populacional de um conjunto de dados. Use ponto como separador decimal e ponto e vírgula (;) para separar os valores.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="dataInput">Insira dados separados por ; (ponto e vírgula)</Label>
            <Textarea
              id="dataInput"
              placeholder="Ex: 1;2;3.5;4;5.2"
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              className="mt-1"
              rows={4}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {(sampleVariance !== null || populationVariance !== null) && (
            <Card className="bg-muted/30">
              <CardContent className="p-4 space-y-2">
                <div>
                  <p className="text-sm font-medium">Variância amostral (s²)</p>
                  <p className="text-lg font-semibold">{sampleVariance ?? '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Variância populacional (σ²)</p>
                  <p className="text-lg font-semibold">{populationVariance ?? '-'}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={calculateVariance}>Calcular</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
