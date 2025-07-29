"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CalculadoraDiasEntreDatasPage() {
  const t = useTranslations('Calculators.dias-entre-datas');

  const formSchema = z.object({
    startDate: z.date({
      required_error: t('dateRequiredError'),
    }),
    endDate: z.date({
      required_error: t('dateRequiredError'),
    }),
    includeStartDate: z.string()
  });

  interface DateDifferenceResult {
    totalDays: number;
    weekdays: number;
    weekends: number;
    weeks: number;
    months: number;
    years: number;
  }
  const [result, setResult] = useState<DateDifferenceResult | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
      includeStartDate: "true"
    },
  });

  function calculateDateDifference(startDate: Date, endDate: Date, includeStartDate: boolean): DateDifferenceResult {
    const timeDifference = endDate.getTime() - startDate.getTime();
    let totalDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (includeStartDate) {
      totalDays += 1;
    }
    
    let weekdays = 0;
    let weekends = 0;
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            weekends++;
        } else {
            weekdays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    if (!includeStartDate) {
        if (startDate.getDay() === 0 || startDate.getDay() === 6) {
            weekends--;
        } else {
            weekdays--;
        }
    }

    const weeks = Math.floor(totalDays / 7);
    const months = Math.floor(totalDays / 30.437);
    const years = Math.floor(totalDays / 365.25);

    return {
      totalDays,
      weekdays,
      weekends,
      weeks,
      months,
      years,
    };
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { startDate, endDate, includeStartDate } = values;
    const include = includeStartDate === "true"

    setResult(calculateDateDifference(startDate, endDate, include));
  }

  return (
    <div className="flex w-full h-full flex-col md:flex-row items-center justify-center gap-4 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 items-center gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('startDateLabel')}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[200px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            new Intl.DateTimeFormat('pt-BR').format(field.value)
                          ) : (
                            <span>{t('pickDate')}</span>
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
                        disabled={(date) =>
                          date > new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('endDateLabel')}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[200px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            new Intl.DateTimeFormat('pt-BR').format(field.value)
                          ) : (
                            <span>{t('pickDate')}</span>
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
                        disabled={(date) =>
                          date > new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
              control={form.control}
              name="includeStartDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('includeStartDateLabel')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                          <SelectValue placeholder={t('select')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="true">{t('includeOptions.true')}</SelectItem>
                        <SelectItem value="false">{t('includeOptions.false')}</SelectItem>
                    </SelectContent>
                    </Select>
                </FormItem>
              )}
            />
          <Button type="submit">{t('calculateButton')}</Button>
        </form>
      </Form>
      <div className="space-y-4">
        {result && (
          <div className="space-y-2">
            <div className="flex gap-2">
                <p className="font-bold">{t('totalDaysLabel')}</p>
              <p>{result.totalDays}</p>
            </div>
            <div className="flex gap-2">
              <p className="font-bold">{t('weekdaysLabel')}</p>
              <p>{result.weekdays}</p>
            </div>
            <div className="flex gap-2">
              <p className="font-bold">{t('weekendsLabel')}</p>
              <p>{result.weekends}</p>
            </div>
            <div className="flex gap-2">
              <p className="font-bold">{t('weeksLabel')}</p>
              <p>{result.weeks}</p>
            </div>
            <div className="flex gap-2">
              <p className="font-bold">{t('monthsLabel')}</p>
              <p>{result.months}</p>
            </div>
            <div className="flex gap-2">
              <p className="font-bold">{t('yearsLabel')}</p>
              <p>{result.years}</p>
            </div>
          </div>
        )}
      </div>
    </div>
    );
}
