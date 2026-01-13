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

console.log(`Processing ${sectionsMap.size} unique calculators...`);

function cleanBlock(text) {
    const lines = text.split('\n');
    let braceLevel = 0;
    const properties = []; // { key, lines: [] }
    let currentProp = null;
    let headerLines = [];

    for (let line of lines) {
        const trimmed = line.trim();
        const indent = line.match(/^ */)[0].length;

        if (line.match(/^ {4}'[^']+': \{/)) {
            headerLines.push(line);
            braceLevel = 1;
            continue;
        }

        if (braceLevel === 1 && indent === 8 && line.includes(':')) {
            const m = line.match(/^ {8}(['"]?\w+['"]?)\s*:/);
            if (m) {
                const key = m[1].replace(/['"]/g, '');
                currentProp = { key, lineArray: [line] };
                properties.push(currentProp);
                braceLevel += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
                continue;
            }
        }

        if (currentProp) {
            currentProp.lineArray.push(line);
            braceLevel += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
            if (braceLevel === 1) {
                // Property group ended
                currentProp = null;
            }
        } else if (braceLevel === 1) {
            headerLines.push(line);
        } else {
            headerLines.push(line);
            braceLevel += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
        }
    }

    // Deduplicate props
    const uniqueProps = new Map();
    properties.forEach(p => uniqueProps.set(p.key, p.lineArray));

    // Reassemble
    let result = [];
    result.push(headerLines[0]); // Calculator opening line

    for (let [key, linesArr] of uniqueProps) {
        // Ensure meta has its own deduplication
        if (key === 'meta') {
            linesArr = cleanMeta(linesArr);
        }

        // Ensure it ends with a comma
        let lastLine = linesArr[linesArr.length - 1];
        if (lastLine.trim().endsWith('}') && !lastLine.trim().endsWith('},')) {
            linesArr[linesArr.length - 1] = lastLine.replace(/\}$/, '},');
        } else if (lastLine.trim().endsWith(']') && !lastLine.trim().endsWith('],')) {
            linesArr[linesArr.length - 1] = lastLine.replace(/\]$/, '],');
        }

        result.push(...linesArr);
    }

    // Footer
    result.push(...headerLines.slice(1));

    return result.join('\n');
}

function cleanMeta(lines) {
    const metaProps = new Map();
    const result = [];
    let startLine = lines[0];
    let endLine = lines[lines.length - 1];

    // Internal meta props are usually on single lines or short blocks
    const internalLines = lines.slice(1, -1);
    internalLines.forEach((l, idx) => {
        const m = l.match(/^\s+(['"]?\w+['"]?)\s*:/);
        if (m) metaProps.set(m[1].replace(/['"]/g, ''), idx);
    });

    result.push(startLine);
    internalLines.forEach((l, idx) => {
        const m = l.match(/^\s+(['"]?\w+['"]?)\s*:/);
        if (m) {
            if (metaProps.get(m[1].replace(/['"]/g, '')) === idx) result.push(l);
        } else {
            result.push(l);
        }
    });
    result.push(endLine);
    return result;
}

const finalSections = [];
for (let [key, val] of sectionsMap) {
    finalSections.push(cleanBlock(val));
}

let newBody = finalSections.join('');
newBody = newBody.replace(/primaryUnit:/g, 'unit:');
newBody = newBody.replace(/^\s+width:\s*'[^']+',?$/gm, '');

// Final fixes for common type errors
newBody = newBody.replace(/calculate: \(inputs\) =>/g, "calculate: (inputs: Record<string, any>) =>");

fs.writeFileSync(targetFile, header + newBody + footer);
console.log('Perfect cleaning complete.');
