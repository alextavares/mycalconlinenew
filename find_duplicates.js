const fs = require('fs');

const content = fs.readFileSync('src/config/calculators.ts', 'utf8');
const lines = content.split('\n');

const keyRegex = /^\s*'([^']+)': \{/;
const keysFound = {};
const duplicates = [];

lines.forEach((line, index) => {
    const match = line.match(keyRegex);
    if (match) {
        const key = match[1];
        if (keysFound[key]) {
            duplicates.push({ key, firstLine: keysFound[key], secondLine: index + 1 });
            keysFound[key].count++;
        } else {
            keysFound[key] = { line: index + 1, count: 1 };
        }
    }
});

console.log('Duplicate IDs found:');
Object.keys(keysFound).forEach(key => {
    if (keysFound[key].count > 1) {
        console.log(`${key}: ${keysFound[key].count} times (First at line ${keysFound[key].line})`);
    }
});
