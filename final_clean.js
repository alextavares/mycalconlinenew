const fs = require('fs');

const targetFile = 'src/config/calculators.ts';
const content = fs.readFileSync(targetFile, 'utf8');

const startMarker = 'export const calculators: Record<string, CalculatorConfig> = {';
const startIndex = content.indexOf(startMarker);
if (startIndex === -1) process.exit(1);

const header = content.substring(0, startIndex + startMarker.length);
const footerStart = content.lastIndexOf('};');
const body = content.substring(startIndex + startMarker.length, footerStart);
const footer = content.substring(footerStart);

const keyRegex = /^\s{4}'([^']+)': \{/gm;
let match;
const sectionsMap = new Map();
let lastPos = 0;
let lastKey = null;

while ((match = keyRegex.exec(body)) !== null) {
    if (lastKey !== null) {
        sectionsMap.set(lastKey, body.substring(lastPos, match.index));
    }
    lastKey = match[1];
    lastPos = match.index;
}
if (lastKey !== null) {
    sectionsMap.set(lastKey, body.substring(lastPos));
}

console.log(`Processing ${sectionsMap.size} sections...`);

function cleanSection(text) {
    // 1. Standardize types: calculate: (inputs) => -> calculate: (inputs: Record<string, any>) =>
    text = text.replace(/calculate: \(inputs\) =>/g, "calculate: (inputs: Record<string, any>) =>");

    // 2. Standardize property names
    text = text.replace(/primaryUnit:/g, 'unit:');
    text = text.replace(/^\s+width:\s*'[^']+',?$/gm, '');

    // 3. Fix most common duplicate in meta: title and description
    // Since meta is usually one block, we can find it and clean it.
    const metaMatch = text.match(/meta:\s*\{([\s\S]+?)\}/);
    if (metaMatch) {
        const metaContent = metaMatch[1];
        const lines = metaContent.split('\n');
        const uniqueMetaLines = new Map();
        lines.forEach(l => {
            const m = l.match(/^\s+(['"]?\w+['"]?)\s*:/);
            if (m) {
                const k = m[1].replace(/['"]/g, '');
                uniqueMetaLines.set(k, l);
            }
        });

        let newMeta = 'meta: {\n';
        for (let [k, v] of uniqueMetaLines) {
            newMeta += v + (v.trim().endsWith(',') ? '\n' : ',\n');
        }
        newMeta += '        }';
        text = text.replace(/meta:\s*\{[\s\S]+?\}/, newMeta);
    }

    // 4. Handle the specific composting-ratio-calculator duplicate inputs
    if (text.includes("'composting-ratio-calculator'")) {
        // Keep only the second 'inputs:'
        const parts = text.split(/^\s{8}inputs:/m);
        if (parts.length > 2) {
            // Keep preamble + last inputs block + everything after
            text = parts[0] + '        inputs:' + parts[parts.length - 1];
        }
    }

    // 5. Ensure the whole calculator block ends with a comma if it's followed by another
    text = text.trimEnd();
    if (text.endsWith('}') && !text.endsWith('},')) {
        text += ',';
    }
    text += '\n';

    return text;
}

const finalSections = [];
for (let [key, val] of sectionsMap) {
    finalSections.push(cleanSection(val));
}

let finalBody = finalSections.join('');
// One final check: sometimes keys have duplicate declarations at the top level
// But we already consolidated them into unique sections.

fs.writeFileSync(targetFile, header + '\n' + finalBody + footer);
console.log('Final clean complete.');
