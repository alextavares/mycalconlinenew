/**
 * Calculator Template
 * 
 * USE THIS AS THE BASE FOR ALL NEW CALCULATORS.
 * Copy this structure and replace the REPLACE_* placeholders.
 * 
 * RULES:
 * 1. The `id` must be unique and follow kebab-case (e.g., 'compound-interest')
 * 2. The `category` must be one of the valid CalculatorCategory values
 * 3. All `calculate` functions must use `(inputs: Record<string, any>) =>`
 * 4. Never use `primaryUnit`, always use `unit`
 * 5. Never use `width` property on inputs
 * 6. The `calculate` function must return `string | number`, never `null` or `undefined`
 */

import { CalculatorConfig, CalculatorCategory } from '@/types/calculator';

// Valid categories (use exactly these values)
export const VALID_CATEGORIES: CalculatorCategory[] = [
    'math',
    'finance',
    'health',
    'physics',
    'everyday',
    'conversion',
    'science',
    'construction',
    'ecology',
    'food',
    'sports',
    'statistics',
    'other'
];

// Template for a new calculator
export const calculatorTemplate: CalculatorConfig = {
    id: 'REPLACE_ID', // e.g., 'compound-interest'
    title: 'REPLACE_TITLE', // e.g., 'Compound Interest Calculator'
    description: 'REPLACE_DESCRIPTION', // Short description
    category: 'math' as CalculatorCategory, // Change to appropriate category
    icon: 'calculator-icon', // Use a valid icon name

    meta: {
        title: 'REPLACE_META_TITLE | MyCalcOnline', // SEO title
        description: 'REPLACE_META_DESCRIPTION', // SEO description (max 160 chars)
        keywords: ['keyword1', 'keyword2', 'keyword3'] // Array of keywords
    },

    inputs: [
        {
            id: 'input1', // Unique within this calculator
            label: 'Input Label',
            type: 'number', // 'number' | 'select' | 'checkbox'
            placeholder: 'Enter value',
            defaultValue: '0', // Optional
            unit: '$', // Optional, replaces primaryUnit
            min: 0, // Optional
            max: 100, // Optional
            step: 1 // Optional
        }
        // Add more inputs as needed
    ],

    outputs: [
        {
            label: 'Result Label',
            unit: '$', // Optional
            calculate: (inputs: Record<string, any>) => {
                // Your calculation logic here
                // MUST return string | number, never null/undefined
                const value = Number(inputs.input1) || 0;
                return value * 2;
            }
        }
        // Add more outputs as needed
    ],

    content: {
        whatIs: 'REPLACE_ID.whatIs', // Translation key
        howTo: 'REPLACE_ID.howTo',   // Translation key
        faq: [] // Array of { question: string, answer: string } or empty
    }
};

/**
 * Example of a complete calculator:
 */
export const exampleCalculator: CalculatorConfig = {
    id: 'percentage-increase',
    title: 'Percentage Increase Calculator',
    description: 'Calculate the percentage increase between two values.',
    category: 'math',
    icon: 'percent-icon',

    meta: {
        title: 'Percentage Increase Calculator | MyCalcOnline',
        description: 'Easily calculate the percentage increase between two numbers. Free online tool with instant results.',
        keywords: ['percentage increase', 'percent change', 'growth calculator']
    },

    inputs: [
        {
            id: 'initialValue',
            label: 'Initial Value',
            type: 'number',
            placeholder: 'Enter initial value',
            defaultValue: '100'
        },
        {
            id: 'finalValue',
            label: 'Final Value',
            type: 'number',
            placeholder: 'Enter final value',
            defaultValue: '150'
        }
    ],

    outputs: [
        {
            label: 'Percentage Increase',
            unit: '%',
            calculate: (inputs: Record<string, any>) => {
                const initial = Number(inputs.initialValue);
                const final = Number(inputs.finalValue);
                if (!initial) return 0;
                return (((final - initial) / initial) * 100).toFixed(2);
            }
        }
    ],

    content: {
        whatIs: 'percentage-increase.whatIs',
        howTo: 'percentage-increase.howTo',
        faq: []
    }
};
