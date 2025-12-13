'use client'
import { useState, ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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

function primeFactorization(num: number): { [factor: number]: number } {
  const factors: { [factor: number]: number } = {};
  let n = num;

  while (n % 2 === 0) {
    factors[2] = (factors[2] || 0) + 1;
    n /= 2;
  }

  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    while (n % i === 0) {
      factors[i] = (factors[i] || 0) + 1;
      n /= i;
    }
  }

  if (n > 2) {
    factors[n] = (factors[n] || 0) + 1;
  }

  return factors;
}

interface ResultAlertProps {
  result: number;
  calculatedForNumbers: string;
  t: any; // TODO: type this correctly
  numbers: number[];
}

function ResultAlert({ result, calculatedForNumbers, t, numbers }: ResultAlertProps) {
  return (
    <Alert
      variant="default"
      id="mmc-result-alert"
      className="bg-green-50 border-green-200"
    >
      <Terminal className="h-4 w-4 text-green-600" />
      <AlertTitle className="font-semibold text-base md:text-lg">
        {t('resultLabel')} {calculatedForNumbers} {t('resultLabelFor')}
      </AlertTitle>
      <AlertDescription>
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              MMC encontrado
            </p>
            <p className="text-3xl font-extrabold text-green-700">
              {result.toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="text-xs text-gray-600 md:text-right">
            <p>O MMC é o menor número múltiplo de todos os valores informados.</p>
          </div>
        </div>

        {/* Fatoração prima organizada */}
        <div className="mt-4 pt-3 border-t border-green-100">
          <p className="font-semibold text-sm text-gray-800 mb-2">
            Decomposição em fatores primos
          </p>
          <div className="flex flex-wrap gap-2">
            {numbers.map((num) => {
              const factors = primeFactorization(num);
              const factorString = Object.entries(factors)
                .map(([factor, exponent]) =>
                  Number(exponent) === 1
                    ? `${factor}`
                    : `${factor}^${exponent}`
                )
                .join(' × ');

              return (
                <div
                  key={num}
                  className="px-3 py-1.5 rounded-full bg-white border border-green-100 shadow-xs text-xs text-gray-800 flex items-center gap-1"
                >
                  <span className="font-semibold">{num}</span>
                  <span className="text-gray-500">=</span>
                  <span className="font-mono text-[11px] text-gray-700">
                    {factorString || '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}

export default function MMCClientPage() {
  const t = useTranslations('MMCCalculator');
  const params = useParams();
  const locale = params.locale as string;
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [calculatedForNumbers, setCalculatedForNumbers] = useState<string>('');
  const [isValidInput, setIsValidInput] = useState<boolean>(true);
  const [parsedNumbers, setParsedNumbers] = useState<number[]>([]);

  const validateInput = (value: string): string => {
    if (value.trim() === '') {
      return ''; // Allow empty input
    }

    const numbers = value.split(/[\s,\t\n]+/).map(s => s.trim()).filter(s => s !== '');

    for (const numStr of numbers) {
      const num = parseInt(numStr, 10);
      if (isNaN(num)) {
        return t('errorInvalidInput'); //"Please enter only numbers separated by commas or spaces.";
      }
      if (num <= 0) {
        return t('errorNonPositive'); //"Please enter only positive numbers.";
      }
    }

    return '';
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInput(value);
    const validationError = validateInput(value);
    setError(validationError);
    setIsValidInput(!validationError);
    setResult(null);
    setCalculatedForNumbers('');
    setParsedNumbers([]);
  };

  const calculate = () => {
    setError('');
    setResult(null);
    setCalculatedForNumbers('');
    setParsedNumbers([]);

    const rawNumbers = input.split(/[\s,]+/).map(s => s.trim()).filter(s => s !== '');
    if (rawNumbers.length === 0) {
      setError(t('errorInvalidInput')); //"Please enter a list of numbers.";
      return;
    }

    const parsedNumbers: number[] = [];
    for (const numStr of rawNumbers) {
      const num = parseInt(numStr, 10);
      if (isNaN(num)) {
        setError(t('errorInvalidInput')); //"Invalid number format.";
        return;
      }
      if (num <= 0) {
        setError(t('errorNonPositive')); //"Numbers must be positive.";
        return;
      }
      parsedNumbers.push(num);
    }

    if (parsedNumbers.length < 2) {
      setError(t('errorNotEnoughNumbers')); //"Please enter at least two numbers.";
      return;
    }

    setParsedNumbers(parsedNumbers);
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
    <Card className="w-full max-w-3xl mx-auto my-8 shadow-sm">
      <CardHeader>
        {/* H1 forte para SEO */}
        <CardTitle>
          <h1 className="text-2xl md:text-3xl font-bold">
            {t('title')}
          </h1>
        </CardTitle>
        <CardDescription className="text-base md:text-lg">
          {t('description')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Bloco principal da calculadora */}
        <section aria-label={t('inputLabel')} className="space-y-2">
          <Label htmlFor="mmc-numbers" className="mb-1.5 block font-medium">
            {t('inputLabel')}
          </Label>
          <Input
            id="mmc-numbers"
            type="text"
            placeholder={t('inputPlaceholder')}
            value={input}
            onChange={handleInputChange}
            aria-describedby={
              error
                ? 'mmc-error-alert'
                : result !== null
                ? 'mmc-result-alert'
                : undefined
            }
            className="border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-300"
          />
          {/* Chips com os números reconhecidos */}
          {parsedNumbers.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {parsedNumbers.map((num, idx) => (
                <span
                  key={`${num}-${idx}`}
                  className="px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs text-purple-800 font-medium"
                >
                  {num}
                </span>
              ))}
            </div>
          )}
          {!isValidInput && error && (
            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          )}
          {!error && (
            <p className="mt-1 text-xs text-gray-500">
              Exemplo rápido: 6 8 12 24 — o MMC será calculado considerando todos esses valores.
            </p>
          )}
        </section>

        {/* Botão destacado */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2">
          <Button
            onClick={calculate}
            size="lg"
            disabled={!isValidInput}
            className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-sm"
          >
            {t('calculateButton')}
          </Button>
        </div>

        {/* Mensagens de erro e resultado */}
        {error && (
          <Alert
            variant="destructive"
            id="mmc-error-alert"
            className="mt-2"
          >
            <Terminal className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result !== null && !error && (
          <ResultAlert
            result={result}
            calculatedForNumbers={calculatedForNumbers}
            t={t}
            numbers={parsedNumbers}
          />
        )}

        {/* Conteúdo explicativo otimizado para SEO */}
        <section
          aria-labelledby="mmc-how-to"
          className="space-y-4 pt-6 border-t"
        >
          <div>
            <h2
              id="mmc-how-to"
              className="font-semibold text-lg mb-1"
            >
              {t('howToUseTitle')}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {t('howToUseDetail')}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">
              {t('whatIsMMCTitle')}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {t('whatIsMMCDetail')}
            </p>
          </div>
        </section>

        {/* FAQ com headings escaneáveis */}
        <section
          aria-labelledby="mmc-faq"
          className="space-y-3 pt-4"
        >
          <h2
            id="mmc-faq"
            className="font-semibold text-lg mb-1"
          >
            {t('faqTitle')}
          </h2>
          <div className="space-y-2">
            <div>
              <h3 className="font-semibold text-sm">
                {t('faqQ1')}
              </h3>
              <p className="text-sm text-gray-700">
                {t('faqA1')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm">
                {t('faqQ2')}
              </h3>
              <p className="text-sm text-gray-700">
                {t('faqA2')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm">
                {t('faqQ3')}
              </h3>
              <p className="text-sm text-gray-700">
                {t('faqA3')}
              </p>
            </div>
          </div>
        </section>
      {/* Related Calculators */}
      <div className="mt-8 pt-6 border-t">
        <h2 className="font-semibold text-lg mb-3">{t('relatedTitle')}</h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-600">
          <li>
            <Link href={`/${locale}/calculator/fracoes`} className="hover:underline">
              {t('relatedFractions')}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/calculator/porcentagem`} className="hover:underline">
              {t('relatedPercentage')}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/calculator/regra-de-3`} className="hover:underline">
              {t('relatedRuleOfThree')}
            </Link>
          </li>
        </ul>
      </div>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: t('faqQ1'),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: t('faqA1')
                }
              },
              {
                "@type": "Question",
                name: t('faqQ2'),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: t('faqA2')
                }
              },
              {
                "@type": "Question",
                name: t('faqQ3'),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: t('faqA3')
                }
              }
            ]
          })
        }}
      />
      </CardContent>
    </Card>
  );
}
