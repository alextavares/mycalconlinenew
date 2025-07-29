'use client';
import { useState } from "react";
import { useTranslations } from 'next-intl';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

function romanToDecimal(roman: string): number {
  const romanMap: { [key: string]: number } = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  if (!roman) {
    return 0;
  }

  let result = 0;
  let prevValue = 0;

  for (let i = roman.length - 1; i >= 0; i--) {
    const currentValue = romanMap[roman[i]];

    if (currentValue < prevValue) {
      result -= currentValue;
    } else {
      result += currentValue;
    }

    prevValue = currentValue;
  }

  return result;
}

function decimalToRoman(decimal: number, outOfRangeText: string): string {
  if (decimal < 1 || decimal > 3999) {
    if (decimal == 0) {
        return "0";
    }
    return outOfRangeText;
  }

  const romanValues: number[] = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const romanSymbols: string[] = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];

  let result = "";
  let num = decimal;

  for (let i = 0; i < romanValues.length; i++) {
    while (num >= romanValues[i]) {
      result += romanSymbols[i];
      num -= romanValues[i];
    }
  }

  return result;
}

export default function RomanDecimalConverter() {
  const t = useTranslations('RomanDecimalConverter');
  const [romanInput, setRomanInput] = useState("");
  const [decimalOutput, setDecimalOutput] = useState<number | null>(null);
  const [decimalInput, setDecimalInput] = useState("");
  const [romanOutput, setRomanOutput] = useState("");
  const [error, setError] = useState("");

  const handleRomanInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRomanInput(event.target.value.toUpperCase());
  };

  const handleDecimalInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDecimalInput(event.target.value);
  };

  const convertToDecimal = () => {
    try {
        if (!romanInput) {
          setDecimalOutput(null);
          return;
        }
        const result = romanToDecimal(romanInput);
        setDecimalOutput(result);
        setError("");
    } catch(err){
      setError(t('errorInvalidRoman'));
    }
  };

  const convertToRoman = () => {
    try {
      if (!decimalInput) {
        setRomanOutput("");
        setError("");
        return;
      }
      const num = parseInt(decimalInput, 10);
      if (!isNaN(num)) {
        const result = decimalToRoman(num, t('outOfRange'));
          setRomanOutput(result);
          setError("");

      } else {
        setRomanOutput(""); // Clear output on invalid input
        setError(t('errorInvalidDecimal'));
      }
    } catch(err){
      setError(t('errorGeneral')); // General error handling
      setRomanOutput("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-purple-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
            <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center text-gray-800">
                            {t('title')}
                        </CardTitle>
                        <p className="text-center text-gray-600">
                            {t('description')}
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Label htmlFor="roman" className="text-gray-700 font-medium">{t('romanLabel')}</Label>
                            <div className="flex space-x-2 mt-2">
                                <Input
                                    id="roman"
                                    type="text"
                                    value={romanInput}
                                    onChange={handleRomanInputChange}
                                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    placeholder={t('romanPlaceholder')}
                                />
                                <Button onClick={convertToDecimal} className="bg-purple-500 hover:bg-purple-600">
                                    {t('convertButton')}
                                </Button>
                            </div>
                            <div className="mt-2">
                                <Label htmlFor="decimal" className="text-gray-700 font-medium">{t('decimalLabel')}</Label>
                                <div className="border border-gray-300 p-2 rounded-md mt-2 text-gray-800 font-medium min-h-[40px]">
                                    {decimalOutput !== null ? decimalOutput : ""}
                                </div>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="decimalInput" className="text-gray-700 font-medium">{t('decimalLabel')}</Label>
                            <div className="flex space-x-2 mt-2">
                                <Input
                                    id="decimalInput"
                                    type="number" // Use type number for better input handling
                                    value={decimalInput}
                                    onChange={handleDecimalInputChange}
                                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    placeholder={t('decimalPlaceholder')}
                                />
                                <Button onClick={convertToRoman} className="bg-purple-500 hover:bg-purple-600">
                                    {t('convertButton')}
                                </Button>
                            </div>
                            <div className="mt-2">
                                <Label htmlFor="romanOutput" className="text-gray-700 font-medium">{t('romanLabel')}</Label>
                                <div className="border border-gray-300 p-2 rounded-md mt-2 text-gray-800 font-medium min-h-[40px]">
                                    {romanOutput}
                                </div>
                            </div>
                        </div>
                        {error && <div className="text-red-500 text-center mt-4 font-medium">{error}</div>}
                    </CardContent>
                </Card>
              </div>
            </div>
          </div>
  );
}
