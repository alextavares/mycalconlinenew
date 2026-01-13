/**
 * Calculator Validation Script
 * 
 * Run this script to validate all calculators and detect issues:
 * - Duplicate IDs
 * - Missing required fields
 * - Type mismatches
 * 
 * Usage: npx ts-node scripts/validate-calculators.ts
 * Or add to package.json: "calc:validate": "tsx scripts/validate-calculators.ts"
 */

import { calculators } from '../src/config/calculators';
import { CalculatorConfig } from '../src/types/calculator';

interface ValidationResult {
    errors: string[];
    warnings: string[];
    stats: {
        total: number;
        byCategory: Record<string, number>;
        duplicateIds: string[];
    };
}

function validateCalculators(): ValidationResult {
    const result: ValidationResult = {
        errors: [],
        warnings: [],
        stats: {
            total: 0,
            byCategory: {},
            duplicateIds: []
        }
    };

    const seenIds = new Set<string>();

    for (const [key, calc] of Object.entries(calculators)) {
        result.stats.total++;

        // Category stats
        const category = calc.category || 'uncategorized';
        result.stats.byCategory[category] = (result.stats.byCategory[category] || 0) + 1;

        // === ERRORS ===

        // Check key matches id
        if (key !== calc.id) {
            result.errors.push(`Key "${key}" doesn't match id "${calc.id}"`);
        }

        // Check for duplicates
        if (seenIds.has(calc.id)) {
            result.stats.duplicateIds.push(calc.id);
            result.errors.push(`Duplicate ID: "${calc.id}"`);
        }
        seenIds.add(calc.id);

        // Check required fields
        if (!calc.title) {
            result.errors.push(`Calculator "${calc.id}" missing title`);
        }
        if (!calc.description) {
            result.errors.push(`Calculator "${calc.id}" missing description`);
        }
        if (!calc.inputs || calc.inputs.length === 0) {
            result.errors.push(`Calculator "${calc.id}" has no inputs`);
        }
        if (!calc.outputs || calc.outputs.length === 0) {
            result.errors.push(`Calculator "${calc.id}" has no outputs`);
        }

        // Check inputs
        for (const input of calc.inputs || []) {
            if (!input.id) {
                result.errors.push(`Input in "${calc.id}" missing id`);
            }
            if (!input.label) {
                result.errors.push(`Input "${input.id}" in "${calc.id}" missing label`);
            }
            if (!input.type) {
                result.errors.push(`Input "${input.id}" in "${calc.id}" missing type`);
            }
        }

        // Check outputs
        for (let i = 0; i < (calc.outputs || []).length; i++) {
            const output = calc.outputs[i];
            if (!output.label) {
                result.errors.push(`Output ${i} in "${calc.id}" missing label`);
            }
            if (!output.calculate) {
                result.errors.push(`Output "${output.label}" in "${calc.id}" missing calculate function`);
            }
        }

        // === WARNINGS ===

        // Check SEO fields
        if (!calc.meta) {
            result.warnings.push(`Calculator "${calc.id}" missing meta tags`);
        } else {
            if (!calc.meta.keywords || calc.meta.keywords.length === 0) {
                result.warnings.push(`Calculator "${calc.id}" missing keywords`);
            }
        }

        // Check content
        if (!calc.content) {
            result.warnings.push(`Calculator "${calc.id}" missing content (whatIs, howTo, faq)`);
        }
    }

    return result;
}

// Run validation
const result = validateCalculators();

console.log('\n========================================');
console.log('       CALCULATOR VALIDATION REPORT');
console.log('========================================\n');

console.log(`📊 Total calculators: ${result.stats.total}`);
console.log('\nBy Category:');
for (const [cat, count] of Object.entries(result.stats.byCategory).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${cat}: ${count}`);
}

if (result.stats.duplicateIds.length > 0) {
    console.log(`\n🔴 Duplicate IDs (${result.stats.duplicateIds.length}):`);
    result.stats.duplicateIds.forEach(id => console.log(`   - ${id}`));
}

if (result.errors.length > 0) {
    console.log(`\n❌ Errors (${result.errors.length}):`);
    result.errors.slice(0, 20).forEach(err => console.log(`   - ${err}`));
    if (result.errors.length > 20) {
        console.log(`   ... and ${result.errors.length - 20} more errors`);
    }
}

if (result.warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${result.warnings.length}):`);
    result.warnings.slice(0, 10).forEach(warn => console.log(`   - ${warn}`));
    if (result.warnings.length > 10) {
        console.log(`   ... and ${result.warnings.length - 10} more warnings`);
    }
}

console.log('\n========================================\n');

if (result.errors.length === 0) {
    console.log('✅ All calculators passed validation!');
    process.exit(0);
} else {
    console.log(`❌ Validation failed with ${result.errors.length} errors`);
    process.exit(1);
}
