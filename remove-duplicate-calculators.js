/**
 * Script to remove duplicate calculator entries and fix implicit any errors
 * Run with: node remove-duplicate-calculators.js
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/config/calculators.ts');
let content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

// Parse the file to find duplicate calculator keys
// Calculator entries look like:
//     'calculator-name': {
//         id: 'calculator-name',
//         ...
//     },

const calculatorPattern = /^\s{4}'([^']+)':\s*\{$/;
const calculators = new Map(); // key -> {startLine, endLine}
let currentKey = null;
let braceCount = 0;
let startLine = -1;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for calculator start
    const match = line.match(calculatorPattern);
    if (match && braceCount === 0) {
        currentKey = match[1];
        startLine = i;
        braceCount = 1; // Opening brace
        continue;
    }

    // Count braces within calculator
    if (currentKey !== null) {
        const opens = (line.match(/\{/g) || []).length;
        const closes = (line.match(/\}/g) || []).length;
        braceCount += opens - closes;

        // Check if calculator block ended
        if (braceCount === 0) {
            // Found end of calculator
            if (calculators.has(currentKey)) {
                // This is a duplicate - mark the SECOND occurrence for removal
                const existing = calculators.get(currentKey);
                existing.duplicates = existing.duplicates || [];
                existing.duplicates.push({ startLine, endLine: i });
            } else {
                calculators.set(currentKey, { startLine, endLine: i });
            }
            currentKey = null;
            startLine = -1;
        }
    }
}

// Collect all duplicate ranges to remove
const toRemove = [];
for (const [key, data] of calculators) {
    if (data.duplicates && data.duplicates.length > 0) {
        console.log(`Found ${data.duplicates.length} duplicate(s) of '${key}'`);
        toRemove.push(...data.duplicates);
    }
}

// Sort by startLine descending so we can remove from bottom up
toRemove.sort((a, b) => b.startLine - a.startLine);

console.log(`\nTotal duplicates to remove: ${toRemove.length}`);

// Remove duplicates from the lines array
for (const range of toRemove) {
    console.log(`Removing lines ${range.startLine + 1} to ${range.endLine + 1}`);
    // Remove the lines
    lines.splice(range.startLine, range.endLine - range.startLine + 1);
}

// Rejoin and write
content = lines.join('\n');

// Also fix some common implicit any patterns:
// 1. (n) => parseFloat(n) should be (n: string) => parseFloat(n)
content = content.replace(/\(([a-z])\)\s*=>\s*parseFloat\(\1\)/gi, '($1: string) => parseFloat($1)');

// 2. (n) => parseInt(n, ...) should be (n: string) => parseInt(n, ...)
content = content.replace(/\(([a-z])\)\s*=>\s*parseInt\(\1,/gi, '($1: string) => parseInt($1,');

// 3. (a, b) => a + b should be (a: number, b: number) => a + b in reduce
content = content.replace(/\.reduce\(\(([a-z]),\s*([a-z])\)\s*=>\s*\1\s*\+\s*\2/gi,
    '.reduce(($1: number, $2: number) => $1 + $2');

// 4. (c) => c.charCodeAt should be (c: string) => c.charCodeAt
content = content.replace(/\(([a-z])\)\s*=>\s*\1\.char/gi, '($1: string) => $1.char');

// 5. const gcd = (a, b) => should be const gcd = (a: number, b: number): number =>
content = content.replace(/const gcd = \(([a-z]),\s*([a-z])\)\s*=>/gi,
    'const gcd = ($1: number, $2: number): number =>');

// 6. Fix .split() on inputs - wrap with String()
// Pattern: inputs['name'].split -> String(inputs['name']).split
content = content.replace(/inputs\['([^']+)'\]\.split\(/g,
    "String(inputs['$1']).split(");
content = content.replace(/inputs\["([^"]+)"\]\.split\(/g,
    'String(inputs["$1"]).split(');

// 7. Fix .toUpperCase() on inputs
content = content.replace(/inputs\['([^']+)'\]\.toUpperCase\(/g,
    "String(inputs['$1']).toUpperCase(");
content = content.replace(/inputs\["([^"]+)"\]\.toUpperCase\(/g,
    'String(inputs["$1"]).toUpperCase(');

// 8. Fix .toLowerCase() on inputs
content = content.replace(/inputs\['([^']+)'\]\.toLowerCase\(/g,
    "String(inputs['$1']).toLowerCase(");
content = content.replace(/inputs\["([^"]+)"\]\.toLowerCase\(/g,
    'String(inputs["$1"]).toLowerCase(');

// 9. Fix .trim() on inputs
content = content.replace(/inputs\['([^']+)'\]\.trim\(/g,
    "String(inputs['$1']).trim(");

// 10. Fix .replace() on inputs
content = content.replace(/inputs\['([^']+)'\]\.replace\(/g,
    "String(inputs['$1']).replace(");

// 11. Fix .length on inputs
content = content.replace(/inputs\['([^']+)'\]\.length/g,
    "String(inputs['$1']).length");

// 12. Fix .charAt() on inputs
content = content.replace(/inputs\['([^']+)'\]\.charAt\(/g,
    "String(inputs['$1']).charAt(");

// 13. Fix .slice() on inputs  
content = content.replace(/inputs\['([^']+)'\]\.slice\(/g,
    "String(inputs['$1']).slice(");

// 14. Fix .substring() on inputs
content = content.replace(/inputs\['([^']+)'\]\.substring\(/g,
    "String(inputs['$1']).substring(");

fs.writeFileSync(filePath, content, 'utf-8');
console.log('\nFile updated successfully!');
console.log('Run tsc --noEmit again to check remaining errors.');
