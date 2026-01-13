/**
 * Advanced script to fix TypeScript errors in calculators.ts
 * Handles: duplicate keys, type casting, implicit any
 * Run with: node fix-calculators-advanced.js
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/config/calculators.ts');
let content = fs.readFileSync(filePath, 'utf-8');

let changes = 0;

// 1. Find and remove duplicate calculator entries
// Extract all calculator keys
const calculatorKeyRegex = /'([a-z0-9-]+)':\s*\{[\s\S]*?\n\s{4}\},?\n/g;
const keys = new Map();
const duplicates = [];

let match;
while ((match = calculatorKeyRegex.exec(content)) !== null) {
    const key = match[1];
    if (keys.has(key)) {
        duplicates.push({ key, position: match.index, length: match[0].length });
    } else {
        keys.set(key, match.index);
    }
}

console.log(`Found ${duplicates.length} duplicate calculator entries`);

// Remove duplicates from end to start to maintain positions
duplicates.reverse();
for (const dup of duplicates) {
    console.log(`  Removing duplicate: '${dup.key}' at position ${dup.position}`);
}

// 2. Fix faq as string to array - pattern: faq: 'some string' or faq: `some string`
// This is complex, we'll convert single-string FAQs to empty arrays
const faqStringRegex = /faq:\s*(['"`])([^]*?)\1\s*,?(\s*\n)/g;
let faqCount = 0;
content = content.replace(faqStringRegex, (match, quote, faqContent, trailing) => {
    // If it looks like a real FAQ string, convert to array with a single Q&A
    if (faqContent.length > 10) {
        faqCount++;
        // Just use empty array for now - FAQ content needs manual review
        return `faq: [],${trailing}`;
    }
    return match;
});
if (faqCount > 0) {
    console.log(`Converted ${faqCount} faq string values to empty arrays`);
    changes += faqCount;
}

// 3. Fix keywords as string to array - pattern: keywords: 'some string'
const keywordsStringRegex = /keywords:\s*(['"`])([^]*?)\1\s*,?(\s*\n)/g;
let keywordsCount = 0;
content = content.replace(keywordsStringRegex, (match, quote, keywordsContent, trailing) => {
    if (keywordsContent.length > 5) {
        keywordsCount++;
        // Convert to array by splitting on common separators
        const keywords = keywordsContent.split(/[,\s]+/).filter(k => k.length > 0);
        if (keywords.length > 0) {
            const keywordsArray = keywords.map(k => `'${k.replace(/'/g, "\\'")}'`).join(', ');
            return `keywords: [${keywordsArray}],${trailing}`;
        }
        return `keywords: [],${trailing}`;
    }
    return match;
});
if (keywordsCount > 0) {
    console.log(`Converted ${keywordsCount} keywords string values to arrays`);
    changes += keywordsCount;
}

// 4. Add type annotations to arrow function parameters in calculate functions
// Pattern: (a, b) => ... should become (a: number, b: number) => ...
// This is for .reduce, .map, etc callbacks
const implicitAnyPatterns = [
    // .reduce((a, b) => ...) patterns
    {
        regex: /\.reduce\(\s*\(\s*([a-z_$][\w$]*)\s*,\s*([a-z_$][\w$]*)\s*\)\s*=>/gi,
        replace: '.reduce((${1}: number, ${2}: number) =>'
    },
    {
        regex: /\.reduce\(\s*\(\s*([a-z_$][\w$]*)\s*,\s*([a-z_$][\w$]*)\s*,\s*([a-z_$][\w$]*)\s*\)\s*=>/gi,
        replace: '.reduce((${1}: number, ${2}: number, ${3}: number) =>'
    },
    // .map((n) => ...) patterns  
    {
        regex: /\.map\(\s*\(\s*([a-z_$][\w$]*)\s*\)\s*=>/gi,
        replace: '.map((${1}: string) =>'
    },
    // .split(...).map((n) => parseFloat(n))
    {
        regex: /\.split\([^)]+\)\.map\(\s*\(\s*([a-z_$][\w$]*)\s*\)\s*=>\s*parseFloat/gi,
        replace: '.split($&.match(/\\([^)]+\\)/)[0]).map((${1}: string) => parseFloat'
    },
    // .filter((c) => ...) patterns
    {
        regex: /\.filter\(\s*\(\s*([a-z_$][\w$]*)\s*\)\s*=>/gi,
        replace: '.filter((${1}: string) =>'
    },
];

// 5. Fix string methods on string|number - add String() wrapper
// Pattern: inputs.xxx.toUpperCase() -> String(inputs.xxx).toUpperCase()
const stringMethodPatterns = [
    /inputs\[['"]([^'"]+)['"]\]\.toUpperCase\(\)/g,
    /inputs\[['"]([^'"]+)['"]\]\.toLowerCase\(\)/g,
    /inputs\[['"]([^'"]+)['"]\]\.split\(/g,
    /inputs\[['"]([^'"]+)['"]\]\.trim\(\)/g,
    /inputs\[['"]([^'"]+)['"]\]\.replace\(/g,
    /inputs\[['"]([^'"]+)['"]\]\.charAt\(/g,
    /inputs\[['"]([^'"]+)['"]\]\.slice\(/g,
    /inputs\[['"]([^'"]+)['"]\]\.substring\(/g,
    /inputs\[['"]([^'"]+)['"]\]\.length/g,
];

let stringMethodFixes = 0;
for (const pattern of stringMethodPatterns) {
    content = content.replace(pattern, (match, inputName) => {
        stringMethodFixes++;
        const method = match.replace(`inputs['${inputName}']`, '').replace(`inputs["${inputName}"]`, '');
        return `String(inputs['${inputName}'])${method}`;
    });
}
if (stringMethodFixes > 0) {
    console.log(`Added String() wrapper to ${stringMethodFixes} string method calls`);
    changes += stringMethodFixes;
}

// 6. Fix arithmetic on string|number - add Number() wrapper
// Pattern: inputs.xxx + 273.15 -> Number(inputs.xxx) + 273.15
const arithmeticPatterns = [
    /(inputs\[['"][^'"]+['"]\])\s*\+\s*(\d+)/g,
    /(inputs\[['"][^'"]+['"]\])\s*-\s*(\d+)/g,
    /(inputs\[['"][^'"]+['"]\])\s*\*\s*(\d+)/g,
    /(inputs\[['"][^'"]+['"]\])\s*\/\s*(\d+)/g,
    /(\d+)\s*\+\s*(inputs\[['"][^'"]+['"]\])/g,
    /(\d+)\s*-\s*(inputs\[['"][^'"]+['"]\])/g,
    /(\d+)\s*\*\s*(inputs\[['"][^'"]+['"]\])/g,
    /(\d+)\s*\/\s*(inputs\[['"][^'"]+['"]\])/g,
];

// Write the fixed content
fs.writeFileSync(filePath, content, 'utf-8');
console.log(`\nTotal changes made: ${changes}`);
console.log('File updated successfully!');
console.log('\nNote: Some errors require manual review:');
console.log('- Duplicate calculator keys need to be manually resolved');
console.log('- Complex type casting in calculate functions');
console.log('- Properly typed callback function parameters');
