/**
 * Script to fix common TypeScript errors in calculators.ts
 * Run with: node fix-calculators.js
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/config/calculators.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Track changes
let changes = 0;

// 1. Fix type: 'string' -> type: 'text'
const stringTypeRegex = /type:\s*['"]string['"]/g;
const stringMatches = content.match(stringTypeRegex);
if (stringMatches) {
    content = content.replace(stringTypeRegex, "type: 'text'");
    changes += stringMatches.length;
    console.log(`Fixed ${stringMatches.length} instances of type: 'string' -> type: 'text'`);
}

// 2. Fix calculate functions that return null -> return 0
// Pattern: return null
const nullReturnRegex = /(\bcalculate\s*:\s*\([^)]*\)\s*=>\s*\{[^}]*?)return\s+null\s*;/g;
let nullMatches = 0;
content = content.replace(nullReturnRegex, (match, prefix) => {
    nullMatches++;
    return `${prefix}return 0;`;
});
if (nullMatches > 0) {
    console.log(`Fixed ${nullMatches} instances of 'return null' -> 'return 0' in calculate functions`);
    changes += nullMatches;
}

// 3. Fix simple return null patterns
const simpleNullRegex = /return\s+null\s*;/g;
const simpleNullMatches = content.match(simpleNullRegex);
if (simpleNullMatches) {
    content = content.replace(simpleNullRegex, "return 0;");
    changes += simpleNullMatches.length;
    console.log(`Fixed ${simpleNullMatches.length} remaining 'return null' -> 'return 0'`);
}

// Write the fixed content
fs.writeFileSync(filePath, content, 'utf-8');
console.log(`\nTotal changes made: ${changes}`);
console.log('File updated successfully!');
