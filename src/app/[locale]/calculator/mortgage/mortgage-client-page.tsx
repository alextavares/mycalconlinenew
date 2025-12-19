'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Calculator, 
  Home, 
  Percent, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  Building, 
  Info, 
  ChevronDown, 
  ChevronUp,
  TrendingDown,
  Clock,
  PieChart as PieChartIcon,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  Legend 
} from 'recharts';

interface MortgageClientPageProps {
  locale: string;
}

export default function MortgageClientPage({ locale }: MortgageClientPageProps) {
  const t = useTranslations('MortgageCalculator');

  // Input States
  const [homePrice, setHomePrice] = useState<number>(300000);
  const [downPayment, setDownPayment] = useState<number>(60000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [propertyTax, setPropertyTax] = useState<number>(3600);
  const [homeInsurance, setHomeInsurance] = useState<number>(1200);
  const [pmiRate, setPmiRate] = useState<number>(0.5);
  const [hoaFees, setHoaFees] = useState<number>(0);

  // Results State
  const [results, setResults] = useState({
    monthlyPI: 0,
    monthlyTax: 0,
    monthlyInsurance: 0,
    monthlyPMI: 0,
    monthlyHOA: 0,
    totalMonthly: 0,
    totalInterest: 0,
    totalCost: 0,
    loanAmount: 0
  });

  const [showAmortization, setShowAmortization] = useState(false);

  // Sync Down Payment Amount and Percent
  const handleDownPaymentAmountChange = (val: number) => {
    setDownPayment(val);
    if (homePrice > 0) {
      setDownPaymentPercent(Number(((val / homePrice) * 100).toFixed(2)));
    }
  };

  const handleDownPaymentPercentChange = (val: number) => {
    setDownPaymentPercent(val);
    if (homePrice > 0) {
      setDownPayment(Number(((val / 100) * homePrice).toFixed(0)));
    }
  };

  useEffect(() => {
    const loanAmount = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    let monthlyPI = 0;
    if (monthlyRate === 0) {
      monthlyPI = loanAmount / numberOfPayments;
    } else {
      monthlyPI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }

    const monthlyTax = propertyTax / 12;
    const monthlyInsurance = homeInsurance / 12;
    const monthlyHOA = hoaFees;
    
    // PMI usually only applies if down payment < 20%
    let monthlyPMI = 0;
    if (downPaymentPercent < 20) {
      monthlyPMI = (loanAmount * (pmiRate / 100)) / 12;
    }

    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI + monthlyHOA;
    const totalCost = (monthlyPI * numberOfPayments) + downPayment + (monthlyTax * numberOfPayments) + (monthlyInsurance * numberOfPayments) + (monthlyHOA * numberOfPayments);
    const totalInterest = (monthlyPI * numberOfPayments) - loanAmount;

    setResults({
      monthlyPI,
      monthlyTax,
      monthlyInsurance,
      monthlyPMI,
      monthlyHOA,
      totalMonthly,
      totalInterest,
      totalCost,
      loanAmount
    });
  }, [homePrice, downPayment, interestRate, loanTerm, propertyTax, homeInsurance, pmiRate, hoaFees, downPaymentPercent]);

  const chartData = useMemo(() => [
    { name: t('chart.principalInterest'), value: results.monthlyPI, color: '#3b82f6' },
    { name: t('chart.tax'), value: results.monthlyTax, color: '#10b981' },
    { name: t('chart.insurance'), value: results.monthlyInsurance, color: '#f59e0b' },
    { name: t('chart.pmi'), value: results.monthlyPMI, color: '#ef4444' },
    { name: t('chart.hoa'), value: results.monthlyHOA, color: '#8b5cf6' },
  ].filter(item => item.value > 0), [results, t]);

  const clearInputs = () => {
    setHomePrice(300000);
    setDownPayment(60000);
    setDownPaymentPercent(20);
    setInterestRate(6.5);
    setLoanTerm(30);
    setPropertyTax(3600);
    setHomeInsurance(1200);
    setPmiRate(0.5);
    setHoaFees(0);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: locale === 'pt-BR' ? 'BRL' : 'USD',
    }).format(val);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Home className="w-10 h-10 text-primary" />
          {t('title')}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                {t('title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="homePrice">{t('homePrice')}</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="homePrice"
                    type="number"
                    value={homePrice}
                    onChange={(e) => setHomePrice(Number(e.target.value))}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="downPayment">{t('downPayment')}</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="downPayment"
                      type="number"
                      value={downPayment}
                      onChange={(e) => handleDownPaymentAmountChange(Number(e.target.value))}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="downPercent">%</Label>
                  <div className="relative">
                    <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="downPercent"
                      type="number"
                      value={downPaymentPercent}
                      onChange={(e) => handleDownPaymentPercentChange(Number(e.target.value))}
                      className="pr-9"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interestRate">{t('interestRate')}</Label>
                  <div className="relative">
                    <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.01"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="pr-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanTerm">{t('loanTerm')}</Label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="loanTerm"
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="pr-9"
                    />
                  </div>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="advanced">
                  <AccordionTrigger className="text-sm font-medium hover:no-underline py-2">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Advanced Options (Tax, Insurance)
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tax">{t('propertyTax')} ({t('perYear')})</Label>
                        <Input
                          id="tax"
                          type="number"
                          value={propertyTax}
                          onChange={(e) => setPropertyTax(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="insurance">{t('homeInsurance')} ({t('perYear')})</Label>
                        <Input
                          id="insurance"
                          type="number"
                          value={homeInsurance}
                          onChange={(e) => setHomeInsurance(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pmi">{t('pmi')} (%)</Label>
                        <Input
                          id="pmi"
                          type="number"
                          step="0.01"
                          value={pmiRate}
                          onChange={(e) => setPmiRate(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hoa">{t('hoaFees')} ({t('perMonth')})</Label>
                        <Input
                          id="hoa"
                          type="number"
                          value={hoaFees}
                          onChange={(e) => setHoaFees(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button 
                variant="outline" 
                className="w-full gap-2 border-dashed"
                onClick={clearInputs}
              >
                <Trash2 className="w-4 h-4" />
                {t('clear')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Results */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="text-center pb-2">
              <CardDescription className="text-primary font-medium uppercase tracking-wider text-xs">
                {t('monthlyPayment')}
              </CardDescription>
              <CardTitle className="text-5xl font-bold text-primary">
                {formatCurrency(results.totalMonthly)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-around gap-6 mt-4">
                <div className="w-full h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(val: number) => formatCurrency(val)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 w-full max-w-[200px]">
                  {chartData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground truncate max-w-[100px]">{item.name}</span>
                      </div>
                      <span className="font-semibold">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('totalInterest')}</p>
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(results.totalInterest)}</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('totalCost')}</p>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(results.totalCost)}</p>
                  </div>
                  <Building className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-50 dark:bg-slate-900 border-none shadow-sm">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('payoffDate')}</p>
                <p className="font-semibold text-lg">
                  {new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
                    new Date(new Date().setMonth(new Date().getMonth() + loanTerm * 12))
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SEO Content Section */}
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
            <Home className="w-32 h-32 text-primary/20" />
          </div>
        </section>

        <Separator />

        <section>
          <h2 className="text-3xl font-bold mb-6 text-center">{t('howToCalculate.title')}</h2>
          <Card className="bg-slate-50 dark:bg-slate-900 border-none">
            <CardContent className="pt-6">
              <div 
                className="text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t('howToCalculate.content') }}
              />
            </CardContent>
          </Card>
        </section>

        <section className="bg-primary/5 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Info className="w-8 h-8 text-primary" />
            {t('buyingTips.title')}
          </h2>
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: t('buyingTips.content') }}
          />
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
