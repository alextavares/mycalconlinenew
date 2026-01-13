const fs = require('fs');

const targetFile = 'src/config/calculators.ts';
const content = fs.readFileSync(targetFile, 'utf8');

const startMarker = 'export const calculators: Record<string, CalculatorConfig> = {';
const startIndex = content.indexOf(startMarker);
if (startIndex === -1) process.exit(1);

const body = content.substring(startIndex + startMarker.length, content.lastIndexOf('};'));

const keyRegex = /^\s{4}'([^']+)': \{/gm;
let match;
const offenders = [];
let lastKey = null;
let lastIndex = 0;

while ((match = keyRegex.exec(body)) !== null) {
    if (lastKey) {
        const block = body.substring(lastIndex, match.index);
        const inputMatches = block.match(/^ {8}inputs:/gm);
        const outputMatches = block.match(/^ {8}outputs:/gm);
        if ((inputMatches && inputMatches.length > 1) || (outputMatches && outputMatches.length > 1)) {
            offenders.push({ key: lastKey, inputs: inputMatches ? inputMatches.length : 0, outputs: outputMatches ? outputMatches.length : 0 });
        }
    }
    lastKey = match[1];
    lastIndex = match.index;
}

console.log('Calculators with duplicate inputs/outputs:');
console.log(JSON.stringify(offenders, null, 2));
console.log(`Total offenders: ${offenders.length}`);
