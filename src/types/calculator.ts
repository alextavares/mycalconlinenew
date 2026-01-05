import { LucideIcon } from 'lucide-react';

export type CalculatorCategory =
    | 'math'
    | 'finance'
    | 'health'
    | 'conversion'
    | 'physics'
    | 'chemistry'
    | 'construction'
    | 'food'
    | 'everyday'
    | 'sports'
    | 'statistics'
    | 'ecology'
    | 'biology'
    | 'education'
    | 'other';

export interface CalculatorInput {
    id: string;
    label: string;
    type: 'number' | 'text' | 'select' | 'date' | 'checkbox'; // Extended for future
    placeholder?: string;
    defaultValue?: string | number | boolean;
    options?: { label: string; value: string }[]; // For select inputs
    unit?: string; // e.g. "kg", "m", "$"
    condition?: (inputs: Record<string, any>) => boolean; // For conditional rendering
}

export interface CalculatorOutput {
    label: string;
    // The formula function receives a map of input values (by id) and returns a result string or number
    calculate: (inputs: Record<string, number | string>) => string | number;
    unit?: string;
}

export interface CalculatorContent {
    whatIs?: string; // HTML or Markdown content
    howTo?: string; // HTML or Markdown content
    faq?: Array<{ question: string; answer: string }>;
}

export interface CalculatorConfig {
    id: string; // The slug for the URL (e.g. "meters-to-feet")
    title: string;
    description: string;
    category: CalculatorCategory;
    icon?: string; // Name of the Lucide icon

    inputs: CalculatorInput[];
    outputs: CalculatorOutput[]; // Can interpret multiple results

    content?: CalculatorContent;

    meta?: {
        title: string;
        description: string;
        keywords?: string[];
    };
}
