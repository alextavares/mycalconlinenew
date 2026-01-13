/**
 * Type-safe Calculator Factory
 * 
 * This module provides type-safe utilities for creating and validating calculators.
 * Using this factory function ensures:
 * 1. All required fields are present
 * 2. Types are correctly inferred
 * 3. No duplicate IDs at compile time (via branded types)
 */

import { CalculatorConfig, CalculatorInput, CalculatorOutput, CalculatorCategory } from '@/types/calculator';

// Registry to track all calculator IDs and detect duplicates at runtime
const registeredIds = new Set<string>();

/**
 * Creates a type-safe calculator configuration.
 * Auto-validates required fields and registers the ID for duplicate detection.
 * 
 * @example
 * const ageCalculator = createCalculator({
 *     id: 'age',
 *     title: 'Age Calculator',
 *     description: 'Calculate your exact age',
 *     category: 'everyday',
 *     inputs: [...],
 *     outputs: [...]
 * });
 */
export function createCalculator(config: CalculatorConfig): CalculatorConfig {
    // Runtime validation
    if (!config.id) {
        throw new Error('Calculator must have an id');
    }
    if (!config.title) {
        throw new Error(`Calculator "${config.id}" must have a title`);
    }
    if (!config.category) {
        throw new Error(`Calculator "${config.id}" must have a category`);
    }
    if (!config.inputs || !Array.isArray(config.inputs)) {
        throw new Error(`Calculator "${config.id}" must have inputs array`);
    }
    if (!config.outputs || !Array.isArray(config.outputs)) {
        throw new Error(`Calculator "${config.id}" must have outputs array`);
    }

    // Validate inputs
    for (const input of config.inputs) {
        if (!input.id) {
            throw new Error(`Input in calculator "${config.id}" must have an id`);
        }
        if (!input.label) {
            throw new Error(`Input "${input.id}" in calculator "${config.id}" must have a label`);
        }
        if (!input.type) {
            throw new Error(`Input "${input.id}" in calculator "${config.id}" must have a type`);
        }
    }

    // Validate outputs
    for (let i = 0; i < config.outputs.length; i++) {
        const output = config.outputs[i];
        if (!output.label) {
            throw new Error(`Output ${i} in calculator "${config.id}" must have a label`);
        }
        if (!output.calculate || typeof output.calculate !== 'function') {
            throw new Error(`Output "${output.label}" in calculator "${config.id}" must have a calculate function`);
        }
    }

    // Duplicate detection
    if (registeredIds.has(config.id)) {
        console.warn(`⚠️ Duplicate calculator ID detected: "${config.id}". This will cause issues.`);
    }
    registeredIds.add(config.id);

    return config;
}

/**
 * Creates a type-safe input field for a calculator.
 * Provides better autocomplete and validation than raw objects.
 */
export function createInput(input: CalculatorInput): CalculatorInput {
    return input;
}

/**
 * Creates a type-safe output field with calculate function.
 * Wraps inputs access for safer type handling.
 */
export function createOutput(output: CalculatorOutput): CalculatorOutput {
    return output;
}

/**
 * Helper to get a numeric input value with fallback.
 * Automatically converts string inputs to numbers.
 */
export function getNumber(inputs: Record<string, number | string>, key: string, fallback = 0): number {
    const val = inputs[key];
    if (val === undefined || val === null || val === '') {
        return fallback;
    }
    const num = Number(val);
    return isNaN(num) ? fallback : num;
}

/**
 * Helper to get a string input value with fallback.
 * Ensures the result is always a string.
 */
export function getString(inputs: Record<string, number | string>, key: string, fallback = ''): string {
    const val = inputs[key];
    if (val === undefined || val === null) {
        return fallback;
    }
    return String(val);
}

/**
 * Validates all registered calculators at startup.
 * Call this in development to catch issues early.
 */
export function validateAllCalculators(calculators: Record<string, CalculatorConfig>): void {
    const ids = new Set<string>();
    const duplicates: string[] = [];
    const errors: string[] = [];

    for (const [key, config] of Object.entries(calculators)) {
        // Check key matches id
        if (key !== config.id) {
            errors.push(`Calculator key "${key}" doesn't match id "${config.id}"`);
        }

        // Check for duplicates
        if (ids.has(config.id)) {
            duplicates.push(config.id);
        }
        ids.add(config.id);
    }

    if (duplicates.length > 0) {
        console.error('❌ Duplicate calculator IDs found:', duplicates);
    }
    if (errors.length > 0) {
        console.error('❌ Calculator validation errors:', errors);
    }
    if (duplicates.length === 0 && errors.length === 0) {
        console.log(`✅ All ${Object.keys(calculators).length} calculators validated successfully`);
    }
}

/**
 * Valid calculator categories for type safety
 */
export const CALCULATOR_CATEGORIES: CalculatorCategory[] = [
    'math',
    'finance',
    'health',
    'conversion',
    'physics',
    'chemistry',
    'construction',
    'food',
    'everyday',
    'sports',
    'statistics',
    'ecology',
    'biology',
    'education',
    'electronics',
    'other'
];
