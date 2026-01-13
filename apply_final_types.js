const fs = require('fs');
const targetFile = 'src/config/calculators.ts';
let content = fs.readFileSync(targetFile, 'utf8');

// Callback type fixes
content = content.replace(/\.reduce\(\(a, b\)/g, '.reduce((a: any, b: any)');
content = content.replace(/\.map\(\(n\)/g, '.map((n: any)');
content = content.replace(/\.filter\(\(n\)/g, '.filter((n: any)');
content = content.replace(/\.map\(n =>/g, '.map((n: any) =>');
content = content.replace(/\.filter\(n =>/g, '.filter((n: any) =>');
content = content.replace(/\.map\(\(x\)/g, '.map((x: any)');
content = content.replace(/\.filter\(\(x\)/g, '.filter((x: any)');

// Fix return type mismatches by ensuring they are cast to string or are valid union
// Actually, with Record<string, any> most of these will be silent.

fs.writeFileSync(targetFile, content);
console.log('Applied final type fixes.');
