// src/app/calculator/idade/page.tsx
"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR, enUS, es } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [measurementDate, setMeasurementDate] = useState<Date | undefined>(new Date());
  const [age, setAge] = useState<string | null>(null);

  const calculateAge = () => {
    if (!birthDate || !measurementDate) {
      setAge("Preencha ambas as datas.");
      return;
    }

    if (measurementDate < birthDate) {
      setAge("A data de medição não pode ser anterior à data de nascimento.");
      return;
    }

    // Calculate exact age using proper date arithmetic
    let years = measurementDate.getFullYear() - birthDate.getFullYear();
    let months = measurementDate.getMonth() - birthDate.getMonth();
    let days = measurementDate.getDate() - birthDate.getDate();

    // Adjust for negative days
    if (days < 0) {
      months--;
      const lastDayOfPreviousMonth = new Date(
        measurementDate.getFullYear(),
        measurementDate.getMonth(),
        0
      ).getDate();
      days += lastDayOfPreviousMonth;
    }

    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }

    setAge(`${years} anos, ${months} meses e ${days} dias`);
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Calculadora de Idade Online</CardTitle>
          <CardDescription>
            Utilize nosso contador da idade cronológica exata com base em uma data de nascimento. Descubra quantos anos uma
            pessoa tem, com precisão de meses e dias.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campo de data de nascimento simplificado no estilo concorrente:
                selects individuais para dia, mês e ano, mantendo a usabilidade mobile */}
            <div className="space-y-2">
              <label htmlFor="birth-date" className="text-sm font-medium">
                Data de nascimento
              </label>
              <div className="flex flex-wrap gap-2">
                {/* Dia */}
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={birthDate ? birthDate.getDate() : ""}
                  onChange={(e) => {
                    const day = Number(e.target.value);
                    if (!day) {
                      setBirthDate(undefined);
                      return;
                    }
                    const base = birthDate ?? new Date(2000, 0, 1);
                    const next = new Date(
                      base.getFullYear(),
                      base.getMonth(),
                      day
                    );
                    if (!isNaN(next.getTime())) setBirthDate(next);
                  }}
                >
                  <option value="">Dia</option>
                  {Array.from({ length: 31 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {String(i + 1).padStart(2, "0")}
                    </option>
                  ))}
                </select>

                {/* Mês */}
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={birthDate ? birthDate.getMonth() + 1 : ""}
                  onChange={(e) => {
                    const month = Number(e.target.value);
                    if (!month) {
                      setBirthDate(undefined);
                      return;
                    }
                    const base = birthDate ?? new Date(2000, 0, 1);
                    const next = new Date(
                      base.getFullYear(),
                      month - 1,
                      base.getDate()
                    );
                    if (!isNaN(next.getTime())) setBirthDate(next);
                  }}
                >
                  <option value="">Mês</option>
                  {[
                    "Janeiro",
                    "Fevereiro",
                    "Março",
                    "Abril",
                    "Maio",
                    "Junho",
                    "Julho",
                    "Agosto",
                    "Setembro",
                    "Outubro",
                    "Novembro",
                    "Dezembro",
                  ].map((label, index) => (
                    <option key={label} value={index + 1}>
                      {label}
                    </option>
                  ))}
                </select>

                {/* Ano */}
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="Ano"
                  className="h-10 max-w-[96px] text-sm"
                  value={birthDate ? birthDate.getFullYear() : ""}
                  onChange={(e) => {
                    const raw = e.target.value;

                    // permite apagar completamente
                    if (raw === "") {
                      setBirthDate(undefined);
                      return;
                    }

                    // permite apenas dígitos, evitando estados NaN
                    if (!/^\d+$/.test(raw)) {
                      return;
                    }

                    const year = Number(raw);
                    const currentYear = new Date().getFullYear();

                    // não deixa sair da faixa, mas mantém a digitação estável
                    if (year < 1900 || year > currentYear) {
                      return;
                    }

                    const base = birthDate ?? new Date(2000, 0, 1);
                    const day =
                      base.getDate() > 28 ? 28 : base.getDate(); // evita datas inválidas
                    const next = new Date(year, base.getMonth(), day);

                    if (!isNaN(next.getTime())) {
                      setBirthDate(next);
                    }
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Escolha o dia, o mês e digite o ano para definir rapidamente sua data de nascimento.
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="measurement-date" className="text-sm font-medium">
                Data de medição
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !measurementDate && "text-muted-foreground"
                    )}
                  >
                    {measurementDate
                      ? format(measurementDate, "dd/MM/yyyy", { locale: ptBR })
                      : <span>Selecione a data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 space-y-2" align="start">
                  <div className="flex gap-2 items-center px-3 pt-3">
                    <Input
                      type="number"
                      inputMode="numeric"
                      placeholder="Ano"
                      className="w-24 h-8 text-xs"
                      defaultValue={measurementDate ? measurementDate.getFullYear() : new Date().getFullYear()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const value = (e.target as HTMLInputElement).value;
                          const year = parseInt(value, 10);
                          if (!isNaN(year) && year >= 1900 && year <= new Date().getFullYear() + 50) {
                            const current = measurementDate ?? new Date();
                            const newDate = new Date(year, current.getMonth(), current.getDate());
                            if (!isNaN(newDate.getTime())) {
                              setMeasurementDate(newDate);
                            }
                          }
                        }
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      Digite o ano e pressione Enter para ir direto.
                    </span>
                  </div>
                  <Calendar
                    mode="single"
                    selected={measurementDate}
                    onSelect={setMeasurementDate}
                    initialFocus
                    locale={ptBR}
                    captionLayout="dropdown"
                    fromYear={1900}
                    toYear={new Date().getFullYear() + 50}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Button onClick={calculateAge} className="w-full">
            Calcular idade
          </Button>
          {age && (
            <Card className="bg-amber-50">
              <CardContent>
                <p>A idade cronológica é: </p>
                <p className="font-bold text-2xl">{age}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}