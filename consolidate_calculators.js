const fs = require('fs');
const path = require('path');

const targetFile = 'src/config/calculators.ts';
const content = fs.readFileSync(targetFile, 'utf8');

// We want to extract the calculators object content.
// It starts after 'export const calculators: Record<string, CalculatorConfig> = {'
// and ends before '};' at the end of the file.

const startMarker = 'export const calculators: Record<string, CalculatorConfig> = {';
const startIndex = content.indexOf(startMarker);

if (startIndex === -1) {
    console.error('Could not find start of calculators object');
    process.exit(1);
}

const header = content.substring(0, startIndex + startMarker.length);
const bodyWithFooter = content.substring(startIndex + startMarker.length);

// Finding the last };
const lastBraceIndex = bodyWithFooter.lastIndexOf('};');
const body = bodyWithFooter.substring(0, lastBraceIndex);
const footer = bodyWithFooter.substring(lastBraceIndex);

// Split by top-level keys. They look like:
// 'id': {
// regex to find these patterns at the start of a line with indentation
const keyRegex = /^\s{4}'([^']+)': \{/gm;

let match;
const sections = [];
let lastPos = 0;
let lastKey = null;

while ((match = keyRegex.exec(body)) !== null) {
    if (lastKey !== null) {
        sections.push({ key: lastKey, content: body.substring(lastPos, match.index) });
    }
    lastKey = match[1];
    lastPos = match.index;
}
// Add the last one
if (lastKey !== null) {
    sections.push({ key: lastKey, content: body.substring(lastPos) });
}

console.log(`Found ${sections.length} calculator entries.`);

// Keep only the last occurrence of each key
const uniqueSections = new Map();
sections.forEach(sec => {
    uniqueSections.set(sec.key, sec.content);
});

console.log(`Unique calculators remaining: ${uniqueSections.size}`);

// Reassemble and apply minor fixes
let newBody = Array.from(uniqueSections.values()).join('');

// Fix primaryUnit -> unit
newBody = newBody.replace(/primaryUnit:/g, 'unit:');

// Fix width: 'full'/'half' - removing them as they are not in the current common type
newBody = newBody.replace(/^\s+width:\s*'[^']+',?$/gm, '');

// Ensure calculate functions that return null return 0 or '---'
// This is trickier with regex, but let's do a common one
newBody = newBody.replace(/return null;/g, "return 0;");

const finalContent = header + newBody + footer;
fs.writeFileSync(targetFile, finalContent);

console.log('Successfully consolidated calculators.ts');
