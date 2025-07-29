
"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function AreaEsferaPage() {
  const t = useTranslations('SphereAreaCalculator');
  const [raio, setRaio] = useState<string>('');
  const [area, setArea] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const calcularArea = () => {
    setError('');
    setArea(null);
    // Replace comma with dot for decimal separator if needed, though parseFloat handles dots by default.
    const r = parseFloat(raio);

    if (isNaN(r) || r <= 0) {
      setError(t('errorInvalidInput'));
      setRaio(''); // Clear invalid input
      return;
    }

    // Fórmula: Área = 4 * π * r²
    const areaCalculada = 4 * Math.PI * Math.pow(r, 2);
    setArea(areaCalculada);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4"> {/* Added padding */}
      {/* Card with max width */}
      <Card className="w-full max-w-lg shadow-lg rounded-lg overflow-hidden"> {/* Increased max-width, added shadow/rounding */}
         <CardHeader className="bg-gray-50 p-6"> {/* Slight background for header */}
          <CardTitle className="text-2xl font-bold text-purple-700">
            {t('title')}
          </CardTitle>
          <CardDescription className="text-gray-600 mt-1">
            {t('description')}
          </CardDescription>
        </CardHeader>

        {/* Main content area with Grid layout */}
        <CardContent className="p-6 grid md:grid-cols-2 gap-6 items-center">
            {/* Left side: Input form */}
            <div className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="raio" className="text-sm font-medium text-gray-700">
                    {t('radiusLabel')}
                    </Label>
                    <Input
                    id="raio"
                    type="number"
                    value={raio}
                    onChange={(e) => setRaio(e.target.value)}
                    placeholder={t('radiusPlaceholder')}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500" // Input styling
                    min="0" // Prevent negative numbers in browser UI
                    step="any" // Allow decimals
                    />
                 </div>
                 <Button
                    onClick={calcularArea}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md shadow transition duration-150 ease-in-out" // Button styling from image
                    >
                    {t('calculateButton')}
                 </Button>
                 {error && <p className="text-red-500 text-sm mt-2">{t('errorInvalidInput')}</p>}
            </div>

             {/* Right side: Result display */}
             <div className={`p-6 rounded-lg ${area !== null ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-100'} min-h-[100px] flex flex-col justify-center items-center`}> {/* Result area styling like image */}
                {area !== null ? (
                <>
                    <span className="text-sm text-gray-600">{t('resultLabel')}</span>
                    <span className="text-3xl font-bold text-gray-800 mt-1">
                    {/* Format number to 2 decimal places like image */}
                    {area.toFixed(2)}
                    </span>
                </>
                ) : (
                    <span className="text-gray-500">{t('waitingResult')}</span>
                )}
            </div>

        </CardContent>

         {/* Optional: Add formula in footer */}
         {/* <CardFooter className="bg-gray-50 p-4 text-center">
           <p className="text-sm text-gray-500">Fórmula usada: Área = 4 * π * r²</p>
         </CardFooter> */}
      </Card>
    </div>
  );
}
