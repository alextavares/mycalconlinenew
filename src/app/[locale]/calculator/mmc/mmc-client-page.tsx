'use client'
import { useState, ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

// Helper functions (gcd, lcm, calculateMMCInternal) - podem ficar aqui ou em utils
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  const commonDivisor = gcd(a, b);
  return commonDivisor === 0 ? 0 : Math.abs(a * b) / commonDivisor;
}

function calculateMMCInternal(numbers: number[]): number | null {
  const positiveIntegers = numbers.filter(num => Number.isInteger(num) && num > 0);
  if (positiveIntegers.length === 0) return null;
  if (positiveIntegers.length === 1) return positiveIntegers[0];

  let currentLcm = positiveIntegers[0];
  for (let i = 1; i < positiveIntegers.length; i++) {
    currentLcm = lcm(currentLcm, positiveIntegers[i]);
    if (!Number.isSafeInteger(currentLcm)) return Infinity;
  }
  return currentLcm;
}

export default function MMCClientPage() {
  const t = useTranslations('MMCCalculator');
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [calculatedForNumbers, setCalculatedForNumbers] = useState<string>('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInput(value);
    setError('');
    setResult(null);
    setCalculatedForNumbers('');
  };

  const calculate = () => {
    setError('');
    setResult(null);
    setCalculatedForNumbers('');

    const rawNumbers = input.split(/[\s,]+/).map(s => s.trim()).filter(s => s !== '');
    if (rawNumbers.length === 0) {
        setError(t('errorInvalidInput'));
        return;
    }

    const parsedNumbers: number[] = [];
    for (const numStr of rawNumbers) {
        const num = parseInt(numStr, 10);
        if (isNaN(num)) {
            setError(t('errorInvalidInput'));
            return;
        }
        if (num <= 0) {
            setError(t('errorNonPositive'));
            return;
        }
        parsedNumbers.push(num);
    }

    if (parsedNumbers.length < 2) {
      setError(t('errorNotEnoughNumbers'));
      return;
    }

    const calculatedResult = calculateMMCInternal(parsedNumbers);

    if (calculatedResult === null) {
        setError(t('errorInvalidInput'));
    } else if (calculatedResult === Infinity) {
        setError(t('errorOverflow') || 'Calculation resulted in a number too large to represent accurately.');
        setResult(null);
    } else {
        setResult(calculatedResult);
        setCalculatedForNumbers(parsedNumbers.join(', '));
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto my-8">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="mmc-numbers" className="mb-1.5 block">{t('inputLabel')}</Label>
          <Input
            id="mmc-numbers"
            type="text"
            placeholder={t('inputPlaceholder')}
            value={input}
            onChange={handleInputChange}
            aria-describedby={error ? "mmc-error-alert" : (result !== null ? "mmc-result-alert" : undefined)}
          />
        </div>
        {error && (
            <Alert variant="destructive" id="mmc-error-alert">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Erro!</AlertTitle> {/* Você pode querer uma tradução para "Erro!" */}
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {result !== null && (
          <Alert variant="default" id="mmc-result-alert" className="bg-green-50 border-green-200">
            <Terminal className="h-4 w-4" />
            <AlertTitle className="font-semibold">
                {t('resultLabel')} {calculatedForNumbers} {t('resultLabelFor')}
            </AlertTitle>
            <AlertDescription className="text-2xl font-bold text-green-700">
                {result.toLocaleString()}
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-4 pt-4 border-t">
            <div>
                <h3 className="font-semibold text-md mb-1">{t('howToUseTitle')}</h3>
                <p className="text-sm text-gray-600">{t('howToUseDetail')}</p>
            </div>
            <div>
                <h3 className="font-semibold text-md mb-1">{t('whatIsMMCTitle')}</h3>
                <p className="text-sm text-gray-600">{t('whatIsMMCDetail')}</p>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={calculate} size="lg">{t('calculateButton')}</Button>
      </CardFooter>
    </Card>
  );
}
