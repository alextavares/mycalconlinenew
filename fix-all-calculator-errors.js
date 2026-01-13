/**
 * Comprehensive Calculator Fix Script
 * This script fixes all remaining TypeScript errors in calculators.ts:
 * 1. Removes duplicate calculator entries (keeps first occurrence)
 * 2. Adds type annotations to implicit any parameters
 * 3. Wraps string methods on union types with String()
 * 4. Fixes Number() for arithmetic operations
 * 
 * Run with: node fix-all-calculator-errors.js
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/config/calculators.ts');
let content = fs.readFileSync(filePath, 'utf-8');
const originalLength = content.length;

console.log('=== Comprehensive Calculator Fix Script ===\n');
console.log(`File size: ${(originalLength / 1024 / 1024).toFixed(2)} MB`);

let totalFixes = 0;

// ============================================
// PHASE 1: Remove Duplicate Calculator Keys
// ============================================
console.log('\n--- Phase 1: Removing Duplicate Keys ---');

// Find all calculator key positions
const keyPattern = /^(\s{4}'([a-z0-9-]+)':\s*\{)/gm;
const keyPositions = new Map(); // key -> first position
const duplicateRanges = [];

let match;
while ((match = keyPattern.exec(content)) !== null) {
    const key = match[2];
    const position = match.index;

    if (keyPositions.has(key)) {
        // This is a duplicate - mark for removal
        // We need to find the end of this calculator block
        let braceCount = 1;
        let endPos = position + match[0].length;

        while (braceCount > 0 && endPos < content.length) {
            if (content[endPos] === '{') braceCount++;
            if (content[endPos] === '}') braceCount--;
            endPos++;
        }

        // Include trailing comma and newline if present
        while (endPos < content.length && (content[endPos] === ',' || content[endPos] === '\n' || content[endPos] === '\r' || content[endPos] === ' ')) {
            endPos++;
        }

        duplicateRanges.push({ key, start: position, end: endPos });
        console.log(`  Found duplicate: '${key}'`);
    } else {
        keyPositions.set(key, position);
    }
}

console.log(`  Total duplicates found: ${duplicateRanges.length}`);

// Remove duplicates from end to start
duplicateRanges.sort((a, b) => b.start - a.start);
for (const range of duplicateRanges) {
    content = content.substring(0, range.start) + content.substring(range.end);
    totalFixes++;
}

// ============================================
// PHASE 2: Fix Implicit Any Parameters
// ============================================
console.log('\n--- Phase 2: Fixing Implicit Any Parameters ---');

// 2.1: Fix .map((n) => parseFloat(n)) patterns
let mapParseFloatCount = 0;
content = content.replace(/\.map\(\s*\(([a-z])\)\s*=>\s*parseFloat\(\1\)\)/gi, (match, param) => {
    mapParseFloatCount++;
    return `.map((${param}: string) => parseFloat(${param}))`;
});
console.log(`  Fixed .map(n => parseFloat(n)): ${mapParseFloatCount}`);
totalFixes += mapParseFloatCount;

// 2.2: Fix .map((n) => parseInt(n, ...)) patterns
let mapParseIntCount = 0;
content = content.replace(/\.map\(\s*\(([a-z])\)\s*=>\s*parseInt\(\1,/gi, (match, param) => {
    mapParseIntCount++;
    return `.map((${param}: string) => parseInt(${param},`;
});
console.log(`  Fixed .map(n => parseInt(n)): ${mapParseIntCount}`);
totalFixes += mapParseIntCount;

// 2.3: Fix .reduce((a, b) => a + b, 0) patterns
let reduceCount = 0;
content = content.replace(/\.reduce\(\s*\(([a-z]),\s*([a-z])\)\s*=>\s*\1\s*\+\s*\2\s*,\s*0\s*\)/gi, (match, a, b) => {
    reduceCount++;
    return `.reduce((${a}: number, ${b}: number) => ${a} + ${b}, 0)`;
});
console.log(`  Fixed .reduce((a, b) => a + b): ${reduceCount}`);
totalFixes += reduceCount;

// 2.4: Fix .reduce((a, b) => a * b, ...) patterns
let reduceMultCount = 0;
content = content.replace(/\.reduce\(\s*\(([a-z]),\s*([a-z])\)\s*=>\s*\1\s*\*\s*\2/gi, (match, a, b) => {
    reduceMultCount++;
    return `.reduce((${a}: number, ${b}: number) => ${a} * ${b}`;
});
console.log(`  Fixed .reduce((a, b) => a * b): ${reduceMultCount}`);
totalFixes += reduceMultCount;

// 2.5: Fix .filter((c) => c...) string patterns
let filterCharCount = 0;
content = content.replace(/\.filter\(\s*\(([a-z])\)\s*=>\s*\1\.(char|match|test)/gi, (match, param, method) => {
    filterCharCount++;
    return `.filter((${param}: string) => ${param}.${method}`;
});
console.log(`  Fixed .filter((c) => c.char...): ${filterCharCount}`);
totalFixes += filterCharCount;

// 2.6: Fix const gcd = (a, b) => patterns
let gcdCount = 0;
content = content.replace(/const gcd\s*=\s*\(([a-z]),\s*([a-z])\)\s*=>/gi, (match, a, b) => {
    gcdCount++;
    return `const gcd = (${a}: number, ${b}: number): number =>`;
});
console.log(`  Fixed const gcd = (a, b) =>: ${gcdCount}`);
totalFixes += gcdCount;

// 2.7: Fix .map((c) => c.charCodeAt patterns
let charCodeCount = 0;
content = content.replace(/\.map\(\s*\(([a-z])\)\s*=>\s*\1\.charCodeAt/gi, (match, param) => {
    charCodeCount++;
    return `.map((${param}: string) => ${param}.charCodeAt`;
});
console.log(`  Fixed .map((c) => c.charCodeAt): ${charCodeCount}`);
totalFixes += charCodeCount;

// 2.8: Fix AQI calculator parameters (Cp, Ih, Il, BPh, BPl)
let aqiCount = 0;
content = content.replace(/\(Cp,\s*Ih,\s*Il,\s*BPh,\s*BPl\)\s*=>/gi, () => {
    aqiCount++;
    return `(Cp: number, Ih: number, Il: number, BPh: number, BPl: number): number =>`;
});
console.log(`  Fixed AQI calculator params: ${aqiCount}`);
totalFixes += aqiCount;

// 2.9: Fix generic .map((x) => ...) with number operations
let mapNumCount = 0;
content = content.replace(/\.map\(\s*\(([a-z])\)\s*=>\s*\1\s*[\*\/\+\-]\s*\d/gi, (match, param) => {
    mapNumCount++;
    return `.map((${param}: number) => ${param} ${match.slice(-3)}`;
});

// 2.10: Fix .forEach((m) => ...) patterns
let forEachCount = 0;
content = content.replace(/\.forEach\(\s*\(([a-z])\)\s*=>/gi, (match, param) => {
    forEachCount++;
    return `.forEach((${param}: any) =>`;
});
console.log(`  Fixed .forEach((m) => ...): ${forEachCount}`);
totalFixes += forEachCount;

// ============================================
// PHASE 3: Fix String Methods on Union Types
// ============================================
console.log('\n--- Phase 3: Wrapping String Methods ---');

// Already applied in previous script, check for remaining
const stringMethods = ['split', 'toUpperCase', 'toLowerCase', 'trim', 'replace', 'charAt', 'slice', 'substring', 'length', 'match', 'startsWith', 'endsWith', 'includes'];

let stringMethodFixes = 0;
for (const method of stringMethods) {
    const pattern = new RegExp(`inputs\\['([^']+)'\\]\\.${method}`, 'g');
    content = content.replace(pattern, (match, inputName) => {
        // Check if already wrapped
        if (!match.includes('String(')) {
            stringMethodFixes++;
            return `String(inputs['${inputName}']).${method}`;
        }
        return match;
    });

    const pattern2 = new RegExp(`inputs\\["([^"]+)"\\]\\.${method}`, 'g');
    content = content.replace(pattern2, (match, inputName) => {
        if (!match.includes('String(')) {
            stringMethodFixes++;
            return `String(inputs["${inputName}"]).${method}`;
        }
        return match;
    });
}
console.log(`  Wrapped string methods: ${stringMethodFixes}`);
totalFixes += stringMethodFixes;

// ============================================
// PHASE 4: Fix Arithmetic on Union Types
// ============================================
console.log('\n--- Phase 4: Fixing Arithmetic on Union Types ---');

// Fix patterns like: inputs['temp'] + 273.15 -> Number(inputs['temp']) + 273.15
let arithmeticFixes = 0;

// Pattern: inputs['x'] + NUMBER or NUMBER + inputs['x']
const arithmeticPatterns = [
    { pattern: /(\binputs\[['"][^'"]+['"]\])\s*\+\s*(\d+\.?\d*)/g, type: 'add' },
    { pattern: /(\binputs\[['"][^'"]+['"]\])\s*-\s*(\d+\.?\d*)/g, type: 'sub' },
    { pattern: /(\binputs\[['"][^'"]+['"]\])\s*\*\s*(\d+\.?\d*)/g, type: 'mul' },
    { pattern: /(\binputs\[['"][^'"]+['"]\])\s*\/\s*(\d+\.?\d*)/g, type: 'div' },
];

for (const { pattern } of arithmeticPatterns) {
    content = content.replace(pattern, (match, inputPart, numPart) => {
        // Don't wrap if already wrapped
        if (match.includes('Number(')) return match;
        arithmeticFixes++;
        const operator = match.includes('+') ? '+' : match.includes('-') ? '-' : match.includes('*') ? '*' : '/';
        return `Number(${inputPart}) ${operator} ${numPart}`;
    });
}
console.log(`  Fixed arithmetic operations: ${arithmeticFixes}`);
totalFixes += arithmeticFixes;

// ============================================
// PHASE 5: Fix Comparison on Union Types
// ============================================
console.log('\n--- Phase 5: Fixing Comparisons on Union Types ---');

let comparisonFixes = 0;
const comparisonPatterns = [
    /(\binputs\[['"][^'"]+['"]\])\s*>\s*(\d+)/g,
    /(\binputs\[['"][^'"]+['"]\])\s*<\s*(\d+)/g,
    /(\binputs\[['"][^'"]+['"]\])\s*>=\s*(\d+)/g,
    /(\binputs\[['"][^'"]+['"]\])\s*<=\s*(\d+)/g,
];

for (const pattern of comparisonPatterns) {
    content = content.replace(pattern, (match, inputPart, numPart) => {
        if (match.includes('Number(')) return match;
        comparisonFixes++;
        const operator = match.match(/[<>=]+/)[0];
        return `Number(${inputPart}) ${operator} ${numPart}`;
    });
}
console.log(`  Fixed comparison operations: ${comparisonFixes}`);
totalFixes += comparisonFixes;

// ============================================
// Write Results
// ============================================
fs.writeFileSync(filePath, content, 'utf-8');

const newLength = content.length;
const reduction = originalLength - newLength;

console.log('\n=== Summary ===');
console.log(`Total fixes applied: ${totalFixes}`);
console.log(`Original size: ${(originalLength / 1024 / 1024).toFixed(2)} MB`);
console.log(`New size: ${(newLength / 1024 / 1024).toFixed(2)} MB`);
console.log(`Size reduction: ${(reduction / 1024).toFixed(2)} KB`);
console.log('\nFile updated successfully!');
console.log('Run: npm run typecheck  to verify remaining errors.');
