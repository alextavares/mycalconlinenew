import { LucideIcon } from 'lucide-react';

export type CalculatorCategory =
    | 'math'
    | 'mathematics'
    | 'finance'
    | 'health'
    | 'fitness'
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
    | 'electronics'
    | 'geometry'
    | 'astronomy'
    | 'photography'
    | 'gaming'
    | 'utilities'
    | 'calendar'
    | 'marketing'
    | 'text'
    | 'web'
    | 'other';

export interface CalculatorInput {
    id: string;
    label: string;
    type: 'number' | 'text' | 'select' | 'date' | 'checkbox' | 'time' | 'string';
    placeholder?: string | ((inputs: Record<string, any>) => string);
    defaultValue?: string | number | boolean;
    options?: { label: string; value: string }[];
    unit?: string;
    condition?: (inputs: Record<string, any>) => boolean;
    min?: number;
    max?: number;
    width?: string;
    primaryUnit?: string;
    step?: number;
}

export interface CalculatorOutput {
    id?: string; // Optional identifier for outputs
    label: string;
    // The formula function receives a map of input values (by id) and returns a result string or number
    calculate: (inputs: Record<string, number | string>, outputs?: any) => string | number;
    unit?: string;
    currency?: string; // Currency symbol for financial outputs
    format?: {
        notation?: string;
        precision?: number;
    };
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
