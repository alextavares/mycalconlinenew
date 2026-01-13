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

// 1. De-duplicate top-level calculators (keep last)
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

console.log(`Unique calculators to clean: ${sectionsMap.size}`);

// 2. Clear internal duplicates for each calculator
function cleanBlock(text) {
    const lines = text.split('\n');
    const resultLines = [];

    // Track keys at level 1 (id, title, description, category, icon, inputs, outputs, meta, content)
    const level1Keys = new Set();
    const metaKeys = new Set();

    let inMeta = false;
    let braceCount = 0;

    // This is a very targeted cleaner for TS1117
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        const level = (line.match(/^\s*/)[0].length / 4) - 1; // 4 spaces = 1 level relative to 'id' (which is level 1)

        // Skip duplicate top-level props like 'inputs:' or 'description:'
        // (Calculated level 1 is usually 8 spaces indent)
        if (line.startsWith('        ') && !line.startsWith('            ')) {
            const m = line.match(/^\s+(['"]?\w+['"]?)\s*:/);
            if (m) {
                const key = m[1].replace(/['"]/g, '');
                if (level1Keys.has(key)) {
                    // It's a duplicate top-level property within the same calculator
                    // Skip till the end of this property block
                    let nestedBraces = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
                    while (nestedBraces > 0 && i < lines.length - 1) {
                        i++;
                        const l = lines[i];
                        nestedBraces += (l.match(/\{/g) || []).length - (l.match(/\}/g) || []).length;
                    }
                    console.log(`  Removed duplicate level-1 prop: ${key}`);
                    continue;
                }
                level1Keys.add(key);
            }
        }

        // Handle meta properties
        if (trimmed.startsWith('meta: {')) { inMeta = true; braceCount = 1; }
        else if (inMeta) {
            braceCount += (trimmed.match(/\{/g) || []).length - (trimmed.match(/\}/g) || []).length;
            if (braceCount === 0) { inMeta = false; metaKeys.clear(); }
            else {
                const m = line.match(/^\s+(['"]?\w+['"]?)\s*:/);
                if (m) {
                    const key = m[1].replace(/['"]/g, '');
                    if (metaKeys.has(key)) {
                        console.log(`  Removed duplicate meta prop: ${key}`);
                        continue;
                    }
                    metaKeys.add(key);
                }
            }
        }

        resultLines.push(line);
    }
    return resultLines.join('\n');
}

const finalSections = [];
for (let [key, content] of sectionsMap) {
    finalSections.push(cleanBlock(content));
}

let newBody = finalSections.join('');

// One last pass for common issues
newBody = newBody.replace(/primaryUnit:/g, 'unit:');
newBody = newBody.replace(/^\s+width:\s*'[^']+',?$/gm, '');

fs.writeFileSync(targetFile, header + newBody + footer);
console.log('Consolidation and deep cleaning complete.');
