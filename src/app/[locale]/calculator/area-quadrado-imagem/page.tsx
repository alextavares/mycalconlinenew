'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

export default function AreaQuadradoImagemPage() {
  const [lado, setLado] = useState('');
  const [resultado, setResultado] = useState<number | null>(null);
  const [error, setError] = useState('');

  const calcularArea = () => {
    setError('');
    setResultado(null);
    const ladoNum = parseFloat(lado);

    if (isNaN(ladoNum) || ladoNum <= 0) {
      setError('Por favor, insira um valor válido para o lado.');
      return;
    }

    const area = ladoNum * ladoNum;
    setResultado(area);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Calculadora de Área do Quadrado (Imagem)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lado">Lado (cm)</Label>
            <Input
              id="lado"
              type="number"
              value={lado}
              onChange={(e) => setLado(e.target.value)}
              placeholder="Digite o comprimento do lado"
              min="0"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {resultado !== null && (
            <div className="pt-4">
              <h3 className="font-semibold">Resultado:</h3>
              <p>A área do quadrado é: {resultado.toFixed(2)} cm²</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={calcularArea} className="w-full">
            Calcular
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
