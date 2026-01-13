/**
 * Calculator Validation Script
 * 
 * Run this BEFORE adding a new calculator to verify:
 * 1. The ID doesn't already exist in calculators.ts
 * 2. The ID doesn't exist in the registry
 * 3. The structure is valid
 * 
 * Usage: node scripts/validate-new-calculator.js <calculator-id>
 * Example: node scripts/validate-new-calculator.js compound-interest
 */

const fs = require('fs');
const path = require('path');

const CALCULATORS_FILE = path.join(__dirname, '../src/config/calculators.ts');
const REGISTRY_FILE = path.join(__dirname, '../calculator-registry.json');

function validateCalculatorId(id) {
    console.log(`\n🔍 Validating calculator ID: "${id}"\n`);

    let hasErrors = false;

    // 1. Check format (kebab-case)
    const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    if (!kebabCaseRegex.test(id)) {
        console.error(`❌ ERROR: ID must be in kebab-case (lowercase with hyphens)`);
        console.error(`   Example: "compound-interest", "bmi-calculator"`);
        hasErrors = true;
    } else {
        console.log(`✅ ID format is valid (kebab-case)`);
    }

    // 2. Check if ID exists in calculators.ts
    const calculatorsContent = fs.readFileSync(CALCULATORS_FILE, 'utf8');
    const idPattern = new RegExp(`'${id}':\\s*\\{`, 'g');
    const matches = calculatorsContent.match(idPattern);

    if (matches && matches.length > 0) {
        console.error(`❌ ERROR: ID "${id}" already exists in calculators.ts (${matches.length} occurrence(s))`);
        hasErrors = true;
    } else {
        console.log(`✅ ID is unique in calculators.ts`);
    }

    // 3. Check if ID exists in registry
    if (fs.existsSync(REGISTRY_FILE)) {
        const registry = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'));
        if (registry.calculators && registry.calculators[id]) {
            console.error(`❌ ERROR: ID "${id}" already exists in calculator-registry.json`);
            hasErrors = true;
        } else {
            console.log(`✅ ID is unique in registry`);
        }
    } else {
        console.log(`⚠️ WARNING: Registry file not found, skipping registry check`);
    }

    // 4. Summary
    console.log('\n' + '='.repeat(50));
    if (hasErrors) {
        console.log('❌ VALIDATION FAILED - Do NOT add this calculator');
        process.exit(1);
    } else {
        console.log('✅ VALIDATION PASSED - Safe to add this calculator');
        process.exit(0);
    }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('Usage: node scripts/validate-new-calculator.js <calculator-id>');
    console.log('Example: node scripts/validate-new-calculator.js compound-interest');
    process.exit(1);
}

validateCalculatorId(args[0]);
