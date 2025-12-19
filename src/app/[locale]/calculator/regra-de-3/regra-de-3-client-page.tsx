'use client'
import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SimpleSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}

const SimpleSelect = ({ value, onValueChange, options, className }: SimpleSelectProps) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className || ''}`}
  >
    {options.map(option => (
      <option key={option.value} value={option.value}>{option.label}</option>
    ))}
  </select>
);

export default function RegraDe3ClientPage() {
  const t = useTranslations('RuleOfThreeCalculator');
  const [a, setA] = useState<string>('');
  const [b, setB] = useState<string>('');
  const [c, setC] = useState<string>('');
  const [type, setType] = useState<'Direta' | 'Inversa'>('Direta');

  const { result, formula } = useMemo(() => {
    if (!a || !b || !c) {
      return { result: '', formula: '' };
    }

    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);

    if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
      return { result: '', formula: '' };
    }

    let newX: number;
    let formulaText: string;

    if (type === 'Direta') {
      if (numA === 0) {
        return { result: 'Erro: divisão por zero', formula: '' };
      }
      newX = (numB * numC) / numA;
      formulaText = `x = (b × c) ÷ a = (${numB} × ${numC}) ÷ ${numA} = ${newX.toFixed(2)}`;
    } else {
      if (numC === 0) {
        return { result: 'Erro: divisão por zero', formula: '' };
      }
      newX = (numA * numB) / numC;
      formulaText = `x = (a × b) ÷ c = (${numA} × ${numB}) ÷ ${numC} = ${newX.toFixed(2)}`;
    }

    return { result: newX.toFixed(2), formula: formulaText };
  }, [a, b, c, type]);

  const selectOptions = useMemo(() => [
    { value: 'Direta', label: t('directOption') },
    { value: 'Inversa', label: t('inverseOption') }
  ], [t]);

  const handleAChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setA(e.target.value);
  }, []);

  const handleBChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setB(e.target.value);
  }, []);

  const handleCChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setC(e.target.value);
  }, []);

  const handleTypeChange = useCallback((value: string) => {
    setType(value as 'Direta' | 'Inversa');
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto rounded-lg border bg-card shadow-sm">
      <div className="p-6">
        <div className="grid gap-4">
          {/* Visual representation */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="grid grid-cols-3 items-center gap-2 text-center">
              <div className="flex flex-col">
                <Label htmlFor="a" className="text-blue-700 font-semibold">a</Label>
                <Input
                  id="a"
                  type="number"
                  value={a}
                  onChange={handleAChange}
                  placeholder="0"
                  className="text-center"
                />
              </div>
              <div className="text-2xl font-bold text-blue-600">÷</div>
              <div className="flex flex-col">
                <Label htmlFor="b" className="text-blue-700 font-semibold">b</Label>
                <Input
                  id="b"
                  type="number"
                  value={b}
                  onChange={handleBChange}
                  placeholder="0"
                  className="text-center"
                />
              </div>
            </div>
            <div className="text-center text-2xl font-bold text-blue-600 my-2">=</div>
            <div className="grid grid-cols-3 items-center gap-2 text-center">
              <div className="flex flex-col">
                <Label htmlFor="c" className="text-green-700 font-semibold">c</Label>
                <Input
                  id="c"
                  type="number"
                  value={c}
                  onChange={handleCChange}
                  placeholder="0"
                  className="text-center"
                />
              </div>
              <div className="text-2xl font-bold text-green-600">÷</div>
              <div className="flex flex-col">
                <Label htmlFor="x" className="text-green-700 font-semibold">x</Label>
                <Input
                  id="x"
                  type="text"
                  value={result}
                  readOnly
                  placeholder="?"
                  className="text-center font-bold bg-green-50 border-green-300"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="type" className="min-w-fit">{t('typeLabel')}</Label>
            <SimpleSelect
              value={type}
              onValueChange={handleTypeChange}
              options={selectOptions}
            />
          </div>

          {formula && (
            <div className="bg-gray-50 p-3 rounded-lg border">
              <Label className="text-gray-700 font-semibold">{t('formulaLabel')}</Label>
              <div className="font-mono text-sm mt-1 p-2 bg-white rounded border">
                {formula}
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            {t('helpText')}
          </p>
        </div>
      </div>
    </div>
  );
}
