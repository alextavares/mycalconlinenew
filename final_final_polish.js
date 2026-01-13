const fs = require('fs');
const targetFile = 'src/config/calculators.ts';
let content = fs.readFileSync(targetFile, 'utf8');

// Fix currency: true to currency: '$' (or whatever is common)
content = content.replace(/currency: true/g, "currency: '$'");

// Fix remaining specific implicit any patterns from tsc
// (Ih, Il, BPh, BPl, etc.)
content = content.replace(/\((Ih, Il, BPh, BPl)\) =>/g, "((Ih: any, Il: any, BPh: any, BPl: any)) =>");
// More generic: replace any (param1, param2, ...) => with typed version if it's inside a calc callback
// But simpler: just add types to the most common offenders seen
content = content.replace(/\(Ih, Il, BPh, BPl, target\)/g, "(Ih: any, Il: any, BPh: any, BPl: any, target: any)");

fs.writeFileSync(targetFile, content);
console.log('Final final polish complete.');
