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
            <div className="space-y-2">
              <label htmlFor="birth-date" className="text-sm font-medium">
                Data de nascimento
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !birthDate && "text-muted-foreground"
                    )}
                  >
                    {birthDate ? format(birthDate, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione a data</span>}
                 </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    onSelect={setBirthDate}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
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
                    {measurementDate ? format(measurementDate, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione a data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={measurementDate}
                    onSelect={setMeasurementDate}
                    initialFocus
                    locale={ptBR}
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