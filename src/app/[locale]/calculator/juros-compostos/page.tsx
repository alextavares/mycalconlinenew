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
      // Inline validation instead of alert
      setResult(null);
      return;
    }

    if (numberOfYears === 0) {
      setResult(null);
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
      roi: principal > 0 ? Math.round((((totalValue - principal) / principal) * 100) * 100) / 100 : 0,
      table: tableData,
    };

    setResult(finalResult);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row p-4 lg:p-6 gap-6">
      {/* Bloco da calculadora */}
      <Card className="w-full lg:w-1/2">
        <CardHeader>
          {/* H1 semântico forte para SEO */}
          <CardTitle>
            <h1 className="text-2xl md:text-3xl font-bold">
              {t('title')}
            </h1>
          </CardTitle>
          <CardDescription className="text-base md:text-lg">
            {t('description')}
          </CardDescription>
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
          <Select value={String(capitalizationFrequency)} onValueChange={(value) => setCapitalizationFrequency(parseInt(value))}>
              <SelectTrigger id="capitalizationFrequency">
                  <SelectValue placeholder={t('selectPlaceholder')} />
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
            <Button
              onClick={() => {
                calculateCompoundInterest();
                // Garante que, após calcular, o usuário veja o resultado no topo
                try {
                  const resultCard = document.getElementById('compound-result-card');
                  if (resultCard) {
                    resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                } catch {
                  // fail-safe silencioso em ambientes sem window/document
                }
              }}
              className="w-full"
            >
              {t('calculateButton')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bloco de resultados */}
      {result && (
        <Card id="compound-result-card" className="w-full lg:w-1/2">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              {t('resultTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Resumo principal */}
            <div className="bg-green-50 p-4 rounded-lg" aria-live="polite" role="status">
              <p className="text-base md:text-lg mb-1">
                <strong>{t('futureValueLabel')}</strong>
                <span className="text-green-600 font-bold">
                  {result.futureValue.toLocaleString()}
                </span>
              </p>
              <p className="mb-1">
                <strong>{t('interestEarnedLabel')}</strong>
                <span className="text-blue-600">
                  {result.interestEarned.toLocaleString()}
                </span>
              </p>
              <p>
                <strong>{t('roiLabel')}</strong>
                <span className="text-purple-600">
                  {result.roi}%
                </span>
              </p>
            </div>

            {/* Tabela detalhada opcional */}
            {showDetailedTable && result.table.length > 0 && (
              <div className="mt-2">
                <h4 className="font-semibold mb-2">
                  {t('periodTableHeader')} / {t('contributionTableHeader')} / {t('futureValueTableHeader')}
                </h4>
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
                          <TableCell>
                            {item.contribution.toLocaleString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            {item.futureValue.toLocaleString('pt-BR')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {result.table.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Tabela detalhada não disponível para períodos muito longos (otimização de performance).
                  </p>
                )}
              </div>
            )}

            {/* Toggle para tabela */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showTable"
                checked={showDetailedTable}
                onChange={(e) => setShowDetailedTable(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="showTable" className="text-sm text-gray-700">
                Mostrar tabela detalhada de evolução
              </label>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalculatorPage;
