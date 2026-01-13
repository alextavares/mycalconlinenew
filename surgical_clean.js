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
if (lastKey !== null) {
    sections.push({ key: lastKey, content: body.substring(lastPos) });
}

console.log(`Cleaning ${sections.length} calculators...`);

function surgicalClean(blockText) {
    const lines = blockText.split('\n');
    const properties = []; // { key, start, end }
    let currentProp = null;
    let braceBalance = 0;

    // First pass to identify top-level properties (8 spaces indent)
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const indent = line.match(/^ */)[0].length;

        // Potential key start
        if (indent === 8 && line.includes(':')) {
            const keyMatch = line.match(/^ {8}(['"]?\w+['"]?)\s*:/);
            if (keyMatch) {
                if (currentProp) currentProp.end = i - 1;
                const key = keyMatch[1].replace(/['"]/g, '');
                currentProp = { key, start: i, end: i };
                properties.push(currentProp);
                // Reset brace balance for this property value
                braceBalance = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
                continue;
            }
        }

        if (currentProp) {
            braceBalance += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
            if (braceBalance <= 0 && line.trim().endsWith(',')) {
                // Property value ended
                currentProp.end = i;
                currentProp = null;
            } else {
                currentProp.end = i;
            }
        }
    }

    // Identify last occurrences
    const lastIndices = new Map();
    properties.forEach((p, idx) => {
        lastIndices.set(p.key, idx);
    });

    // Build the new block, keeping only last occurrences of duplicated keys
    const resultLines = [];
    const keepLineIndices = new Set();

    // Add lines that are NOT part of any property first (header/first line)
    // Actually, let's just find which lines to SKIP.
    const skipLineIndices = new Set();
    properties.forEach((p, idx) => {
        if (lastIndices.get(p.key) !== idx) {
            console.log(`  Skipping duplicate property: ${p.key} (lines ${p.start + 1}-${p.end + 1})`);
            for (let i = p.start; i <= p.end; i++) skipLineIndices.add(i);
        }
    });

    for (let i = 0; i < lines.length; i++) {
        if (!skipLineIndices.has(i)) {
            let line = lines[i];

            // Sub-cleaning for 'meta' object duplicates
            if (line.includes('meta: {')) {
                // Find meta block bounds
                let metaStart = i;
                let metaEnd = i;
                let b = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
                while (b > 0 && metaEnd < lines.length - 1) {
                    metaEnd++;
                    b += (lines[metaEnd].match(/\{/g) || []).length - (lines[metaEnd].match(/\}/g) || []).length;
                }

                // Deduplicate within meta lines
                const metaLines = lines.slice(metaStart, metaEnd + 1);
                const metaProps = new Map();
                metaLines.forEach((ml, mlIdx) => {
                    const mpMatch = ml.match(/^\s+(['"]?\w+['"]?)\s*:/);
                    if (mpMatch) metaProps.set(mpMatch[1].replace(/['"]/g, ''), mlIdx);
                });

                const cleanedMeta = metaLines.filter((ml, mlIdx) => {
                    const mpMatch = ml.match(/^\s+(['"]?\w+['"]?)\s*:/);
                    if (mpMatch) {
                        const k = mpMatch[1].replace(/['"]/g, '');
                        return metaProps.get(k) === mlIdx;
                    }
                    return true;
                });

                resultLines.push(...cleanedMeta);
                i = metaEnd; // skip original meta block
                continue;
            }

            resultLines.push(line);
        }
    }
    return resultLines.join('\n');
}

const cleanedSections = sections.map(sec => surgicalClean(sec.content));
let newBody = cleanedSections.join('');

// Pad properties
newBody = newBody.replace(/primaryUnit:/g, 'unit:');
newBody = newBody.replace(/^\s+width:\s*'[^']+',?$/gm, '');

fs.writeFileSync(targetFile, header + newBody + footer);
console.log('Surgical cleaning complete.');
