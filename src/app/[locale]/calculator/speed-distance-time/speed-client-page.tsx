'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Gauge, 
  MapPin, 
  Clock, 
  Calculator, 
  Info, 
  Trash2, 
  ArrowRight,
  Zap,
  MoveHorizontal,
  Timer
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface SpeedClientPageProps {
  locale: string;
}

type Mode = 'speed' | 'distance' | 'time';

export default function SpeedClientPage({ locale }: SpeedClientPageProps) {
  const t = useTranslations('SpeedCalculator');

  const [mode, setMode] = useState<Mode>('speed');
  
  // Inputs
  const [speed, setSpeed] = useState<string>('');
  const [distance, setDistance] = useState<string>('');
  const [time, setTime] = useState<string>('');
  
  // Units
  const [speedUnit, setSpeedUnit] = useState<string>('kph');
  const [distanceUnit, setDistanceUnit] = useState<string>('km');
  const [timeUnit, setTimeUnit] = useState<string>('hr');
  
  // Result
  const [result, setResult] = useState<number | null>(null);

  // Conversion factors to SI base units (m, s, m/s)
  const distanceConversion: Record<string, number> = {
    km: 1000,
    m: 1,
    mi: 1609.34,
    ft: 0.3048,
    yd: 0.9144
  };

  const timeConversion: Record<string, number> = {
    sec: 1,
    min: 60,
    hr: 3600
  };

  const speedConversion: Record<string, number> = {
    kph: 1 / 3.6,
    mph: 0.44704,
    mps: 1,
    fps: 0.3048,
    knot: 0.514444
  };

  const calculate = () => {
    const s = parseFloat(speed);
    const d = parseFloat(distance);
    const tVal = parseFloat(time);

    if (mode === 'speed') {
      if (d > 0 && tVal > 0) {
        const d_m = d * distanceConversion[distanceUnit];
        const t_s = tVal * timeConversion[timeUnit];
        const v_mps = d_m / t_s;
        setResult(v_mps / speedConversion[speedUnit]);
      } else {
        setResult(null);
      }
    } else if (mode === 'distance') {
      if (s > 0 && tVal > 0) {
        const v_mps = s * speedConversion[speedUnit];
        const t_s = tVal * timeConversion[timeUnit];
        const d_m = v_mps * t_s;
        setResult(d_m / distanceConversion[distanceUnit]);
      } else {
        setResult(null);
      }
    } else if (mode === 'time') {
      if (d > 0 && s > 0) {
        const d_m = d * distanceConversion[distanceUnit];
        const v_mps = s * speedConversion[speedUnit];
        const t_s = d_m / v_mps;
        setResult(t_s / timeConversion[timeUnit]);
      } else {
        setResult(null);
      }
    }
  };

  useEffect(() => {
    calculate();
  }, [mode, speed, distance, time, speedUnit, distanceUnit, timeUnit]);

  const clearInputs = () => {
    setSpeed('');
    setDistance('');
    setTime('');
    setResult(null);
  };

  const modes = [
    { id: 'speed', icon: Gauge, label: t('modeSpeed'), desc: t('modeSpeedDesc'), color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'distance', icon: MapPin, label: t('modeDistance'), desc: t('modeDistanceDesc'), color: 'text-green-500', bg: 'bg-green-50' },
    { id: 'time', icon: Clock, label: t('modeTime'), desc: t('modeTimeDesc'), color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 4,
    }).format(num);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Zap className="w-10 h-10 text-primary" />
          {t('title')}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <section>
            <Label className="text-sm font-semibold mb-3 block">{t('selectMode')}</Label>
            <div className="grid grid-cols-1 gap-3">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setMode(m.id as Mode); clearInputs(); }}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                    mode === m.id 
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                      : "border-transparent bg-card hover:bg-accent"
                  )}
                >
                  <div className={cn("p-2 rounded-lg", m.bg)}>
                    <m.icon className={cn("w-5 h-5", m.color)} />
                  </div>
                  <div>
                    <div className="font-bold">{m.label}</div>
                    <div className="text-xs text-muted-foreground">{m.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calculator className="w-4 h-4" />
                {t('calculation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mode !== 'distance' && (
                <div className="space-y-2">
                  <Label htmlFor="distance">{t('distance')}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="distance"
                      type="number"
                      placeholder="0.00"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                    />
                    <Select value={distanceUnit} onValueChange={setDistanceUnit}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="km">km</SelectItem>
                        <SelectItem value="m">m</SelectItem>
                        <SelectItem value="mi">mi</SelectItem>
                        <SelectItem value="ft">ft</SelectItem>
                        <SelectItem value="yd">yd</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {mode !== 'time' && (
                <div className="space-y-2">
                  <Label htmlFor="time">{t('time')}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="time"
                      type="number"
                      placeholder="0.00"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                    <Select value={timeUnit} onValueChange={setTimeUnit}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hr">hr</SelectItem>
                        <SelectItem value="min">min</SelectItem>
                        <SelectItem value="sec">sec</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {mode !== 'speed' && (
                <div className="space-y-2">
                  <Label htmlFor="speed">{t('speed')}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="speed"
                      type="number"
                      placeholder="0.00"
                      value={speed}
                      onChange={(e) => setSpeed(e.target.value)}
                    />
                    <Select value={speedUnit} onValueChange={setSpeedUnit}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kph">km/h</SelectItem>
                        <SelectItem value="mph">mph</SelectItem>
                        <SelectItem value="mps">m/s</SelectItem>
                        <SelectItem value="fps">ft/s</SelectItem>
                        <SelectItem value="knot">kn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <Button 
                variant="outline" 
                className="w-full gap-2 border-dashed mt-4"
                onClick={clearInputs}
              >
                <Trash2 className="w-4 h-4" />
                {t('clear')}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <Card className="border-primary/20 bg-primary/5 h-full flex flex-col justify-center min-h-[300px]">
            <CardContent className="text-center py-10">
              {result !== null ? (
                <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                  <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">
                    {mode === 'speed' ? t('modeSpeed') : mode === 'distance' ? t('modeDistance') : t('modeTime')}
                  </p>
                  <div className="text-6xl font-black text-primary flex items-baseline justify-center gap-2">
                    {formatNumber(result)}
                    <span className="text-xl font-medium text-primary/60">
                      {mode === 'speed' ? speedUnit : mode === 'distance' ? distanceUnit : timeUnit}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <div className="flex flex-col items-center px-4">
                      <div className="text-xs text-muted-foreground mb-1 uppercase tracking-tighter">{t('formula')}</div>
                      <div className="font-mono bg-white dark:bg-slate-800 px-3 py-1 rounded border shadow-sm text-sm">
                        {mode === 'speed' ? 'v = d / t' : mode === 'distance' ? 'd = v × t' : 't = d / v'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                    <ArrowRight className="w-10 h-10 text-primary/40" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-primary/60 mb-2">Ready to Calculate</p>
                    <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
                      Enter at least two values on the left to see the result here.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="flex items-center p-4 gap-4">
              <div className="p-2 bg-blue-100 rounded-lg"><MoveHorizontal className="w-5 h-5 text-blue-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">{t('distance')}</p>
                <p className="font-bold">{distance || '0'} {distanceUnit}</p>
              </div>
            </Card>
            <Card className="flex items-center p-4 gap-4">
              <div className="p-2 bg-orange-100 rounded-lg"><Timer className="w-5 h-5 text-orange-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">{t('time')}</p>
                <p className="font-bold">{time || '0'} {timeUnit}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-16 space-y-12">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold mb-4">{t('whatIs.title')}</h2>
            <div 
              className="text-muted-foreground leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: t('whatIs.content') }}
            />
          </div>
          <div className="order-1 md:order-2 bg-primary/5 rounded-3xl p-8 flex justify-center">
            <Gauge className="w-32 h-32 text-primary/20" />
          </div>
        </section>

        <Separator />

        <section>
          <h2 className="text-3xl font-bold mb-6 text-center">{t('howToCalculate.title')}</h2>
          <Card className="bg-slate-50 dark:bg-slate-900 border-none shadow-sm overflow-hidden">
            <CardContent className="p-8">
              <div 
                className="text-muted-foreground leading-relaxed prose prose-slate dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: t('howToCalculate.content') }}
              />
            </CardContent>
          </Card>
        </section>

        <section className="bg-primary/5 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Info className="w-8 h-8 text-primary" />
            {t('examples.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/50 border-none">
              <CardContent className="pt-6" dangerouslySetInnerHTML={{ __html: t('examples.ex1') }} />
            </Card>
            <Card className="bg-white/50 border-none">
              <CardContent className="pt-6" dangerouslySetInnerHTML={{ __html: t('examples.ex2') }} />
            </Card>
            <Card className="bg-white/50 border-none">
              <CardContent className="pt-6" dangerouslySetInnerHTML={{ __html: t('examples.ex3') }} />
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">{t('faq.title')}</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Accordion key={i} type="single" collapsible>
                <AccordionItem value={`faq-${i}`} className="border rounded-xl px-4 bg-card">
                  <AccordionTrigger className="text-left font-semibold py-4 hover:no-underline">
                    {t(`faq.q${i}`)}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                    {t(`faq.a${i}`)}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
