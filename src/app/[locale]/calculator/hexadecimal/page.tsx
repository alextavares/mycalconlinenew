'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import { useToast } from "@/hooks/use-toast";

const HexadecimalCalculator = () => {
  const t = useTranslations('Calculators.hexadecimal.calculator');
  const { toast } = useToast();
  const [hex1, setHex1] = useState('');
  const [hex2, setHex2] = useState('');
  const [operation, setOperation] = useState(t('operations.add'));
  const [hexResult, setHexResult] = useState('');
  const [decimalResult, setDecimalResult] = useState('');

  const calculate = () => {
    if (operation === t('operations.divide') && hex2 === '0') {
      toast({
        title: t('divideByZero'),
        description: "Cannot divide by zero in hexadecimal operations.",
        variant: "destructive",
      });
      setHexResult('');
      setDecimalResult('');
      return;
    }

    if (!/^[0-9A-Fa-f]+$/.test(hex1) || !/^[0-9A-Fa-f]+$/.test(hex2)) {
      toast({
        title: t('invalidInput'),
        description: "Please enter valid hexadecimal numbers (0-9, A-F).",
        variant: "destructive",
      });
      return;
    }

    const num1 = parseInt(hex1, 16);
    const num2 = parseInt(hex2, 16);

    if (isNaN(num1) || isNaN(num2)) {
      toast({
        title: t('invalidInput'),
        description: "Invalid hexadecimal numbers.",
        variant: "destructive",
      });
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

    setHexResult(result.toString(16).toUpperCase());
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
            <label htmlFor="hex1">{t('hex1Label')}</label>
            <Input
              type="text"
              id="hex1"
              placeholder="Ex: F"
              value={hex1}
              onChange={(e) => setHex1(e.target.value.toUpperCase())}
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
            <label htmlFor="hex2">{t('hex2Label')}</label>
            <Input
              type="text"
              id="hex2"
              placeholder="Ex: A"
              value={hex2}
              onChange={(e) => setHex2(e.target.value.toUpperCase())}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={calculate}
              className="bg-primary text-primary-foreground rounded-md px-4 py-2 hover:bg-primary/80"
            >
              {t('calculateButton')}
            </Button>
            <Button
              onClick={() => {
                setHex1('');
                setHex2('');
                setHexResult('');
                setDecimalResult('');
                setOperation(t('operations.add'));
              }}
              variant="outline"
              className="rounded-md px-4 py-2"
            >
              {t('clearButton')}
            </Button>
          </div>
          {hexResult !== '' && (
            <Card className="mt-4 bg-amber-50 p-4">
              <CardContent className="p-0">
                <p className="mb-2">
                  {t('hexResult')} <br />
                  {hex1} {
                    operation === t('operations.add') ? '+' :
                    operation === t('operations.subtract') ? '-' :
                    operation === t('operations.multiply') ? '*' :
                    operation === t('operations.divide') ? '/' :
                    ''
                  } {hex2} = <strong>{hexResult}</strong>
                </p>
                <p>
                  {t('decResult')} <br />
                  {parseInt(hex1, 16)} {
                    operation === t('operations.add') ? '+' :
                    operation === t('operations.subtract') ? '-' :
                    operation === t('operations.multiply') ? '*' :
                    operation === t('operations.divide') ? '/' :
                    ''
                  } {parseInt(hex2, 16)} = <strong>{decimalResult}</strong>
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HexadecimalCalculator;
