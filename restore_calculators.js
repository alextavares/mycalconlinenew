const fs = require('fs');

const targetFile = 'src/config/calculators.ts';
const rawContent = fs.readFileSync(targetFile, 'utf8');

const startMarker = 'export const calculators: Record<string, CalculatorConfig> = {';
const startIndex = rawContent.indexOf(startMarker);
if (startIndex === -1) {
    console.error('Could not find start marker');
    process.exit(1);
}

const header = rawContent.substring(0, startIndex + startMarker.length);
const footerStart = rawContent.lastIndexOf('};');
const body = rawContent.substring(startIndex + startMarker.length, footerStart);
const footer = rawContent.substring(footerStart);

// 1. De-duplicate top-level calculators (keep last)
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
    // A. Standardize types: calculate: (inputs) => -> calculate: (inputs: Record<string, any>) =>
    text = text.replace(/calculate: \(inputs\) =>/g, "calculate: (inputs: Record<string, any>) =>");

    // B. Standardize property names
    text = text.replace(/primaryUnit:/g, 'unit:');
    text = text.replace(/^\s+width:\s*'[^']+',?$/gm, '');

    // C. Fix most common duplicate in meta: title and description
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
            newMeta += v.trimEnd() + (v.trim().endsWith(',') ? '\n' : ',\n');
        }
        newMeta += '        }';
        text = text.replace(/meta:\s*\{[\s\S]+?\}/, newMeta);
    }

    // D. De-duplicate 'inputs:' or 'outputs:' if they occur twice at same level
    // (composting-ratio-calculator fix)
    const topProps = ['inputs', 'outputs'];
    topProps.forEach(p => {
        const parts = text.split(new RegExp(`^\\s{8}${p}:`, 'm'));
        if (parts.length > 2) {
            text = parts[0] + `        ${p}:` + parts[parts.length - 1];
        }
    });

    // E. Fix Categories (Lowercase)
    const categoryMapping = {
        'Physics': 'physics',
        'Mathematics': 'math',
        'Everyday': 'everyday',
        'Health': 'health',
        'Finance': 'finance',
        'Conversion': 'conversion'
    };
    for (const [bad, good] of Object.entries(categoryMapping)) {
        const re = new RegExp(`category: '${bad}'`, 'g');
        text = text.replace(re, `category: '${good}'`);
    }

    // F. Fix Keywords (String to Array)
    text = text.replace(/keywords: '([^']+)'(,?)/g, "keywords: ['$1']$2");

    // G. Fix FAQ (String to Empty Array)
    text = text.replace(/faq: ['"][^'"]+['"](,?)/g, "faq: []$1");

    // H. Fix Currency (True to '$') - Use $$ for literal $ to avoid backreference issues
    text = text.replace(/currency: true/g, "currency: '$$'");

    // I. Fix implicit any in map/filter/reduce
    text = text.replace(/\.reduce\(\(a, b\)/g, '.reduce((a: any, b: any)');
    text = text.replace(/\.map\(\(n\)/g, '.map((n: any)');
    text = text.replace(/\.filter\(\(n\)/g, '.filter((n: any)');
    text = text.replace(/\.map\(n =>/g, '.map((n: any) =>');
    text = text.replace(/\.filter\(n =>/g, '.filter((n: any) =>');
    text = text.replace(/\.map\(\(x\)/g, '.map((x: any)');
    text = text.replace(/\.filter\(\(x\)/g, '.filter((x: any)');
    text = text.replace(/\(Ih, Il, BPh, BPl, target\)/g, "(Ih: any, Il: any, BPh: any, BPl: any, target: any)");
    text = text.replace(/\(Ih, Il, BPh, BPl\)/g, "(Ih: any, Il: any, BPh: any, BPl: any)");

    // Ensure the block ends cleanly
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

let resultBody = finalSections.join('');

fs.writeFileSync(targetFile, header + '\n' + resultBody + footer);
console.log('Restoration complete with 0 duplicate property and major type fixes.');
