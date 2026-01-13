/**
 * Fix Remaining TypeScript Errors
 * 
 * Addresses:
 * - TS7006: Add type annotations to callback parameters  
 * - TS2339: Wrap string methods with String()
 * - TS2345: Fix type argument mismatches
 * 
 * Run with: node scripts/fix-remaining-errors.js
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/config/calculators.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('=== Fix Remaining TypeScript Errors ===\n');
const originalLength = content.length;

let fixes = {
    mapParseFloat: 0,
    mapParseInt: 0,
    reduceSum: 0,
    reduceMult: 0,
    filterCallback: 0,
    mapCharCode: 0,
    stringMethods: 0,
    numberWrap: 0
};

// 1. Fix .map(n => parseFloat(n)) - add type annotation
content = content.replace(/\.map\(\s*\(?([a-z])\)?\s*=>\s*parseFloat\(\1\)/gi, (m, p) => {
    fixes.mapParseFloat++;
    return `.map((${p}: string) => parseFloat(${p}))`;
});

// 2. Fix .map(n => parseInt(n, ...)) - add type annotation
content = content.replace(/\.map\(\s*\(?([a-z])\)?\s*=>\s*parseInt\(\1/gi, (m, p) => {
    fixes.mapParseInt++;
    return `.map((${p}: string) => parseInt(${p}`;
});

// 3. Fix .reduce((a, b) => a + b, 0) - add type annotations
content = content.replace(/\.reduce\(\s*\(\s*([a-z]+)\s*,\s*([a-z]+)\s*\)\s*=>\s*\1\s*\+\s*\2\s*,\s*0\s*\)/gi, (m, a, b) => {
    fixes.reduceSum++;
    return `.reduce((${a}: number, ${b}: number) => ${a} + ${b}, 0)`;
});

// 4. Fix .reduce((a, b) => a * b) - add type annotations
content = content.replace(/\.reduce\(\s*\(\s*([a-z]+)\s*,\s*([a-z]+)\s*\)\s*=>\s*\1\s*\*\s*\2/gi, (m, a, b) => {
    fixes.reduceMult++;
    return `.reduce((${a}: number, ${b}: number) => ${a} * ${b}`;
});

// 5. Fix .filter((c) => c...) - add type annotation for char operations
content = content.replace(/\.filter\(\s*\(?([a-z])\)?\s*=>\s*(\1\.(?:charCodeAt|match|test|includes))/gi, (m, p, expr) => {
    fixes.filterCallback++;
    return `.filter((${p}: string) => ${expr}`;
});

// 6. Fix .map((c) => c.charCodeAt...) - add type annotation
content = content.replace(/\.map\(\s*\(?([a-z])\)?\s*=>\s*\1\.charCodeAt/gi, (m, p) => {
    fixes.mapCharCode++;
    return `.map((${p}: string) => ${p}.charCodeAt`;
});

// 7. Wrap string methods on inputs with String()
// Pattern: inputs['xxx'].split/replace/trim/etc
const stringMethods = ['split', 'replace', 'trim', 'toLowerCase', 'toUpperCase', 'charAt', 'substring', 'slice', 'match', 'search', 'startsWith', 'endsWith', 'includes', 'padStart', 'padEnd', 'repeat'];

for (const method of stringMethods) {
    // inputs['xxx'].method(
    const pattern1 = new RegExp(`(inputs\\['[^']+'\\])\\.${method}\\(`, 'g');
    content = content.replace(pattern1, (match, inputPart) => {
        // Skip if already wrapped
        if (match.includes('String(')) return match;
        fixes.stringMethods++;
        return `String(${inputPart}).${method}(`;
    });

    // inputs["xxx"].method(
    const pattern2 = new RegExp(`(inputs\\["[^"]+"\\])\\.${method}\\(`, 'g');
    content = content.replace(pattern2, (match, inputPart) => {
        if (match.includes('String(')) return match;
        fixes.stringMethods++;
        return `String(${inputPart}).${method}(`;
    });

    // inputs.xxx.method( (dot notation)
    const pattern3 = new RegExp(`(inputs\\.\\w+)\\.${method}\\(`, 'g');
    content = content.replace(pattern3, (match, inputPart) => {
        if (match.includes('String(')) return match;
        fixes.stringMethods++;
        return `String(${inputPart}).${method}(`;
    });
}

// Fix .length property on inputs
content = content.replace(/(inputs\['[^']+'\])\.length(?!\s*[:(])/g, (match, inputPart) => {
    if (match.includes('String(')) return match;
    fixes.stringMethods++;
    return `String(${inputPart}).length`;
});

// 8. Wrap Number() for arithmetic on inputs
// Pattern: inputs['xxx'] + NUMBER, - NUMBER, * NUMBER, / NUMBER
// Be careful not to double-wrap
const arithmeticPatterns = [
    /(?<!Number\()(?<!String\()(inputs\['[^']+'\])\s*(\+\s*\d)/g,
    /(?<!Number\()(?<!String\()(inputs\['[^']+'\])\s*(-\s*\d)/g,
    /(?<!Number\()(?<!String\()(inputs\['[^']+'\])\s*(\*\s*\d)/g,
    /(?<!Number\()(?<!String\()(inputs\['[^']+'\])\s*(\/\s*\d)/g,
];

for (const pattern of arithmeticPatterns) {
    content = content.replace(pattern, (match, inputPart, operand) => {
        fixes.numberWrap++;
        return `Number(${inputPart}) ${operand}`;
    });
}

fs.writeFileSync(filePath, content, 'utf-8');

console.log('Fixes applied:');
for (const [key, count] of Object.entries(fixes)) {
    if (count > 0) console.log(`  ${key}: ${count}`);
}

console.log(`\nTotal fixes: ${Object.values(fixes).reduce((a, b) => a + b, 0)}`);
console.log(`File size: ${originalLength} -> ${content.length}`);
console.log('\nRun: npm run typecheck to verify');
