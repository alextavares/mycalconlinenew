/**
 * Safe Duplicate Calculator Remover
 * 
 * This script safely identifies and removes duplicate calculator entries
 * by parsing the file structure properly and removing only complete blocks.
 * 
 * Run with: node scripts/remove-duplicates.js
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/config/calculators.ts');
let content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

console.log('=== Safe Duplicate Calculator Remover ===\n');
console.log(`Total lines: ${lines.length}`);

// Track calculator positions
const calculators = new Map(); // id -> {startLine, endLine, kept}
const duplicates = []; // {id, startLine, endLine}

// Parse calculator blocks - look for pattern:    'calculator-id': {
const calcStartPattern = /^(\s{4})'([a-z0-9-]+)':\s*\{$/;

let currentCalc = null;
let braceDepth = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for calculator start (only at depth 0)
    if (braceDepth === 0) {
        const match = line.match(calcStartPattern);
        if (match) {
            currentCalc = {
                id: match[2],
                startLine: i,
                endLine: -1
            };
            braceDepth = 1; // Count the opening brace
            continue;
        }
    }

    // Track brace depth within calculator
    if (currentCalc) {
        // Count braces on this line
        for (const char of line) {
            if (char === '{') braceDepth++;
            if (char === '}') braceDepth--;
        }

        // Calculator block ended
        if (braceDepth === 0) {
            currentCalc.endLine = i;

            // Check if this is a duplicate
            if (calculators.has(currentCalc.id)) {
                duplicates.push({ ...currentCalc });
                console.log(`Found duplicate: '${currentCalc.id}' at lines ${currentCalc.startLine + 1}-${currentCalc.endLine + 1}`);
            } else {
                calculators.set(currentCalc.id, currentCalc);
            }

            currentCalc = null;
        }
    }
}

console.log(`\nTotal unique calculators: ${calculators.size}`);
console.log(`Total duplicates to remove: ${duplicates.length}`);

if (duplicates.length === 0) {
    console.log('\nNo duplicates found!');
    process.exit(0);
}

// Sort duplicates by startLine descending (remove from bottom up)
duplicates.sort((a, b) => b.startLine - a.startLine);

// Remove duplicates
let removedLines = 0;
for (const dup of duplicates) {
    // Calculate how many lines to remove (include trailing comma if present)
    let endLine = dup.endLine;

    // Check if next line is empty or just whitespace
    if (endLine + 1 < lines.length && lines[endLine + 1].trim() === '') {
        endLine++;
    }

    const linesToRemove = endLine - dup.startLine + 1;
    lines.splice(dup.startLine, linesToRemove);
    removedLines += linesToRemove;
}

// Write back
content = lines.join('\n');
fs.writeFileSync(filePath, content, 'utf-8');

console.log(`\n=== Summary ===`);
console.log(`Removed ${duplicates.length} duplicate calculators`);
console.log(`Removed ${removedLines} lines`);
console.log(`New line count: ${lines.length}`);
console.log('\nRun: npm run typecheck to verify');
