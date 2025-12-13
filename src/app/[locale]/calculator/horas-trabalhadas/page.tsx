'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface TimeEntry {
    start: string;
    end: string;
    break: string;
    total: string;
}

type TimeEntryKey = keyof TimeEntry;

const CalculadoraHorasTrabalhadas = () => {
    const t = useTranslations('WorkedHoursCalculator');
    
    const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
        { start: '', end: '', break: '', total: '' },
        { start: '', end: '', break: '', total: '' },
        { start: '', end: '', break: '', total: '' },
        { start: '', end: '', break: '', total: '' },
        { start: '', end: '', break: '', total: '' },
        { start: '', end: '', break: '', total: '' },
        { start: '', end: '', break: '', total: '' },
    ]);
    const [contractualHours, setContractualHours] = useState<string>('');
    const [extraHourValue, setExtraHourValue] = useState<string>('');
    const [totalExtraHours, setTotalExtraHours] = useState<number>(0);
    const [totalPay, setTotalPay] = useState<number>(0);
    const [weeklyTotalTime, setWeeklyTotalTime] = useState({ hours: 0, minutes: 0 });

    const days = [t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')];

    const calculateTotalTime = (start: string, end: string, breakTime: string): string => {
        if (!start || !end || !breakTime) return '';

        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);
        const [breakHour, breakMinute] = breakTime.split(':').map(Number);

        let totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute) - (breakHour * 60 + breakMinute);
        if (totalMinutes < 0) totalMinutes += 24 * 60;

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const handleTimeChange = (index: number, field: TimeEntryKey, value: string) => {
        const newTimeEntries = [...timeEntries];
        newTimeEntries[index][field] = value;
        const { start, end, break: breakTime } = newTimeEntries[index];
        newTimeEntries[index].total = calculateTotalTime(start, end, breakTime);
        setTimeEntries(newTimeEntries);
        // Recalculate from the latest entries to avoid stale closure issues
        let totalMinutes = 0;
        newTimeEntries.forEach(entry => {
            if (entry.total) {
                const [hoursStr, minutesStr] = entry.total.split(':');
                const h = Number(hoursStr) || 0;
                const m = Number(minutesStr) || 0;
                totalMinutes += h * 60 + m;
            }
        });
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        setWeeklyTotalTime({ hours, minutes });
    };

    const calculateWeeklyTotal = () => {
        let totalMinutes = 0;
        timeEntries.forEach(entry => {
            if (entry.total) {
                const [hours, minutes] = entry.total.split(':').map(Number);
                totalMinutes += hours * 60 + minutes;
            }
        });

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        setWeeklyTotalTime({ hours, minutes });
    };

    const calculateExtraHoursAndPay = () => {
        const contractual = parseFloat(contractualHours) || 0;
        const hourValue = parseFloat(extraHourValue) || 0;
        const weeklyHours = weeklyTotalTime.hours + (weeklyTotalTime.minutes / 60);
        const extraHours = Math.max(0, weeklyHours - contractual);

        setTotalExtraHours(extraHours);
        setTotalPay(extraHours * hourValue);
    };

    const clearAllFields = () => {
        setTimeEntries([
            { start: '', end: '', break: '', total: '' },
            { start: '', end: '', break: '', total: '' },
            { start: '', end: '', break: '', total: '' },
            { start: '', end: '', break: '', total: '' },
            { start: '', end: '', break: '', total: '' },
            { start: '', end: '', break: '', total: '' },
            { start: '', end: '', break: '', total: '' },
        ]);
        setContractualHours('');
        setExtraHourValue('');
        setTotalExtraHours(0);
        setTotalPay(0);
        setWeeklyTotalTime({ hours: 0, minutes: 0 });
    };

    return (
        <div className="container mx-auto py-10">
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>{t('title')}</CardTitle>
                    <CardDescription>
                        {t('description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-5 gap-2">
                        <div>{t('day')}</div>
                        <div>{t('entry')}</div>
                        <div>{t('exit')}</div>
                        <div>{t('break')}</div>
                        <div>{t('dayTotal')}</div>
                    </div>
                    {days.map((day, index) => (
                        <div className="grid grid-cols-5 gap-2 items-center" key={index}>
                            <div>{day}</div>
                            <Input
                                type="time"
                                value={timeEntries[index].start}
                                onChange={(e) => handleTimeChange(index, 'start', e.target.value)}
                                placeholder="--:--"
                                className="text-center"
                            />
                            <Input
                                type="time"
                                value={timeEntries[index].end}
                                onChange={(e) => handleTimeChange(index, 'end', e.target.value)}
                                placeholder="--:--"
                                className="text-center"
                            />
                            <Input
                                type="time"
                                value={timeEntries[index].break}
                                onChange={(e) => handleTimeChange(index, 'break', e.target.value)}
                                placeholder="--:--"
                                className="text-center"
                            />
                            <Input
                                type="text"
                                value={timeEntries[index].total}
                                placeholder="--:--"
                                className="text-center"
                                readOnly
                                disabled
                            />
                        </div>
                    ))}
                    <div className="flex justify-center">
                        <Button variant="outline" onClick={clearAllFields}>{t('clearAll')}</Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full max-w-3xl mx-auto mt-6">
                <CardHeader>
                    <CardTitle>{t('weeklyWorkTotal')}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                    <div>
                        <Label>{t('time')}</Label>
                        <div className="font-bold">{weeklyTotalTime.hours}h {weeklyTotalTime.minutes}m</div>
                    </div>
                    <div>
                        <Label>{t('hours')}</Label>
                        <div className="font-bold">{weeklyTotalTime.hours + (weeklyTotalTime.minutes / 60)}</div>
                    </div>
                    <div>
                        <Label>{t('minutes')}</Label>
                        <div className="font-bold">{weeklyTotalTime.hours * 60 + weeklyTotalTime.minutes}</div>
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full max-w-3xl mx-auto mt-6">
                <CardHeader>
                    <CardTitle>{t('calculateOvertime')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 items-center">
                        <div>
                            <Label htmlFor="contractualHours">{t('contractualHours')}</Label>
                            <Input
                                type="number"
                                id="contractualHours"
                                value={contractualHours}
                                onChange={(e) => setContractualHours(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="extraHourValue">{t('overtimeHourValue')}</Label>
                            <Input
                                type="number"
                                id="extraHourValue"
                                value={extraHourValue}
                                onChange={(e) => setExtraHourValue(e.target.value)}
                            />
                        </div>
                    </div>
                    <Button onClick={calculateExtraHoursAndPay}>{t('calculate')}</Button>
                    <div className="grid grid-cols-2 gap-4 items-center">
                        <div>
                            <Label>{t('totalOvertime')}</Label>
                            <div className="font-bold">{totalExtraHours.toFixed(2)}</div>
                        </div>
                        <div>
                            <Label>{t('totalToPay')}</Label>
                            <div className="font-bold">R$ {totalPay.toFixed(2)}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
               <div className='flex justify-center'>
                   <Link href="#como-calcular-horas-extras">{t('howToCalculateLink')}</Link>
               </div>

               <section id="como-calcular-horas-extras" className="mt-12">
                <Card className="w-full max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle>{t('howToCalculateTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{t('howToCalculateText')}</p>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>{t('step1')}</li>
                            <li>{t('step2')}</li>
                            <li>{t('step3')}</li>
                            <li>{t('step4')}</li>
                            <li>{t('step5')}</li>
                        </ol>
                        <h2 className="text-xl font-semibold mt-4">{t('overtimeValueTitle')}</h2>
                        <p>{t('overtimeValueText')}</p>
                        <h3 className="text-lg font-semibold mt-4">{t('step1Title')}</h3>
                        <p>{t('step1Text')}</p>
                        <p className="font-semibold">{t('monthlyContractExample')}</p>
                        <p>{t('monthlyContractText')}</p>
                        <p className="font-semibold">{t('weeklyContractExample')}</p>
                        <p>{t('weeklyContractText')}</p>
                        <h3 className="text-lg font-semibold mt-4">{t('step2Title')}</h3>
                        <p>{t('step2Text')}</p>
                        <p>{t('overtimeCalcExample')}</p>
                        <p>{t('overtimeFormula1')}</p>
                        <p>{t('overtimeFormula2')}</p>
                        <p>{t('overtimeFormula3')}</p>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
};

export default CalculadoraHorasTrabalhadas;
