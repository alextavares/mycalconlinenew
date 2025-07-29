'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, ArrowLeftRight } from "lucide-react"

interface CurrencyRate {
  code: string;
  codein: string;
  name: string;
  high: string;
  low: string;
  varBid: string;
  pctChange: string;
  bid: string; // Purchase price (how much BRL to buy 1 unit of `code`)
  ask: string; // Selling price (how much BRL you get for selling 1 unit of `code`)
  timestamp: string;
  create_date: string;
}

interface CurrencyData {
  [key: string]: CurrencyRate; // e.g., "USD": { code: "USD", codein: "BRL", bid: "5.00", ... }
}

// Helper to format timestamp (basic)
const formatTimestamp = (timestamp: string | undefined, locale: string = 'en-US') => {
  if (!timestamp) return 'N/A';
  try {
    const date = new Date(parseInt(timestamp) * 1000); // Assuming timestamp is seconds
    return date.toLocaleString(locale, {
      dateStyle: 'medium', 
      timeStyle: 'short'
    });
  } catch (e) {
    return timestamp; // Return raw if parsing fails
  }
};

export default function CurrencyConverterPage() {
  const t = useTranslations('Calculators.currencyConverter');
  // const locale = useLocale(); // If needed for formatting
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<string>('EUR'); // Default to EUR like image
  const [toCurrency, setToCurrency] = useState<string>('CHF');   // Default to CHF like image
  const [currencies, setCurrencies] = useState<string[]>(['USD', 'BRL', 'EUR', 'JPY', 'GBP', 'CHF']); // Expanded fallback list
  const [result, setResult] = useState<number | null>(null);
  const [inverseRate, setInverseRate] = useState<number | null>(null);
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState<string | undefined>(undefined);

  const [loadingRates, setLoadingRates] = useState<boolean>(true); // For initial data fetch
  const [calculating, setCalculating] = useState<boolean>(false); // For conversion calculation
  const [error, setError] = useState<string | null>(null);
  const [allRates, setAllRates] = useState<CurrencyData | null>(null);

  // Fetch currency data on initial load
  useEffect(() => {
    const fetchCurrencies = async () => {
      setLoadingRates(true);
      setError(null);
      try {
        const response = await fetch('https://economia.awesomeapi.com.br/json/all');
        if (!response.ok) {
          throw new Error(`API request failed: ${response.statusText} (${response.status})`);
        }
        const data: CurrencyData = await response.json();

        const codes = new Set<string>();
        Object.values(data).forEach(rate => {
          codes.add(rate.code);
          if (rate.codein && !codes.has(rate.codein)) {
             codes.add(rate.codein);
          }
        });
        if (!codes.has('BRL')) {
            codes.add('BRL');
        }

        setCurrencies(Array.from(codes).sort());
        setAllRates(data);

        // Trigger initial conversion if defaults are set
        // handleConvert(true); // Pass flag to indicate initial load

      } catch (err: any) {
        console.error("Error fetching currencies:", err);
        setError(t('errorFetchingCurrencies') + `: ${err.message || 'Unknown error'}`);
        setAllRates(null);
      } finally {
        setLoadingRates(false);
      }
    };
    fetchCurrencies();
  }, [t]); // Removed handleConvert from dependency array

  // Memoized function to get the rate
  const getRate = useCallback((from: string, to: string): { rate: number | null, timestamp: string | undefined } => {
    let rate: number | null = null;
    let timestamp: string | undefined = undefined;

    if (!allRates) return { rate: null, timestamp: undefined };
    if (from === to) return { rate: 1.0, timestamp: undefined }; // No specific timestamp for 1:1

    // Try to get timestamp from the 'from' currency relative to BRL
    timestamp = allRates[from]?.timestamp ?? allRates[to]?.timestamp;

    if (to === 'BRL') {
      if (allRates[from] && allRates[from].codein === 'BRL') {
        rate = parseFloat(allRates[from].bid);
        timestamp = allRates[from].timestamp;
      }
    } else if (from === 'BRL') {
       if (allRates[to] && allRates[to].codein === 'BRL') {
         const toBrlRate = parseFloat(allRates[to].bid);
         if (toBrlRate !== 0) {
            rate = 1 / toBrlRate;
            timestamp = allRates[to].timestamp;
         }
       }
    } else {
        if (allRates[from] && allRates[from].codein === 'BRL' &&
            allRates[to] && allRates[to].codein === 'BRL')
        {
            const fromBrlRate = parseFloat(allRates[from].bid);
            const toBrlRate = parseFloat(allRates[to].bid);
             timestamp = allRates[from].timestamp; // Use timestamp from the 'from' rate
            if (toBrlRate !== 0) {
                rate = fromBrlRate / toBrlRate;
            }
        }
    }

    // Fallbacks
    if (rate === null) {
        const directKey = `${from}-${to}`;
        if (allRates[directKey]) {
            rate = parseFloat(allRates[directKey].bid);
            timestamp = allRates[directKey].timestamp;
        }
    }
    if (rate === null) {
        const inverseKey = `${to}-${from}`;
        if (allRates[inverseKey]) {
            const inverseBid = parseFloat(allRates[inverseKey].bid);
             if (inverseBid !== 0) {
                rate = 1 / inverseBid;
                timestamp = allRates[inverseKey].timestamp;
             }
        }
    }

    if (rate === null || isNaN(rate) || rate <= 0) {
      console.error(`Could not determine a valid rate for ${from} to ${to}`, allRates);
      return { rate: null, timestamp: undefined }; // Return null if rate is invalid
    }

    return { rate, timestamp };
  }, [allRates]);

  // Handle the calculation when the button is clicked
  const handleConvert = (isInitialLoad = false) => {
     // Don't auto-calculate on initial load if amount is empty or zero perhaps?
     // if (isInitialLoad && (!amount || parseFloat(amount) === 0)) return;

    setError(null);
    // Keep previous result visible while calculating new one?
    // setResult(null);
    // setInverseRate(null);
    // setLastUpdateTimestamp(undefined);

    if (!amount || isNaN(Number(amount)) || Number(amount) < 0 || !fromCurrency || !toCurrency) {
        setError(t('errorInvalidInput'));
        return;
    }

    if (!allRates) {
        setError(t('errorFetchingCurrencies'));
        return;
    }

    setCalculating(true);
    const numericAmount = parseFloat(amount);

    try {
        const { rate: currentRate, timestamp } = getRate(fromCurrency, toCurrency);

        if (currentRate === null) {
            throw new Error(`Conversion rate not found or invalid for ${fromCurrency} to ${toCurrency}`);
        }

        const calculatedResult = numericAmount * currentRate;
        let calculatedInverseRate: number | null = null;
        if (currentRate !== 0) {
            calculatedInverseRate = 1 / currentRate;
        }

        // Simulate slight delay
        setTimeout(() => {
            setResult(calculatedResult);
            setInverseRate(calculatedInverseRate);
            setLastUpdateTimestamp(timestamp);
            setCalculating(false);
            setError(null); // Clear error on success
        }, 150); // Short delay

    } catch (err: any) {
        console.error("Error converting currency:", err);
        const specificError = err.message ? `: ${err.message}` : '.';
        setError(t('errorDuringConversion') + specificError);
        setResult(null); // Clear result on error
        setInverseRate(null);
        setLastUpdateTimestamp(undefined);
        setCalculating(false);
    }
  };

  const handleSwapCurrencies = () => {
    if (calculating || loadingRates) return; // Don't swap during calculation/loading
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    // Trigger recalculation after swap
    // Need to wait for state update? Use useEffect or pass new values to handleConvert?
    // Or simply call handleConvert *after* states are likely updated?
    // Let's try calling it directly, might need adjustment if state update is slow.
     handleConvert();
  };

 // Trigger initial calculation after rates load
 useEffect(() => {
    if (!loadingRates && allRates) {
        handleConvert(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [loadingRates, allRates]); // Run when loading completes


  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
  <CardHeader className="text-center pb-4">
    <CardTitle className="text-xl font-semibold">
      Converter 1 {fromCurrency} para {toCurrency} - {fromCurrency} para {toCurrency}
    </CardTitle>
        {/* <CardDescription>{t('description')}</CardDescription> */}
      </CardHeader>
      <CardContent className="p-6 space-y-5">

        {/* Row 1: Amount Input */}
        <div className="space-y-1.5">
            <label htmlFor="amount" className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('amountLabel')}</label>
            <Input
              id="amount"
              type="number" // Use text and manage parsing? Allows more flexible input like commas
              value={amount}
              onChange={(e) => setAmount(e.target.value)} // Basic update, could add debouncing
              placeholder={t('amountPlaceholder')}
              min="0"
              step="any"
              className="text-lg dark:bg-gray-700 dark:text-white p-3 border rounded-md shadow-sm"
              disabled={loadingRates || calculating}
            />
        </div>

        {/* Row 2: Currency Selectors and Swap */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          {/* From Currency */}
          <div className="w-full sm:flex-1 space-y-1.5">
             <label htmlFor="fromCurrency" className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('fromLabel')}</label>
             <Select
                value={fromCurrency}
                onValueChange={setFromCurrency}
                disabled={loadingRates || calculating}
             >
                <SelectTrigger id="fromCurrency" className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 p-3 text-base border rounded-md shadow-sm">
                    {/* Add Flag/Name here later if possible */}
                    <SelectValue placeholder={t('selectPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:text-white">
                    {currencies.map(currency => (
                        <SelectItem key={currency} value={currency} className="dark:hover:bg-gray-700 text-base">
                            {/* Add Flag/Name here later if possible */}
                            {currency}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>

          {/* Swap Button */}
          <div className="self-end py-1 sm:py-0">
            <Button
                variant="outline"
                size="icon"
                className="rounded-full border bg-white dark:bg-gray-700 dark:border-gray-600 shadow-sm mt-5 sm:mt-0" // Adjusted margin-top for mobile
                onClick={handleSwapCurrencies}
                disabled={loadingRates || calculating}
                aria-label="Swap currencies"
            >
                 <ArrowLeftRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </Button>
          </div>

          {/* To Currency */}
           <div className="w-full sm:flex-1 space-y-1.5">
             <label htmlFor="toCurrency" className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('toLabel')}</label>
            <Select
                value={toCurrency}
                onValueChange={setToCurrency}
                disabled={loadingRates || calculating}
            >
                <SelectTrigger id="toCurrency" className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 p-3 text-base border rounded-md shadow-sm">
                    {/* Add Flag/Name here later if possible */}
                    <SelectValue placeholder={t('selectPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:text-white">
                    {currencies.map(currency => (
                        <SelectItem key={currency} value={currency} className="dark:hover:bg-gray-700 text-base">
                            {/* Add Flag/Name here later if possible */}
                            {currency}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
           </div>
        </div>

         {/* Calculate Button - Optional? Calculation now happens on change/load */}
         {/* If you want explicit button: */}
         <Button
            onClick={() => handleConvert()} // Force re-calculation
            disabled={loadingRates || calculating || !amount || !fromCurrency || !toCurrency}
            className="w-full font-semibold bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
         >
            {calculating ? t('convertingButton') : t('convertButton')}
         </Button>

        {/* Status/Result Area */}
        <div className="mt-5 space-y-3 pt-4 border-t dark:border-gray-700">
            {/* Loading Indicator (Initial Fetch only maybe?) */}
            {loadingRates && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">{t('loadingRates')}</p>
            )}

            {/* Error Alert */}
            {error && !loadingRates && (
                 <Alert variant="destructive" className="text-sm">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Result Display Area - More detailed */}
            {result !== null && !calculating && !error && !loadingRates && (
              <div className="space-y-2 text-gray-800 dark:text-gray-200">
                 <p className="text-sm text-gray-600 dark:text-gray-400">
                    {parseFloat(amount).toLocaleString()} {fromCurrency} =
                 </p>
                 <p className="text-3xl font-bold">
                    {/* Format result with appropriate decimals */}
                    {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} {/* More decimals */}
                    <span className="ml-2 text-2xl font-medium text-gray-700 dark:text-gray-300">{toCurrency}</span>
                    {/* Add full currency name here later? */}
                 </p>
                 {inverseRate !== null && (
                     <p className="text-sm text-gray-500 dark:text-gray-400">
                        1 {toCurrency} = {inverseRate.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6})} {fromCurrency}
                     </p>
                 )}
                 {lastUpdateTimestamp && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 pt-1">
                        {/* Improve locale/formatting later */}
                        Última atualização: {formatTimestamp(lastUpdateTimestamp)}
                    </p>
                 )}
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
