#!/usr/bin/env node
/**
 * CLI Tool to Add New Calculator
 * 
 * This script generates a new calculator with proper TypeScript types
 * and validates that the ID is unique before adding.
 * 
 * Usage: npx tsx scripts/add-calculator.ts --id="my-calculator" --category="math" --title="My Calculator"
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const params: Record<string, string> = {};

for (const arg of args) {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) {
        params[match[1]] = match[2];
    }
}

// Validate required parameters
if (!params.id) {
    console.error('❌ Error: --id is required');
    console.log('\nUsage: npx tsx scripts/add-calculator.ts --id="calculator-id" --category="math" --title="Calculator Title"');
    console.log('\nOptions:');
    console.log('  --id        Calculator ID (required, lowercase with dashes)');
    console.log('  --category  Category (required): math, finance, health, physics, etc.');
    console.log('  --title     Display title (optional, auto-generated from ID if not provided)');
    process.exit(1);
}

if (!params.category) {
    console.error('❌ Error: --category is required');
    process.exit(1);
}

const VALID_CATEGORIES = [
    'math', 'finance', 'health', 'conversion', 'physics', 'chemistry',
    'construction', 'food', 'everyday', 'sports', 'statistics',
    'ecology', 'biology', 'education', 'electronics', 'other'
];

if (!VALID_CATEGORIES.includes(params.category)) {
    console.error(`❌ Error: Invalid category "${params.category}"`);
    console.log(`Valid categories: ${VALID_CATEGORIES.join(', ')}`);
    process.exit(1);
}

// Check for duplicate IDs in existing calculators
const calculatorsPath = path.join(__dirname, '../src/config/calculators.ts');
const content = fs.readFileSync(calculatorsPath, 'utf-8');

if (content.includes(`'${params.id}':`)) {
    console.error(`❌ Error: Calculator ID "${params.id}" already exists!`);
    process.exit(1);
}

// Generate title from ID if not provided
const title = params.title || params.id
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

// Generate calculator template
const template = `
    '${params.id}': {
        id: '${params.id}',
        title: '${title}',
        description: 'Calculate ${title.toLowerCase()}.',
        category: '${params.category}',
        icon: 'Calculator',
        meta: {
            title: '${title} | Online Calculator',
            description: 'Free online ${title.toLowerCase()}. Quick and accurate calculations.',
            keywords: ['${params.id}', '${title.toLowerCase()}', 'calculator', 'online'],
        },
        inputs: [
            {
                id: 'value1',
                label: 'Value 1',
                type: 'number',
                placeholder: 'Enter value',
            },
            {
                id: 'value2',
                label: 'Value 2',
                type: 'number',
                placeholder: 'Enter value',
            },
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs: Record<string, number | string>) => {
                    const v1 = Number(inputs['value1']) || 0;
                    const v2 = Number(inputs['value2']) || 0;
                    return v1 + v2; // TODO: Implement actual formula
                },
            },
        ],
        content: {
            whatIs: \`
                <h3>What is ${title}?</h3>
                <p>Description of ${title.toLowerCase()} and how it works.</p>
            \`,
            howTo: \`
                <h3>How to Calculate</h3>
                <p>Instructions for using this calculator.</p>
            \`,
            faq: [
                {
                    question: 'How do I use this calculator?',
                    answer: 'Enter your values and the result will be calculated automatically.',
                },
            ],
        },
    },`;

// Find the position to insert (before the closing brace of the calculators object)
const insertPosition = content.lastIndexOf('};');

if (insertPosition === -1) {
    console.error('❌ Error: Could not find insertion point in calculators.ts');
    process.exit(1);
}

// Insert the new calculator
const newContent = content.slice(0, insertPosition) + template + '\n' + content.slice(insertPosition);

fs.writeFileSync(calculatorsPath, newContent, 'utf-8');

console.log(`✅ Calculator "${params.id}" added successfully!`);
console.log(`\nLocation: src/config/calculators.ts`);
console.log(`\n📝 Next steps:`);
console.log(`   1. Update the inputs array with your specific fields`);
console.log(`   2. Implement the calculate function in outputs`);
console.log(`   3. Write meaningful content (whatIs, howTo, faq)`);
console.log(`   4. Run: npm run typecheck to verify no errors`);
console.log(`   5. Test at: http://localhost:3000/en/calculator/${params.id}`);
