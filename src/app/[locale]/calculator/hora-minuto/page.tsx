'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

import { calcularDiferencaTempo } from './utils';

type TimeFormat = '12' | '24';

const HoraMinuto = () => {
  const t = useTranslations('Calculators.hora-minuto.calculator');
  const [timeFormat, setTimeFormat] = useState<TimeFormat>('24');
  const [startHour, setStartHour] = useState<string>('00');
  const [startMinute, setStartMinute] = useState<string>('00');
  const [endHour, setEndHour] = useState<string>('00');
  const [endMinute, setEndMinute] = useState<string>('00');
  const [result, setResult] = useState<{ intervalo: string; horas: number; minutos: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hoursOptions = Array.from({ length: timeFormat === '24' ? 24 : 12 }, (_, i) =>
    i.toString().padStart(2, '0')
  );
  const minutesOptions = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0')
  );

  const calculateDifference = () => {
    try {
      const diff = calcularDiferencaTempo(`${startHour}:${startMinute}`, `${endHour}:${endMinute}`, timeFormat);
      setResult(diff);
      setErrorMessage(null)
    } catch (error: any) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(t('errorMessage'));
      }
      setResult(null);
    } 
  }

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex flex-col w-full">
              <Label htmlFor="timeFormat">{t('timeFormatLabel')}</Label>
              <Select onValueChange={(value) => setTimeFormat(value as TimeFormat)} defaultValue={timeFormat} >
                <SelectTrigger>
                  <SelectValue placeholder={t('timeFormatLabel')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">{t('timeFormatOptions.12')}</SelectItem>
                  <SelectItem value="24">{t('timeFormatOptions.24')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col w-full">
              <Label>{t('startTimeLabel')}</Label>
              <div className="flex gap-2">
                <Select onValueChange={setStartHour} defaultValue={startHour}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('hourLabel')} />
                  </SelectTrigger>
                  <SelectContent>
                    {hoursOptions.map((hour) => (
                      <SelectItem key={hour} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={setStartMinute} defaultValue={startMinute}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('minuteLabel')} />
                  </SelectTrigger>
                  <SelectContent>
                    {minutesOptions.map((minute) => (
                      <SelectItem key={minute} value={minute}>
                        {minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <Label>{t('endTimeLabel')}</Label>
              <div className="flex gap-2">
                <Select onValueChange={setEndHour} defaultValue={endHour}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('hourLabel')} />
                  </SelectTrigger>
                  <SelectContent>
                    {hoursOptions.map((hour) => (
                      <SelectItem key={hour} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={setEndMinute} defaultValue={endMinute}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('minuteLabel')} />
                  </SelectTrigger>
                  <SelectContent>
                    {minutesOptions.map((minute) => (
                      <SelectItem key={minute} value={minute}>
                        {minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
              <Button onClick={calculateDifference}>{t('calculateButton')}</Button>
          </div>
          <div className='space-y-4'>
            {errorMessage && (
              <div className="text-red-500">
                {errorMessage}
              </div>
            )}
            {result && !errorMessage && (
                <div>
                    <h3 className="font-bold">{t('resultTitle')}</h3>
                    <p>
                        {t('intervalLabel')}: {result.intervalo}
                    </p>
                    <p>
                        {t('hoursLabel')}: {result.horas}
                    </p>
                    <p>
                        {t('minutesLabel')}: {result.minutos}
                    </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default HoraMinuto;
