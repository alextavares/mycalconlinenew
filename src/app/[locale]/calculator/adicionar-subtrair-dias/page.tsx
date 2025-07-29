'use client';

import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { format, addDays, subDays, isWeekend, set } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';

type Operacao = 'Adicionar' | 'Subtrair';

interface FormData {
  data: Date;
  operacao: Operacao;
  quantidade: number;
}

export default function CalculadoraDias() {
  const [resultadoData, setResultadoData] = useState<Date | null>(null);
  const [resultadoDataUteis, setResultadoDataUteis] = useState<Date | null>(null);
  const [resultadoDataUteisSabado, setResultadoDataUteisSabado] =
    useState<Date | null>(null);

  const form = useForm<FormData>({
    defaultValues: {
      data: new Date(),
      operacao: 'Adicionar',
      quantidade: 0,
    },
  });

  function calcularData(data: Date, operacao: Operacao, quantidade: number): Date {
    if (operacao === 'Adicionar') {
      return addDays(data, quantidade);
    } else {
      return subDays(data, quantidade);
    }
  }

  function calcularDataUteis(data: Date, operacao: Operacao, quantidade: number): Date {
    let diasUteis = 0;
    let novaData = data;
  
    while (diasUteis < quantidade) {
      novaData = operacao === 'Adicionar' ? addDays(novaData, 1) : subDays(novaData, 1);
  
      if (!isWeekend(novaData)) {
        diasUteis++;
      }
    }
  
    return novaData;
  }

  function calcularDataUteisSabado(data: Date, operacao: Operacao, quantidade: number): Date {
    let diasUteis = 0;
    let novaData = data;
  
    while (diasUteis < quantidade) {
        novaData = operacao === 'Adicionar' ? addDays(novaData, 1) : subDays(novaData, 1);

        if (!isWeekend(novaData) || novaData.getDay() === 6) {
            diasUteis++;
        }
    }
    
    return novaData
  }

  function onSubmit(data: FormData) {
    const { data: dataInicial, operacao, quantidade } = data;
    
    const dataFinal = calcularData(dataInicial, operacao, quantidade);
    const dataUteisFinal = calcularDataUteis(dataInicial, operacao, quantidade)
    const dataUteisSabadoFinal = calcularDataUteisSabado(dataInicial, operacao, quantidade)

    setResultadoData(dataFinal);
    setResultadoDataUteis(dataUteisFinal)
    setResultadoDataUteisSabado(dataUteisSabadoFinal)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Adicionar ou Subtrair Dias de uma Data
      </h1>
      <div className="bg-gray-100 p-6 rounded-lg shadow-md flex gap-10">
        <div className="w-1/2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy', { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="operacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operação</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma operação" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Adicionar">Adicionar</SelectItem>
                        <SelectItem value="Subtrair">Subtrair</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade de Dias</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Calcular</Button>
            </form>
          </Form>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg w-1/2">
          {resultadoData && (
            <>
              <p>
                <strong>Data Resultante (todos os dias):</strong>{' '}
                {resultadoData ? format(resultadoData, 'dd/MM/yyyy', { locale: ptBR }) : ''}
              </p>
              <Separator className='my-4'/>
              <p>
                <strong>Data Resultante (apenas dias úteis):</strong>{' '}
                {resultadoDataUteis ? format(resultadoDataUteis, 'dd/MM/yyyy', { locale: ptBR }) : ''}
              </p>
              <Separator className='my-4'/>
              <p>
                <strong>Data Resultante (dias úteis + sábados):</strong>{' '}
                {resultadoDataUteisSabado ? format(resultadoDataUteisSabado, 'dd/MM/yyyy', { locale: ptBR }) : ''}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}