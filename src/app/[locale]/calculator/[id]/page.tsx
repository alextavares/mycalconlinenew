import React from "react";
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { calculators } from "@/config/calculators";
import { CalculatorConfig } from "@/types/calculator";
import * as LucideIcons from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CalculatorEngineClient } from "./engine-client";

interface CalculatorProps {
  params: { id: string; locale: string };
}

// Generates metadata dynamically based on the calculator config
export async function generateMetadata({ params }: CalculatorProps): Promise<Metadata> {
  const calculatorId = params.id;
  const calculator = calculators[calculatorId];

  // If calculator not found in registry, return default 404-like metadata
  if (!calculator) {
    return {
      title: 'Calculator Not Found | MyCalcOnline',
      description: 'The requested calculator could not be found.',
    };
  }

  const siteUrl = 'https://mycalconline.com';

  return {
    title: calculator.meta?.title || `${calculator.title} | MyCalcOnline`,
    description: calculator.meta?.description || calculator.description,
    keywords: calculator.meta?.keywords || [calculator.title, 'calculator', 'online', 'free'],
    alternates: {
      canonical: `${siteUrl}/${params.locale}/calculator/${calculatorId}`,
      languages: {
        'en': `${siteUrl}/en/calculator/${calculatorId}`,
        'pt-BR': `${siteUrl}/pt-BR/calculator/${calculatorId}`,
      },
    },
  };
}

export default function CalculatorPage({ params }: CalculatorProps) {
  const calculator = calculators[params.id];

  if (!calculator) {
    return <div className="container mx-auto py-10">Calculadora não encontrada.</div>;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: calculator.title,
    description: calculator.meta?.description || calculator.description,
    url: `https://mycalconline.com/${params.locale}/calculator/${params.id}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CalculatorEngineClient calculatorId={params.id} />
    </div>
  );
}
