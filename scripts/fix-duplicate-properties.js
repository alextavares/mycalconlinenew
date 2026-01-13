/**
 * Fix Duplicate Properties Script
 * 
 * This script:
 * 1. Removes duplicate title/description in meta objects (keeps first)
 * 2. Removes duplicate calculator entries (keeps first)
 * 
 * Run with: node scripts/fix-duplicate-properties.js
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/config/calculators.ts');
let content = fs.readFileSync(filePath, 'utf-8');
let lines = content.split('\n');

console.log('=== Fix Duplicate Properties Script ===\n');
console.log(`Original lines: ${lines.length}`);

let fixCount = 0;

// Phase 1: Fix duplicate title/description in meta blocks
// Pattern: Look for meta: { ... title: '...' ... title: '...' ... }
// Strategy: Remove duplicate lines that have title: or description: if previous line has same property

const metaPropPattern = /^\s+(title|description):\s*['"]/;
let i = 0;
while (i < lines.length) {
    const currentLine = lines[i];
    const match = currentLine.match(metaPropPattern);

    if (match) {
        const propName = match[1];
        // Check if next line has same property
        if (i + 1 < lines.length) {
            const nextLine = lines[i + 1];
            const nextMatch = nextLine.match(metaPropPattern);
            if (nextMatch && nextMatch[1] === propName) {
                // Remove the second occurrence (next line)
                console.log(`Removing duplicate ${propName} at line ${i + 2}`);
                lines.splice(i + 1, 1);
                fixCount++;
                continue; // Don't increment i, check again
            }
        }
    }
    i++;
}

// Phase 2: Find and remove duplicate calculator entries
const calcPattern = /^\s{4}'([a-z0-9-]+)':\s*\{$/;
const seenCalculators = new Map(); // id -> lineNumber (first occurrence)
const duplicateRanges = [];

let currentCalc = null;
let braceDepth = 0;

for (let j = 0; j < lines.length; j++) {
    const line = lines[j];

    if (braceDepth === 0) {
        const match = line.match(calcPattern);
        if (match) {
            currentCalc = { id: match[1], startLine: j };
            braceDepth = 1;
            continue;
        }
    }

    if (currentCalc) {
        for (const char of line) {
            if (char === '{') braceDepth++;
            if (char === '}') braceDepth--;
        }

        if (braceDepth === 0) {
            currentCalc.endLine = j;

            if (seenCalculators.has(currentCalc.id)) {
                // This is a duplicate
                duplicateRanges.push({ ...currentCalc });
                console.log(`Found duplicate calculator '${currentCalc.id}' at lines ${currentCalc.startLine + 1}-${currentCalc.endLine + 1}`);
            } else {
                seenCalculators.set(currentCalc.id, currentCalc.startLine);
            }
            currentCalc = null;
        }
    }
}

// Remove duplicate calculators from bottom to top
duplicateRanges.sort((a, b) => b.startLine - a.startLine);
for (const dup of duplicateRanges) {
    const count = dup.endLine - dup.startLine + 1;
    lines.splice(dup.startLine, count);
    fixCount += count;
    console.log(`Removed ${count} lines for duplicate '${dup.id}'`);
}

// Write back
fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');

console.log(`\n=== Summary ===`);
console.log(`Total fixes: ${fixCount}`);
console.log(`New line count: ${lines.length}`);
console.log(`\nRun: npm run typecheck to verify errors reduced`);
