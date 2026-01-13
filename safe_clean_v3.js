const fs = require('fs');

const targetFile = 'src/config/calculators.ts';
const content = fs.readFileSync(targetFile, 'utf8');

const startMarker = 'export const calculators: Record<string, CalculatorConfig> = {';
const startIndex = content.indexOf(startMarker);
if (startIndex === -1) process.exit(1);

const header = content.substring(0, startIndex + startMarker.length);
const bodyWithFooter = content.substring(startIndex + startMarker.length);
const lastBraceIndex = bodyWithFooter.lastIndexOf('};');
const body = bodyWithFooter.substring(0, lastBraceIndex);
const footer = bodyWithFooter.substring(lastBraceIndex);

const keyRegex = /^\s{4}'([^']+)': \{/gm;
let match;
const sectionsMap = new Map();
let lastIndex = 0;
let lastKey = null;

while ((match = keyRegex.exec(body)) !== null) {
    if (lastKey !== null) {
        sectionsMap.set(lastKey, body.substring(lastIndex, match.index));
    }
    lastKey = match[1];
    lastIndex = match.index;
}
if (lastKey !== null) {
    sectionsMap.set(lastKey, body.substring(lastIndex));
}

function cleanCalculatorBlock(text) {
    const lines = text.split('\n');
    const resultLines = [];

    const topLevelKeys = new Map(); // key -> list of line indices for that key's block
    let currentKey = null;
    let currentBlockStartIndex = -1;
    let braceBalance = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Detect top-level properties of the calculator object (indent 8 spaces)
        // e.g., 'id':, title:, inputs:, meta:, etc.
        const topLevelMatch = line.match(/^ {8}(['"]?\w+['"]?)\s*:/);

        if (topLevelMatch && braceBalance === 1) {
            const key = topLevelMatch[1].replace(/['"]/g, '');
            topLevelKeys.set(key, i); // Keep index of last occurrence
        }

        // Detect calculators start: 'id': { (indent 4 spaces)
        if (line.match(/^ {4}'[^']+': \{/)) {
            braceBalance = 1;
        } else {
            braceBalance += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
        }
    }

    // Now re-parse the block and only keep the last occurrence of each top-level key
    const finalTopLevelKeys = new Set();
    const seenKeys = new Map(); // key -> last index

    // We need to keep the order. Let's do a different approach.
    // We already have 'topLevelKeys' which maps key to its LAST index.

    let inMeta = false;
    let metaBraceBalance = 0;
    const metaKeyLastIndex = new Map();

    // Secondary pass for meta properties
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('meta: {')) { inMeta = true; metaBraceBalance = 1; continue; }
        if (inMeta) {
            metaBraceBalance += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
            if (metaBraceBalance === 0) { inMeta = false; continue; }
            const metaPropMatch = line.match(/^\s+(['"]?\w+['"]?)\s*:/);
            if (metaPropMatch) {
                const key = metaPropMatch[1].replace(/['"]/g, '');
                metaKeyLastIndex.set(key, i);
            }
        }
    }

    // Reconstruction
    let outputLines = [];
    let skipUntilLevel = -1;
    let currentBraceLevel = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        const topLevelMatch = line.match(/^ {8}(['"]?\w+['"]?)\s*:/);
        if (topLevelMatch && currentBraceLevel === 1) {
            const key = topLevelMatch[1].replace(/['"]/g, '');
            if (topLevelKeys.get(key) !== i) {
                // If this is NOT the last occurrence of this key, skip this whole block
                let b = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
                while (b > 0 && i < lines.length - 1) {
                    i++;
                    const nextLine = lines[i];
                    b += (nextLine.match(/\{/g) || []).length - (nextLine.match(/\}/g) || []).length;
                }
                continue;
            }
        }

        // Meta deduplication
        if (line.includes('meta: {')) {
            outputLines.push(line);
            currentBraceLevel += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
            continue;
        }

        // If we are deep inside meta
        if (currentBraceLevel >= 2 && line.match(/^\s+(['"]?\w+['"]?)\s*:/)) {
            // simplified meta check
            const possibleMetaProp = line.match(/^\s+(['"]?\w+['"]?)\s*:/)[1].replace(/['"]/g, '');
            if (metaKeyLastIndex.has(possibleMetaProp) && metaKeyLastIndex.get(possibleMetaProp) !== i) {
                // skip
                continue;
            }
        }

        outputLines.push(line);
        currentBraceLevel += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
    }

    return outputLines.join('\n');
}

const cleanedSections = [];
for (let [key, chunk] of sectionsMap) {
    cleanedSections.push(cleanCalculatorBlock(chunk));
}

let newBody = cleanedSections.join('');
// Fix remaining primaryUnit/width
newBody = newBody.replace(/primaryUnit:/g, 'unit:');
newBody = newBody.replace(/^\s+width:\s*'[^']+',?$/gm, '');

fs.writeFileSync(targetFile, header + newBody + footer);
console.log('Safe cleaning complete.');
