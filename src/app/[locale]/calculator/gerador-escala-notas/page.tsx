'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl'; // Import useTranslations
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Schema remains the same
const formSchema = z.object({
  maxScore: z.coerce.number().min(1),
  scoreIncrement: z.coerce.number().min(0.1), // Allow smaller increments
  minGrade: z.coerce.number().min(0).max(10),
  maxGrade: z.coerce.number().min(0).max(10),
  passingGrade: z.coerce.number().min(0).max(10),
  exigencyLevel: z.coerce.number().min(0).max(100),
}).refine((data) => data.maxGrade >= data.minGrade, { // Add validation
    message: "Maximum grade must be greater than or equal to minimum grade",
    path: ["maxGrade"],
});

type FormValues = z.infer<typeof formSchema>;

export default function GradeScaleCalculator() {
  const t = useTranslations('gerador-escala-notas'); // CORRECTED: Use top-level key
  const [gradeScale, setGradeScale] = useState<
    { score: number; grade: number }[]
  >([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maxScore: 100,
      scoreIncrement: 1,
      minGrade: 0,
      maxGrade: 10,
      passingGrade: 5,
      exigencyLevel: 60,
    },
  });

  function calculateGrade(
    score: number,
    maxScore: number,
    minGrade: number,
    maxGrade: number,
    exigencyLevel: number
  ) {
    if (maxScore <= 0) return minGrade; // Avoid division by zero
    const exigencyFactor = exigencyLevel / 100;
    // Calculate score required for minimum grade (linear interpolation)
    const minScoreRequired = maxScore * (1 - exigencyFactor);
    
    if (score < minScoreRequired) {
        return minGrade;
    }

    // Calculate the effective score range after applying exigency
    const effectiveScoreRange = maxScore - minScoreRequired;
    if (effectiveScoreRange <= 0) return maxGrade; // If exigency is 100%, all scores above min get max grade

    // Calculate grade based on the score within the effective range
    const gradeRange = maxGrade - minGrade;
    const scoreRatio = (score - minScoreRequired) / effectiveScoreRange;
    const grade = minGrade + gradeRange * scoreRatio;

    const finalGrade = Math.min(Math.max(grade, minGrade), maxGrade);
    return finalGrade;
  }

  function onSubmit(values: FormValues) {
    const {
      maxScore,
      scoreIncrement,
      minGrade,
      maxGrade,
      exigencyLevel,
      // passingGrade is not used in calculation, only for display/context?
    } = values;
    const newGradeScale: { score: number; grade: number }[] = [];
    
    const safeScoreIncrement = Math.max(scoreIncrement, 0.01); // Allow very small increments

    for (let score = 0; score <= maxScore; score += safeScoreIncrement) {
        const currentScore = Math.min(score, maxScore); 
        const grade = calculateGrade(
            currentScore,
            maxScore,
            minGrade,
            maxGrade,
            exigencyLevel
        );
        newGradeScale.push({ score: currentScore, grade });
        if (currentScore === maxScore) break; 
    }
    
    // Ensure the maxScore itself is included if the loop didn't hit it exactly
    if (newGradeScale.length === 0 || newGradeScale[newGradeScale.length - 1].score < maxScore) {
         const grade = calculateGrade(maxScore, maxScore, minGrade, maxGrade, exigencyLevel);
         newGradeScale.push({ score: maxScore, grade });
    }
    
    setGradeScale(newGradeScale);
  }

  return (
    <div className="container mx-auto py-10">
      {/* Use translation for title */}
      <h1 className="text-3xl font-bold text-center mb-8">
        {t('title')}
      </h1>
      {/* Optional: Add description from translations */}
      {/* <p className="text-center text-muted-foreground mb-8">{t('description')}</p> */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 border rounded-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Translate form fields */}
              <FormField
                control={form.control}
                name="maxScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('maxScoreLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t('maxScorePlaceholder')}
                        step="any"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="scoreIncrement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('scoreIncrementLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t('scoreIncrementPlaceholder')}
                        step="any"
                        min="0.01" // Consistent with calculation logic
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minGrade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('minGradeLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t('minGradePlaceholder')}
                        step="any"
                        min="0"
                        max="10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxGrade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('maxGradeLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t('maxGradePlaceholder')}
                        step="any"
                        min="0"
                        max="10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passingGrade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('passingGradeLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t('passingGradePlaceholder')}
                        step="any"
                        min="0"
                        max="10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="exigencyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('exigencyLevelLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t('exigencyLevelPlaceholder')}
                        step="any"
                        min="0"
                        max="100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{t('generateButton')}</Button>
            </form>
          </Form>
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                {/* Translate table headers */}
                <TableHead>{t('scoreColumnHeader')}</TableHead>
                <TableHead>{t('gradeColumnHeader')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gradeScale.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.score.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell>{item.grade.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
