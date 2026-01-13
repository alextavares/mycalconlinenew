/**
 * Robust Calculator Duplicate Remover
 * 
 * Parses calculators.ts to find ALL duplicate calculator keys
 * and removes subsequent duplicates while preserving file structure.
 * 
 * Uses a different parsing approach: line-by-line with proper brace tracking.
 * 
 * Run with: node scripts/robust-duplicate-remover.js
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/config/calculators.ts');
let content = fs.readFileSync(filePath, 'utf-8');
let lines = content.split('\n');

console.log('=== Robust Calculator Duplicate Remover ===\n');
console.log(`Original lines: ${lines.length}`);

// Find all calculator keys and their positions
// Calculator pattern: 4 spaces then 'key-name': {
const calculatorStarts = [];
const calculatorPattern = /^    '([a-z0-9-]+)':\s*\{/;

let braceCount = 0;
let inCalculator = false;
let currentCalc = null;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Count all braces (but skip strings - rough approximation)
    const lineBraces = line.replace(/'[^']*'/g, '').replace(/"[^"]*"/g, '');
    const opens = (lineBraces.match(/\{/g) || []).length;
    const closes = (lineBraces.match(/\}/g) || []).length;

    if (!inCalculator) {
        const match = line.match(calculatorPattern);
        if (match) {
            currentCalc = {
                id: match[1],
                startLine: i,
                endLine: -1
            };
            inCalculator = true;
            braceCount = opens - closes; // Usually 1
        }
    } else {
        braceCount += opens - closes;

        if (braceCount <= 0) {
            // Calculator ended
            currentCalc.endLine = i;
            calculatorStarts.push({ ...currentCalc });
            inCalculator = false;
            currentCalc = null;
            braceCount = 0;
        }
    }
}

console.log(`Found ${calculatorStarts.length} calculator blocks`);

// Find duplicates (keep first, mark rest for removal)
const seen = new Map();
const toRemove = [];

for (const calc of calculatorStarts) {
    if (seen.has(calc.id)) {
        toRemove.push(calc);
        console.log(`Duplicate: '${calc.id}' at lines ${calc.startLine + 1}-${calc.endLine + 1}`);
    } else {
        seen.set(calc.id, calc);
    }
}

console.log(`\nTotal duplicates to remove: ${toRemove.length}`);

if (toRemove.length === 0) {
    console.log('\nNo duplicates found!');
    process.exit(0);
}

// Sort by line number descending (remove from bottom up)
toRemove.sort((a, b) => b.startLine - a.startLine);

let removedCount = 0;
for (const dup of toRemove) {
    const count = dup.endLine - dup.startLine + 1;
    lines.splice(dup.startLine, count);
    removedCount += count;
    console.log(`Removed '${dup.id}': ${count} lines`);
}

// Write back
fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');

console.log(`\n=== Summary ===`);
console.log(`Removed ${toRemove.length} duplicate calculators`);
console.log(`Removed ${removedCount} total lines`);
console.log(`New line count: ${lines.length}`);
console.log('\nRun: npm run typecheck to verify');
