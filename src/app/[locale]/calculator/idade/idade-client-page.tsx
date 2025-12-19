"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

export default function IdadeClientPage() {
  const t = useTranslations("AgeCalculator");
  const [birthDate, setBirthDate] = useState<{ day: number | ""; month: number | ""; year: number | "" }>({
    day: "",
    month: "",
    year: "",
  });
  const [measurementDate, setMeasurementDate] = useState<{ day: number; month: number; year: number }>(() => {
    const now = new Date();
    return { day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear() };
  });
  const [age, setAge] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalWeeks: number;
    totalMonths: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateAge = () => {
    setError(null);
    setAge(null);

    if (!birthDate.day || !birthDate.month || !birthDate.year) {
      setError(t("errorFillBirthDate"));
      return;
    }

    const birth = new Date(birthDate.year, birthDate.month - 1, birthDate.day);
    const measure = new Date(measurementDate.year, measurementDate.month - 1, measurementDate.day);

    if (isNaN(birth.getTime()) || isNaN(measure.getTime())) {
      setError(t("errorInvalidDate"));
      return;
    }

    if (measure < birth) {
      setError(t("errorMeasurementBeforeBirth"));
      return;
    }

    let years = measure.getFullYear() - birth.getFullYear();
    let months = measure.getMonth() - birth.getMonth();
    let days = measure.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastDayOfPreviousMonth = new Date(measure.getFullYear(), measure.getMonth(), 0).getDate();
      days += lastDayOfPreviousMonth;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const diffTime = Math.abs(measure.getTime() - birth.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    setAge({ years, months, days, totalDays, totalWeeks, totalMonths });
  };

  const months = [
    t("january"), t("february"), t("march"), t("april"),
    t("may"), t("june"), t("july"), t("august"),
    t("september"), t("october"), t("november"), t("december")
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data de nascimento */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("birthDateLabel")}</label>
              <div className="flex flex-wrap gap-2">
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={birthDate.day}
                  onChange={(e) => setBirthDate({ ...birthDate, day: e.target.value ? Number(e.target.value) : "" })}
                  aria-label={t("dayLabel")}
                >
                  <option value="">{t("dayLabel")}</option>
                  {Array.from({ length: 31 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {String(i + 1).padStart(2, "0")}
                    </option>
                  ))}
                </select>

                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={birthDate.month}
                  onChange={(e) => setBirthDate({ ...birthDate, month: e.target.value ? Number(e.target.value) : "" })}
                  aria-label={t("monthLabel")}
                >
                  <option value="">{t("monthLabel")}</option>
                  {months.map((label, index) => (
                    <option key={label} value={index + 1}>
                      {label}
                    </option>
                  ))}
                </select>

                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder={t("yearLabel")}
                  className="h-10 w-24 text-sm"
                  value={birthDate.year}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") {
                      setBirthDate({ ...birthDate, year: "" });
                      return;
                    }
                    if (!/^\d+$/.test(raw)) return;
                    const year = Number(raw);
                    if (year >= 1900 && year <= new Date().getFullYear()) {
                      setBirthDate({ ...birthDate, year });
                    }
                  }}
                  aria-label={t("yearLabel")}
                />
              </div>
            </div>

            {/* Data de medição */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("measurementDateLabel")}</label>
              <div className="flex flex-wrap gap-2">
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={measurementDate.day}
                  onChange={(e) => setMeasurementDate({ ...measurementDate, day: Number(e.target.value) })}
                  aria-label={t("dayLabel")}
                >
                  {Array.from({ length: 31 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {String(i + 1).padStart(2, "0")}
                    </option>
                  ))}
                </select>

                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={measurementDate.month}
                  onChange={(e) => setMeasurementDate({ ...measurementDate, month: Number(e.target.value) })}
                  aria-label={t("monthLabel")}
                >
                  {months.map((label, index) => (
                    <option key={label} value={index + 1}>
                      {label}
                    </option>
                  ))}
                </select>

                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder={t("yearLabel")}
                  className="h-10 w-24 text-sm"
                  value={measurementDate.year}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (!/^\d+$/.test(raw)) return;
                    const year = Number(raw);
                    if (year >= 1900 && year <= new Date().getFullYear() + 50) {
                      setMeasurementDate({ ...measurementDate, year });
                    }
                  }}
                  aria-label={t("yearLabel")}
                />
              </div>
            </div>
          </div>

          <Button onClick={calculateAge} className="w-full" size="lg">
            {t("calculateButton")}
          </Button>

          {error && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-4">
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}

          {age && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4 space-y-3">
                <p className="text-sm text-muted-foreground">{t("resultLabel")}</p>
                <p className="font-bold text-3xl text-green-700">
                  {age.years} {t("years")}, {age.months} {t("months")} {t("and")} {age.days} {t("days")}
                </p>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-semibold">{age.totalDays.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{t("totalDays")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold">{age.totalWeeks.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{t("totalWeeks")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold">{age.totalMonths}</p>
                    <p className="text-xs text-muted-foreground">{t("totalMonths")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
