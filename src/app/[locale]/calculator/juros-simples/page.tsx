'use client'

import React, { useState, useCallback, useMemo } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';

interface CalculationResult {
  interest: number;
  finalCapital: number;
  formattedInterest: string;
  formattedFinalCapital: string;
}

const SimpleInterestCalculator: React.FC = () => {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm({
    defaultValues: {
      initialCapital: 1000,
      interestRate: 5.5,
      time: 3,
      timePeriod: 'Anos'
    },
  });

  const onSubmit = useCallback((values: any) => {
    const { initialCapital, interestRate, time, timePeriod } = values;
    
    // Enhanced validation
    const capital = Number(initialCapital);
    const rate = Number(interestRate);
    const timeValue = Number(time);
    
    if (isNaN(capital) || isNaN(rate) || isNaN(timeValue) || 
        capital <= 0 || rate < 0 || timeValue <= 0) {
      setError('Por favor, insira valores válidos nos campos.');
      setResult(null);
      return;
    }
    
    // Clear previous errors
    setError(null);
    
    // Optimized time conversion using lookup
    const timeConverters = {
      'Anos': 1,
      'Meses': 1/12,
      'Dias': 1/365
    } as const;
    
    const timeInYears = timeValue * (timeConverters[timePeriod as keyof typeof timeConverters] || 1);
    
    // Simple interest calculation - I = P * r * t
    const interest = capital * (rate / 100) * timeInYears;
    const finalCapital = capital + interest;
    
    // Store complete result with formatted versions
    setResult({
      interest,
      finalCapital,
      formattedInterest: interest.toFixed(2),
      formattedFinalCapital: finalCapital.toFixed(2)
    });
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Calculadora de Juros Simples</h1>
      <p className="mb-6">Calcule os juros gerados sobre um capital inicial (Ci) de acordo com a taxa de juros anual (r) durante um período de tempo (t). Fórmula de juros simples com exemplo: <b>Use ponto como separador decimal.</b></p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="initialCapital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capital inicial (Ci)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxa de juros anual (r)</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input type="number" placeholder="5.5" {...field} className="w-full"/>
                        <span className="ml-2">%</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo (t)</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input 
                          type="number" 
                          placeholder="3" 
                          {...field} 
                          className="flex-1"
                          min="0.01"
                          step="0.01"
                        />
                        <FormField
                          control={form.control}
                          name="timePeriod"
                          render={({ field: periodField }) => (
                            <Select
                              onValueChange={periodField.onChange}
                              defaultValue={periodField.value}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Unidade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Dias">Dias</SelectItem>
                                <SelectItem value="Meses">Meses</SelectItem>
                                <SelectItem value="Anos">Anos</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className='w-full bg-purple-500 hover:bg-purple-600 text-white'>Calcular</Button>
            </form>
          </Form>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200">
          <h2 className="text-xl font-semibold mb-4 text-amber-900">Resultados</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {result ? (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-lg font-medium text-green-700 mb-2">
                  💰 Juros gerados: <span className="font-bold">R$ {result.formattedInterest}</span>
                </div>
                <div className="text-lg font-medium text-blue-700">
                  🎯 Capital final: <span className="font-bold">R$ {result.formattedFinalCapital}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Fórmula aplicada:</h3>
                <div className="text-sm text-gray-600 font-mono">
                  I = Ci × r × t<br/>
                  I = {form.getValues('initialCapital')} × {(form.getValues('interestRate')/100).toFixed(4)} × {form.getValues('time')}<br/>
                  <span className="text-green-600 font-semibold">I = R$ {result.formattedInterest}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              Preencha os campos e clique em "Calcular" para ver os resultados
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleInterestCalculator;
