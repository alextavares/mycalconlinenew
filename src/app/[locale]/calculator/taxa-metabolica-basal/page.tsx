'use client';
import { useState, useCallback, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface FormData {
  altura: string;
  peso: string;
  idade: string;
  sexo: 'Masculino' | 'Feminino';
  atividadeFisica:
    | 'Leve (1-3 vezes por semana)'
    | 'Moderado (3-5 vezes por semana)'
    | 'Intenso (6-7 vezes por semana)'
    | 'Muito Intenso (2 vezes por dia)';
}

interface ResultData {
  tmb: number;
  perder1kg: number;
  perder2kg: number;
  perder3kg: number;
  perder4kg: number;
}

export default function TMB() {
  const [formData, setFormData] = useState<FormData>({
    altura: '',
    peso: '',
    idade: '',
    sexo: 'Masculino',
    atividadeFisica: 'Leve (1-3 vezes por semana)',
  });
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const handleInputChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  }, [error]);

  const handleSelectChange = useCallback((id: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value as any }));
    if (error) setError('');
  }, [error]);

  const calcularTMB = useCallback(async () => {
    setIsCalculating(true);
    setError('');
    
    try {
      const { altura, peso, idade, sexo } = formData;

      // Enhanced validation
      if (!altura.trim() || !peso.trim() || !idade.trim() || !sexo) {
        throw new Error('Por favor, preencha todos os campos.');
      }

      // Clean inputs (remove spaces, handle comma as decimal separator)
      const cleanAltura = altura.trim().replace(',', '.');
      const cleanPeso = peso.trim().replace(',', '.');
      const cleanIdade = idade.trim().replace(',', '.');

      const pesoNum = parseFloat(cleanPeso);
      const alturaNum = parseFloat(cleanAltura);
      const idadeNum = parseFloat(cleanIdade);

      // Enhanced numeric validation
      if (isNaN(pesoNum) || isNaN(alturaNum) || isNaN(idadeNum)) {
        throw new Error('Por favor, insira valores numéricos válidos.');
      }

      // Realistic range validation
      if (pesoNum <= 0 || pesoNum > 500) {
        throw new Error('Peso deve estar entre 1 e 500 kg.');
      }
      if (alturaNum <= 0 || alturaNum > 300) {
        throw new Error('Altura deve estar entre 1 e 300 cm.');
      }
      if (idadeNum <= 0 || idadeNum > 150) {
        throw new Error('Idade deve estar entre 1 e 150 anos.');
      }

      // Add small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 100));

      // Calculate TMB using Mifflin-St Jeor equation (more accurate)
      let tmb = 0;
      if (sexo === 'Masculino') {
        tmb = 10 * pesoNum + 6.25 * alturaNum - 5 * idadeNum + 5;
      } else {
        tmb = 10 * pesoNum + 6.25 * alturaNum - 5 * idadeNum - 161;
      }

      // Apply activity factor (this was missing from original calculation!)
      const activityFactors = {
        'Leve (1-3 vezes por semana)': 1.375,
        'Moderado (3-5 vezes por semana)': 1.55,
        'Intenso (6-7 vezes por semana)': 1.725,
        'Muito Intenso (2 vezes por dia)': 1.9
      };

      const activityFactor = activityFactors[formData.atividadeFisica];
      const tdee = tmb * activityFactor; // Total Daily Energy Expenditure

      // Correct calorie calculations for weight loss
      // 1kg fat = ~7700 calories, so to lose 1kg/month = ~256 cal deficit/day
      const perder1kg = Math.max(1200, tdee - 256); // Minimum 1200 calories
      const perder2kg = Math.max(1200, tdee - 512);
      const perder3kg = Math.max(1200, tdee - 768);
      const perder4kg = Math.max(1200, tdee - 1024);

      setResult({ 
        tmb: Math.round(tmb), 
        perder1kg: Math.round(perder1kg), 
        perder2kg: Math.round(perder2kg), 
        perder3kg: Math.round(perder3kg), 
        perder4kg: Math.round(perder4kg) 
      });

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro no cálculo');
      setResult(null);
    } finally {
      setIsCalculating(false);
    }
  }, [formData]);

  const limparCampos = useCallback(() => {
    setFormData({
      altura: '',
      peso: '',
      idade: '',
      sexo: 'Masculino',
      atividadeFisica: 'Leve (1-3 vezes por semana)',
    });
    setResult(null);
    setError('');
  }, []);

  // Memoized select options for better performance
  const sexoOptions = useMemo(() => [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Feminino', label: 'Feminino' }
  ], []);

  const atividadeOptions = useMemo(() => [
    { value: 'Leve (1-3 vezes por semana)', label: 'Leve (1-3 vezes por semana)' },
    { value: 'Moderado (3-5 vezes por semana)', label: 'Moderado (3-5 vezes por semana)' },
    { value: 'Intenso (6-7 vezes por semana)', label: 'Intenso (6-7 vezes por semana)' },
    { value: 'Muito Intenso (2 vezes por dia)', label: 'Muito Intenso (2 vezes por dia)' }
  ], []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Taxa Metabólica Basal (TMB)</h1>
      <p className="text-center mb-4">
        Insira seus dados para calcular sua taxa metabólica basal em calorias ou gasto
        calórico basal, utilizando as fórmulas de Harris Benedict. Use ponto como
        separador decimal.
      </p>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Calculadora TMB</CardTitle>
          <CardDescription>Insira seus dados</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="altura">Altura (cm)</Label>
            <Input 
              type="number" 
              id="altura" 
              value={formData.altura} 
              onChange={handleInputChange}
              placeholder="Ex: 170"
              min="1"
              max="300"
              step="0.1"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="peso">Peso (kg)</Label>
            <Input 
              type="number" 
              id="peso" 
              value={formData.peso} 
              onChange={handleInputChange}
              placeholder="Ex: 70.5"
              min="1"
              max="500"
              step="0.1"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="idade">Idade (anos)</Label>
            <Input 
              type="number" 
              id="idade" 
              value={formData.idade} 
              onChange={handleInputChange}
              placeholder="Ex: 25"
              min="1"
              max="150"
              step="1"
            />
          </div>
          
          {error && (
            <div className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              ⚠️ {error}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="sexo">Sexo</Label>
            <Select onValueChange={(value) => handleSelectChange('sexo', value)} defaultValue={formData.sexo}>
              <SelectTrigger id="sexo">
                <SelectValue placeholder="Selecione o sexo" />
              </SelectTrigger>
              <SelectContent>
                {sexoOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="atividade-fisica">Atividade Física</Label>
            <Select onValueChange={(value) => handleSelectChange('atividadeFisica', value)} defaultValue={formData.atividadeFisica}>
              <SelectTrigger id="atividade-fisica">
                <SelectValue placeholder="Selecione a atividade física" />
              </SelectTrigger>
              <SelectContent>
                {atividadeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            id="calcular" 
            onClick={calcularTMB}
            disabled={isCalculating}
            className="min-w-[100px]"
          >
            {isCalculating ? '⏳ Calculando...' : '🧮 Calcular'}
          </Button>
          <Button 
            type="reset" 
            id="limpar" 
            variant="outline" 
            onClick={limparCampos}
            disabled={isCalculating}
          >
            🗑️ Limpar
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <div className="mt-6 max-w-lg mx-auto">
          <h2 className='text-center text-2xl font-bold mb-4 text-green-700'>📊 Resultados</h2>
          <Card className="border-green-200">
            <CardContent className="grid gap-4 p-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-lg font-semibold text-blue-800">
                  🔥 <strong>TMB (Taxa Metabólica Basal):</strong> {result.tmb.toLocaleString()} calorias/dia
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Calorias que seu corpo queima em repouso
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-orange-700">🎯 Calorias para perda de peso:</h3>
                
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <p className="font-medium text-green-800">
                    📉 <strong>Perder 1kg/mês:</strong> {result.perder1kg.toLocaleString()} cal/dia
                  </p>
                  <p className="text-xs text-green-600">Déficit saudável de ~256 cal/dia</p>
                </div>
                
                <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                  <p className="font-medium text-yellow-800">
                    📉 <strong>Perder 2kg/mês:</strong> {result.perder2kg.toLocaleString()} cal/dia
                  </p>
                  <p className="text-xs text-yellow-600">Déficit moderado de ~512 cal/dia</p>
                </div>
                
                <div className="bg-orange-50 p-3 rounded border border-orange-200">
                  <p className="font-medium text-orange-800">
                    📉 <strong>Perder 3kg/mês:</strong> {result.perder3kg.toLocaleString()} cal/dia
                  </p>
                  <p className="text-xs text-orange-600">Déficit intenso de ~768 cal/dia</p>
                </div>
                
                <div className="bg-red-50 p-3 rounded border border-red-200">
                  <p className="font-medium text-red-800">
                    📉 <strong>Perder 4kg/mês:</strong> {result.perder4kg.toLocaleString()} cal/dia
                  </p>
                  <p className="text-xs text-red-600">Déficit muito intenso - requer supervisão</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded border text-sm text-gray-600">
                💡 <strong>Nota:</strong> Valores já incluem seu nível de atividade física.
                Nunca consuma menos que 1.200 calorias/dia sem supervisão médica.
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <p className="text-center mt-4">
        Lembre-se sempre de consultar um especialista em nutrição para perder peso de
        forma saudável.
      </p>
    </div>
  );
}

    