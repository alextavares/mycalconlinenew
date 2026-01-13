/**
 * Remove All Duplicate Properties Script
 * 
 * Finds all instances where title: or description: appear twice consecutively
 * within meta blocks and removes the duplicate line.
 * 
 * Run with: node scripts/remove-duplicate-meta.js
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/config/calculators.ts');
let content = fs.readFileSync(filePath, 'utf-8');
let lines = content.split('\n');

console.log('=== Remove Duplicate Meta Properties ===\n');
console.log(`Original lines: ${lines.length}`);

let fixCount = 0;
let i = 0;

while (i < lines.length - 1) {
    const currentLine = lines[i].trim();
    const nextLine = lines[i + 1].trim();

    // Check if both lines start with same property
    const currentMatch = currentLine.match(/^(title|description|id|label):\s/);
    const nextMatch = nextLine.match(/^(title|description|id|label):\s/);

    if (currentMatch && nextMatch && currentMatch[1] === nextMatch[1]) {
        // Found duplicate - remove the second line
        const prop = currentMatch[1];
        console.log(`Line ${i + 2}: Removing duplicate '${prop}'`);
        lines.splice(i + 1, 1);
        fixCount++;
        // Don't increment i - check for more duplicates
    } else {
        i++;
    }
}

content = lines.join('\n');
fs.writeFileSync(filePath, content, 'utf-8');

console.log(`\n=== Summary ===`);
console.log(`Removed ${fixCount} duplicate properties`);
console.log(`New line count: ${lines.length}`);
console.log('\nRun: npm run typecheck to verify');
