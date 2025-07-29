"use client"

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CompoundInterestResult {
  futureValue: number;
  interestEarned: number;
  roi: number;
  table: { period: number; contribution: number; futureValue: number }[];
}

const CalculatorPage = () => {
  const t = useTranslations('CompoundInterestCalculator');
  const [initialInvestment, setInitialInvestment] = useState<number>(0);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(0);
  const [years, setYears] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [capitalizationFrequency, setCapitalizationFrequency] = useState<number>(1);
  const [decimalPrecision, setDecimalPrecision] = useState<number>(2);
  const [result, setResult] = useState<CompoundInterestResult | null>(null);
  const [showDetailedTable, setShowDetailedTable] = useState<boolean>(false);

  const calculateCompoundInterest = () => {
    const principal = initialInvestment;
    const monthlyDeposit = monthlyContribution;
    const numberOfYears = years;
    const annualInterestRate = interestRate / 100;
    const compoundingFrequency = capitalizationFrequency;
    const precision = decimalPrecision;

    if (principal < 0 || monthlyDeposit < 0 || numberOfYears < 0 || annualInterestRate < 0 || precision < 0) {
      alert("Por favor, insira valores não negativos.");
      return;
    }

    if (numberOfYears === 0) {
      alert("O número de anos deve ser maior que zero.");
      return;
    }

    const periods = numberOfYears * compoundingFrequency;
    const ratePerPeriod = annualInterestRate / compoundingFrequency;
    
    // Calculate monthly contribution adjusted for compounding frequency
    const contributionPerPeriod = monthlyDeposit / (compoundingFrequency / 12);

    // PERFORMANCE OPTIMIZATION: Use compound interest formula for main calculation
    // Only generate table data if periods <= 120 (10 years monthly or equivalent)
    let totalValue = principal;
    let totalContributions = principal;
    let tableData: { period: number; contribution: number; futureValue: number }[] = [];

    if (contributionPerPeriod === 0) {
      // Simple compound interest formula - much faster
      totalValue = principal * Math.pow(1 + ratePerPeriod, periods);
    } else {
      // Future value with contributions - optimized calculation
      const futureValuePrincipal = principal * Math.pow(1 + ratePerPeriod, periods);
      const futureValueContributions = contributionPerPeriod * ((Math.pow(1 + ratePerPeriod, periods) - 1) / ratePerPeriod);
      totalValue = futureValuePrincipal + futureValueContributions;
      totalContributions = principal + (contributionPerPeriod * periods);
    }

    // Only generate detailed table for reasonable period counts
    if (periods <= 120 && showDetailedTable) {
      let currentValue = principal;
      for (let i = 1; i <= periods; i++) {
        currentValue = currentValue * (1 + ratePerPeriod);
        if (contributionPerPeriod > 0) {
          currentValue += contributionPerPeriod;
        }
        
        // Only store every 12th period for long calculations to reduce memory
        if (periods > 60 && i % 12 !== 0 && i !== periods) continue;
        
        tableData.push({
          period: i,
          contribution: Math.round(contributionPerPeriod * 100) / 100,
          futureValue: Math.round(currentValue * 100) / 100,
        });
      }
    }

    const interestEarned = totalValue - totalContributions;
    const finalResult: CompoundInterestResult = {
      futureValue: Math.round(totalValue * 100) / 100,
      interestEarned: Math.round(interestEarned * 100) / 100,
      roi: Math.round(((totalValue - principal) / principal * 100) * 100) / 100,
      table: tableData,
    };

    setResult(finalResult);
  };

  return (
    <div className="flex p-6 space-x-6">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="initialInvestment">{t('initialInvestmentLabel')}</Label>
            <Input
              id="initialInvestment"
              type="number"
              value={initialInvestment.toString()}
              onChange={(e) => setInitialInvestment(parseFloat(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlyContribution">{t('monthlyContributionLabel')}</Label>
            <Input
              id="monthlyContribution"
              type="number"
              value={monthlyContribution.toString()}
              onChange={(e) => setMonthlyContribution(parseFloat(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="years">{t('yearsLabel')}</Label>
            <Input
              id="years"
              type="number"
              value={years.toString()}
              onChange={(e) => setYears(parseFloat(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interestRate">{t('interestRateLabel')}</Label>
            <Input
              id="interestRate"
              type="number"
              value={interestRate.toString()}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
            />
          </div>
          <div className="space-y-2">
          <Label htmlFor="capitalizationFrequency">{t('capitalizationFrequencyLabel')}</Label>
          <Select onValueChange={(value) => setCapitalizationFrequency(parseInt(value))}>
              <SelectTrigger id="capitalizationFrequency">
                  <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="1">{t('annualOption')}</SelectItem>
                  <SelectItem value="2">{t('semiannualOption')}</SelectItem>
                  <SelectItem value="4">{t('quarterlyOption')}</SelectItem>
                  <SelectItem value="12">{t('monthlyOption')}</SelectItem>
              </SelectContent>
          </Select>
      </div>
          <div className="space-y-2">
            <Label htmlFor="decimalPrecision">{t('decimalPrecisionLabel')}</Label>
            <Input
              id="decimalPrecision"
              type="number"
              value={decimalPrecision.toString()}
              onChange={(e) => setDecimalPrecision(parseFloat(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Button onClick={calculateCompoundInterest} className="w-full">
              {t('calculateButton')}
            </Button>
            {result && (
              <div className="flex items-center justify-center">
                <input 
                  type="checkbox" 
                  id="showTable" 
                  checked={showDetailedTable}
                  onChange={(e) => setShowDetailedTable(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="showTable" className="text-sm text-gray-600">
                  Mostrar tabela detalhada
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {result && (
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>{t('resultTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-lg">
                  <strong>{t('futureValueLabel')}</strong> 
                  <span className="text-green-600 font-bold">R$ {result.futureValue.toLocaleString('pt-BR')}</span>
                </p>
                <p>
                  <strong>{t('interestEarnedLabel')}</strong> 
                  <span className="text-blue-600">R$ {result.interestEarned.toLocaleString('pt-BR')}</span>
                </p>
                <p>
                  <strong>{t('roiLabel')}</strong> 
                  <span className="text-purple-600">{result.roi}%</span>
                </p>
              </div>
            </div>
            {showDetailedTable && result.table.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Evolução Detalhada</h4>
                <div className="max-h-96 overflow-y-auto border rounded">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white">
                      <TableRow>
                        <TableHead>{t('periodTableHeader')}</TableHead>
                        <TableHead>{t('contributionTableHeader')}</TableHead>
                        <TableHead>{t('futureValueTableHeader')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.table.map((item) => (
                        <TableRow key={item.period}>
                          <TableCell>{item.period}</TableCell>
                          <TableCell>R$ {item.contribution.toLocaleString('pt-BR')}</TableCell>
                          <TableCell>R$ {item.futureValue.toLocaleString('pt-BR')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {result.table.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Tabela detalhada não disponível para períodos muito longos (performance)
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalculatorPage;
