'use client';

import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { format, addDays, subDays, isWeekend } from 'date-fns';
import { ptBR, es, enUS } from 'date-fns/locale';
import { useTranslations, useLocale } from 'next-intl';

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

type Operacao = 'add' | 'subtract';

interface FormData {
  data: Date;
  operacao: Operacao;
  quantidade: number;
}

const localeMap: Record<string, Locale> = {
  'pt-BR': ptBR,
  'es': es,
  'en': enUS,
};

export default function AdicionarSubtrairDiasClientPage() {
  const t = useTranslations('AddSubtractDaysCalculator');
  const locale = useLocale();
  const dateLocale = localeMap[locale] || enUS;

  const [resultadoData, setResultadoData] = useState<Date | null>(null);
  const [resultadoDataUteis, setResultadoDataUteis] = useState<Date | null>(null);
  const [resultadoDataUteisSabado, setResultadoDataUteisSabado] = useState<Date | null>(null);

  const form = useForm<FormData>({
    defaultValues: {
      data: new Date(),
      operacao: 'add',
      quantidade: 0,
    },
  });

  function calcularData(data: Date, operacao: Operacao, quantidade: number): Date {
    if (operacao === 'add') {
      return addDays(data, quantidade);
    } else {
      return subDays(data, quantidade);
    }
  }

  function calcularDataUteis(data: Date, operacao: Operacao, quantidade: number): Date {
    let diasUteis = 0;
    let novaData = data;

    while (diasUteis < quantidade) {
      novaData = operacao === 'add' ? addDays(novaData, 1) : subDays(novaData, 1);

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
      novaData = operacao === 'add' ? addDays(novaData, 1) : subDays(novaData, 1);

      if (!isWeekend(novaData) || novaData.getDay() === 6) {
        diasUteis++;
      }
    }

    return novaData;
  }

  function onSubmit(data: FormData) {
    const { data: dataInicial, operacao, quantidade } = data;

    const dataFinal = calcularData(dataInicial, operacao, quantidade);
    const dataUteisFinal = calcularDataUteis(dataInicial, operacao, quantidade);
    const dataUteisSabadoFinal = calcularDataUteisSabado(dataInicial, operacao, quantidade);

    setResultadoData(dataFinal);
    setResultadoDataUteis(dataUteisFinal);
    setResultadoDataUteisSabado(dataUteisSabadoFinal);
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        <div className="w-full lg:w-1/2">
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
                    <FormLabel>{t('dateLabel')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full sm:w-[280px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy', { locale: dateLocale })
                            ) : (
                              <span>{t('selectDate')}</span>
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
                          locale={dateLocale}
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
                    <FormLabel>{t('operationLabel')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full sm:w-[280px]">
                          <SelectValue placeholder={t('selectOperation')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="add">{t('addOption')}</SelectItem>
                        <SelectItem value="subtract">{t('subtractOption')}</SelectItem>
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
                    <FormLabel>{t('daysLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        className="w-full sm:w-[280px]"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full sm:w-auto">{t('calculateButton')}</Button>
            </form>
          </Form>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg w-full lg:w-1/2">
          {resultadoData ? (
            <>
              <p className="text-sm sm:text-base">
                <strong>{t('resultAllDays')}:</strong>{' '}
                {format(resultadoData, 'PPPP', { locale: dateLocale })}
              </p>
              <Separator className='my-4'/>
              <p className="text-sm sm:text-base">
                <strong>{t('resultBusinessDays')}:</strong>{' '}
                {resultadoDataUteis && format(resultadoDataUteis, 'PPPP', { locale: dateLocale })}
              </p>
              <Separator className='my-4'/>
              <p className="text-sm sm:text-base">
                <strong>{t('resultBusinessPlusSaturday')}:</strong>{' '}
                {resultadoDataUteisSabado && format(resultadoDataUteisSabado, 'PPPP', { locale: dateLocale })}
              </p>
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              {t('resultPlaceholder')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
