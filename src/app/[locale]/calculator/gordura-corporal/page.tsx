'use client';
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";

export default function BodyFatCalculator() {
  const [result, setResult] = useState<number | null>(null);

  const form = useForm({
    defaultValues: {
      height: "",
      weight: "",
      age: "",
      gender: "Masculino",
    },
  });

  function calculateBodyFat(height: number, weight: number, age: number, gender: string) {
    let bmi = weight / ((height / 100) ** 2);
    let bodyFat: number;
    if (gender === "Masculino") {
      bodyFat = 1.2 * bmi + 0.23 * age - 16.2;
    } else {
      bodyFat = 1.2 * bmi + 0.23 * age - 5.4;
    }

    return bodyFat;
  }

  function onSubmit(values: any) {
    const height = parseFloat(values.height);
    const weight = parseFloat(values.weight);
    const age = parseInt(values.age);
    const gender = values.gender;

    if (isNaN(height) || isNaN(weight) || isNaN(age)) {
      setResult(null)
      return;
    }

    const bodyFat = calculateBodyFat(height, weight, age, gender);
    setResult(parseFloat(bodyFat.toFixed(2)));
  }

  return (
    <div className="container flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Porcentagem de Gordura Corporal</h1>
      <p className="text-sm text-muted-foreground">
        Digite seus dados para calcular o índice ou porcentagem de gordura corporal,
        ajustados para sua idade e gênero. Use um ponto como separador decimal.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Altura (cm)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="180" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso (kg)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="74.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Idade</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="30" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gênero</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Calcular</Button>
        </form>
      </Form>
      {result !== null && (
        <div className="mt-4 rounded-md border p-4 bg-stone-100">
          <p>
            Seu Porcentagem de Gordura Corporal é: <span className="font-bold">{result}%</span>
          </p>
        </div>
      )}
    </div>
  );
}
