'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

export default function AreaDoQuadradoCalculator() {
  const [sideLength, setSideLength] = useState<number | null>(null);
  const [area, setArea] = useState<number | null>(null);

  const calculateArea = () => {
    if (sideLength !== null) {
      setArea(sideLength * sideLength);
    } else {
      setArea(null);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '') {
        setSideLength(null);
    } else {
        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue)) {
          setSideLength(parsedValue);
        }
    }
  };

  return (
    <div className="container max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Área do Quadrado</CardTitle>
          <CardDescription>Insira o comprimento do lado para calcular a área ou superfície do quadrado. Use um ponto como separador decimal.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="side-length">Comprimento do Lado (a)</Label>
            <Input
              id="side-length"
              type="number"
              placeholder="5"
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
            <Button onClick={calculateArea}>Calcular</Button>
        </CardFooter>
      </Card>
      {area !== null && (
        <div className="mt-4">
            <Card className='bg-amber-50'>
                <CardContent>
                    <p className='font-bold'>A área do quadrado é: <span className='text-2xl'>{area.toFixed(2)}</span></p>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
