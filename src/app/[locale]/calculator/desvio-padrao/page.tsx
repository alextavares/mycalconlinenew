'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input' // Assuming you might want Input later, keeping consistency
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function DesvioPadraoCalculator() {
  const [dataInput, setDataInput] = useState<string>('')
  const [sampleStdDev, setSampleStdDev] = useState<number | string>('-')
  const [populationStdDev, setPopulationStdDev] = useState<number | string>('-')
  const [error, setError] = useState<string>('')

  const calculateStdDev = () => {
    setError('')
    setSampleStdDev('-')
    setPopulationStdDev('-')

    const numbers = dataInput
      .split(';')
      .map(item => item.trim())
      .filter(item => item !== '')
      .map(item => {
        const num = parseFloat(item.replace(',', '.')); // Allow comma as decimal separator
        if (isNaN(num)) {
          throw new Error(`Valor inválido encontrado: "${item}"`);
        }
        return num;
      });

    if (numbers.length < 2) {
        setError('Por favor, insira pelo menos dois números separados por ponto e vírgula.');
        return;
    }

    const n = numbers.length;
    const mean = numbers.reduce((a, b) => a + b) / n;
    const sumSqDiff = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0);

    const sampleVariance = sumSqDiff / (n - 1);
    const populationVariance = sumSqDiff / n;

    setSampleStdDev(Math.sqrt(sampleVariance).toFixed(4));
    setPopulationStdDev(Math.sqrt(populationVariance).toFixed(4));

  };

  const handleCalculateClick = () => {
    try {
        calculateStdDev();
    } catch (e: any) {
        setError(e.message || 'Erro ao processar os dados. Verifique o formato.');
        setSampleStdDev('-');
        setPopulationStdDev('-');
    }
  };

  return (
    <div className="flex justify-center items-start pt-10">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Calculadora de Desvio Padrão</CardTitle>
          <CardDescription>
            Calcule o desvio padrão amostral e populacional de um conjunto de dados.
            Use ponto e vírgula (;) para separar os números. Use ponto (.) como separador decimal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dataInput">Insira dados separados por ; (ponto e vírgula)</Label>
            <Textarea
              id="dataInput"
              placeholder="Ex: 1.5; 2; 3.14; 4; 5.9"
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              rows={4}
            />
          </div>
           {error && (
              <p className="text-sm text-red-600">{error}</p>
           )}
          <Button onClick={handleCalculateClick} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Calcular
          </Button>
        </CardContent>
        <CardFooter className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="w-full space-y-3">
                <div>
                    <p className="text-sm font-medium text-gray-700">Desvio Padrão Amostral (s)</p>
                    <p className="text-lg font-semibold text-gray-900">{sampleStdDev}</p>
                </div>
                <hr/>
                <div>
                    <p className="text-sm font-medium text-gray-700">Desvio Padrão Populacional (σ)</p>
                    <p className="text-lg font-semibold text-gray-900">{populationStdDev}</p>
                </div>
            </div>
        </CardFooter>
      </Card>
    </div>
  )
}
