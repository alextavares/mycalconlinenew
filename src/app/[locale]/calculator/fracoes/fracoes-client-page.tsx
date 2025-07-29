'use client'
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from "@/hooks/use-toast";

interface Fraction {
  numerator: number;
  denominator: number;
}

// Renomeei o componente para seguir a convenção de PascalCase para componentes React
// e para corresponder ao nome do arquivo/rota esperado.
export default function FracoesClientPage() { // Nome do componente alterado
  const t = useTranslations('FractionCalculator');
  const [fraction1, setFraction1] = useState<Fraction>({ numerator: 0, denominator: 1 });
  const [fraction2, setFraction2] = useState<Fraction>({ numerator: 0, denominator: 1 });
  const [operation, setOperation] = useState<'+' | '-' | '*' | '/'>('+');
  const [result, setResult] = useState<Fraction>({ numerator: 0, denominator: 1 });
  const [simplified, setSimplified] = useState<Fraction>({ numerator: 0, denominator: 1 });

  const gcd = (a: number, b: number): number => {
    if (b === 0) {
      return a;
    }
    return gcd(b, a % b);
  };

  const simplifyFraction = (fraction: Fraction): Fraction => {
    if (fraction.denominator === 0) { // Evitar divisão por zero na simplificação
        return { numerator: fraction.numerator, denominator: 0}; // Ou tratar como erro
    }
    const commonDivisor = gcd(Math.abs(fraction.numerator), Math.abs(fraction.denominator));
    const num = fraction.numerator / commonDivisor;
    const den = fraction.denominator / commonDivisor;

    // Garante que o denominador não seja negativo (ex: 2/-3 se torna -2/3)
    if (den < 0) {
        return { numerator: -num, denominator: -den};
    }
    return { numerator: num, denominator: den };
  };

  const handleCalculate = () => {
    if (fraction1.denominator === 0 || fraction2.denominator === 0) {
        alert(t('errorZeroDenominator') || "Denominator cannot be zero.");
        setResult({ numerator: 0, denominator: 1});
        setSimplified({ numerator: 0, denominator: 1});
        return;
    }

    let newResult: Fraction;
    switch (operation) {
      case '+':
        newResult = {
          numerator: fraction1.numerator * fraction2.denominator + fraction2.numerator * fraction1.denominator,
          denominator: fraction1.denominator * fraction2.denominator,
        };
        break;
      case '-':
        newResult = {
          numerator: fraction1.numerator * fraction2.denominator - fraction2.numerator * fraction1.denominator,
          denominator: fraction1.denominator * fraction2.denominator,
        };
        break;
      case '*':
        newResult = {
          numerator: fraction1.numerator * fraction2.numerator,
          denominator: fraction1.denominator * fraction2.denominator,
        };
        break;
      case '/':
        if (fraction2.numerator === 0) { 
            alert(t('errorDivisionByZero') || "Cannot divide by zero fraction."); 
            setResult({ numerator: 0, denominator: 1});
            setSimplified({ numerator: 0, denominator: 1});
            return;
        }
        newResult = {
          numerator: fraction1.numerator * fraction2.denominator,
          denominator: fraction1.denominator * fraction2.numerator,
        };
        break;
      default:
        newResult = { numerator: 0, denominator: 1 };
    }
    setResult(newResult);
    setSimplified(simplifyFraction(newResult));
  };

  const handleClear = () => {
    setFraction1({ numerator: 0, denominator: 1 });
    setFraction2({ numerator: 0, denominator: 1 });
    setOperation('+');
    setResult({ numerator: 0, denominator: 1 });
    setSimplified({ numerator: 0, denominator: 1 });
  };

  const handleSimplify = () => {
    setSimplified(simplifyFraction(result));
  };

  const displayFraction = (fraction: Fraction) => {
    if (fraction.denominator === 0) {
        return t('errorInvalidFraction') || "Invalid Fraction";
    }
    return `${fraction.numerator} / ${fraction.denominator}`;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-8">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">{t('title')}</h1>
        
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="flex items-center justify-center space-x-2">
            <input
              type="number"
              aria-label={t('numerator1Label') || "Numerator 1"}
              value={fraction1.numerator}
              onChange={(e) => setFraction1({ ...fraction1, numerator: parseInt(e.target.value) || 0 })}
              className="border border-gray-300 p-2 w-20 text-center rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-xl">/</span>
            <input
              type="number"
              aria-label={t('denominator1Label') || "Denominator 1"}
              value={fraction1.denominator}
              onChange={(e) => setFraction1({ ...fraction1, denominator: parseInt(e.target.value) || 1 })}
              className="border border-gray-300 p-2 w-20 text-center rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-center">
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as '+' | '-' | '*' | '/')}
              className="border border-gray-300 p-2 w-16 text-center rounded focus:ring-2 focus:ring-blue-500"
              aria-label={t('operationLabel') || "Operation"}
            >
              <option value="+">+</option>
              <option value="-">-</option>
              <option value="*">*</option>
              <option value="/">/</option>
            </select>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <input
              type="number"
              aria-label={t('numerator2Label') || "Numerator 2"}
              value={fraction2.numerator}
              onChange={(e) => setFraction2({ ...fraction2, numerator: parseInt(e.target.value) || 0 })}
              className="border border-gray-300 p-2 w-20 text-center rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-xl">/</span>
            <input
              type="number"
              aria-label={t('denominator2Label') || "Denominator 2"}
              value={fraction2.denominator}
              onChange={(e) => setFraction2({ ...fraction2, denominator: parseInt(e.target.value) || 1 })}
              className="border border-gray-300 p-2 w-20 text-center rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="text-center my-6">
          <span className="text-2xl font-semibold">= {displayFraction(simplified)}</span>
          { (result.numerator !== simplified.numerator || result.denominator !== simplified.denominator) && result.denominator !== 0 &&
            <span className="block text-sm text-gray-600">({t('unsimplifiedLabel') || "Unsimplified"}: {displayFraction(result)})</span>
          }
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
          <button 
            onClick={handleCalculate} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150"
          >
            {t('calculateButton')}
          </button>
          <button 
            onClick={handleClear} 
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-150"
          >
            {t('clearButton')}
          </button>
           <button 
             onClick={handleSimplify} 
             className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition duration-150"
           >
             {t('simplifyButton')}
           </button>
        </div>

        <div className="mt-10 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h2 className="text-xl font-semibold mb-3 text-slate-700">{t('descriptionTitle') || 'About Fraction Calculator'}</h2>
          <p className="text-slate-600 mb-4 text-sm" dangerouslySetInnerHTML={{ __html: t.raw('description') }}></p>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-slate-700">{t('howToAdd.title')}</h3>
            <div className="mb-3">
              <h4 className="font-medium mb-1 text-slate-600">{t('howToAdd.sameDenominator')}</h4>
              <p className="text-slate-600 mb-1 text-sm" dangerouslySetInnerHTML={{ __html: t.raw('howToAdd.sameDenominatorText') }}></p>
              <p className="text-slate-500 italic text-xs" dangerouslySetInnerHTML={{ __html: t.raw('howToAdd.example1') }}></p>
            </div>
            <div>
              <h4 className="font-medium mb-1 text-slate-600">{t('howToAdd.differentDenominator')}</h4>
              <p className="text-slate-600 mb-1 text-sm" dangerouslySetInnerHTML={{ __html: t.raw('howToAdd.differentDenominatorText') }}></p>
              <p className="text-slate-500 italic text-xs" dangerouslySetInnerHTML={{ __html: t.raw('howToAdd.example2') }}></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
