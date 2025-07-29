'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";

const BinaryCalculator = () => {
  const t = useTranslations('Calculators.binario');
  const [binary1, setBinary1] = useState('');
  const [binary2, setBinary2] = useState('');
  const [operation, setOperation] = useState(t('operations.add'));
  const [binaryResult, setBinaryResult] = useState('');
  const [decimalResult, setDecimalResult] = useState('');

  const calculate = () => {
    if (operation === t('operations.divide') && binary2 === '0') {
      alert(t('divideByZero'));
      setBinaryResult('');
      setDecimalResult('');
      return;
    }

    if (!/^[01]+$/.test(binary1) || !/^[01]+$/.test(binary2)) {
      alert(t('invalidInput'));
      return;
    }

    const num1 = parseInt(binary1, 2);
    const num2 = parseInt(binary2, 2);

    if (isNaN(num1) || isNaN(num2)) {
      alert(t('invalidInput'));
      return;
    }

    let result;
    switch (operation) {
      case t('operations.add'):
        result = num1 + num2;
        break;
      case t('operations.subtract'):
        result = num1 - num2;
        break;
      case t('operations.multiply'):
        result = num1 * num2;
        break;
      case t('operations.divide'):
        result = Math.floor(num1 / num2);
        break;
      default:
        result = 0;
    }

    setBinaryResult(result.toString(2));
    setDecimalResult(result.toString());
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            {t('description')}
          </p>
          <div className="grid gap-2">
            <label htmlFor="binary1">{t('binary1Label')}</label>
            <Input
              type="text"
              id="binary1"
              placeholder={t('binary1Label')}
              value={binary1}
              onChange={(e) => setBinary1(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="operation">{t('operationLabel')}</label>
            <Select onValueChange={(value) => setOperation(value)}>
              <SelectTrigger id="operation">
                <SelectValue placeholder={t('operations.add')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={t('operations.add')}>{t('operations.add')}</SelectItem>
                <SelectItem value={t('operations.subtract')}>{t('operations.subtract')}</SelectItem>
                <SelectItem value={t('operations.multiply')}>{t('operations.multiply')}</SelectItem>
                <SelectItem value={t('operations.divide')}>{t('operations.divide')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="binary2">{t('binary2Label')}</label>
            <Input
              type="text"
              id="binary2"
              placeholder={t('binary2Label')}
              value={binary2}
              onChange={(e) => setBinary2(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={calculate} className="bg-primary text-primary-foreground rounded-md px-4 py-2 hover:bg-primary/80">
              {t('calculateButton')}
            </Button>
            <Button onClick={() => {
              setBinary1('');
              setBinary2('');
              setBinaryResult('');
              setDecimalResult('');
              setOperation(t('operations.add'));
            }} variant="outline" className="rounded-md px-4 py-2">
              {t('clearButton')}
            </Button>
          </div>
          {binaryResult !== '' && (
            <Card className="mt-4 bg-amber-50 p-4">
              <CardContent className="p-0">
                <p className="mb-2">
                  {t('binaryResult')} <br />
                  {binary1} {
                    operation === t('operations.add') ? '+' : 
                    operation === t('operations.subtract') ? '-' : 
                    operation === t('operations.multiply') ? '*' : 
                    operation === t('operations.divide') ? '/' : 
                    ''
                  } {binary2} = <strong>{binaryResult}</strong>
                </p>
                <p>
                  {t('decimalResult')} <br />
                  {parseInt(binary1, 2)} {
                    operation === t('operations.add') ? '+' : 
                    operation === t('operations.subtract') ? '-' : 
                    operation === t('operations.multiply') ? '*' : 
                    operation === t('operations.divide') ? '/' : 
                    ''
                  } {parseInt(binary2, 2)} = <strong>{decimalResult}</strong>
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BinaryCalculator;
