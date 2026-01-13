const fs = require('fs');
const targetFile = 'src/config/calculators.ts';
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Fix Categories
const categoryMapping = {
    'Physics': 'physics',
    'Mathematics': 'math', // or mathematics
    'Everyday': 'everyday',
    'Health': 'health',
    'Finance': 'finance'
};

for (const [bad, good] of Object.entries(categoryMapping)) {
    const re = new RegExp(`category: '${bad}'`, 'g');
    content = content.replace(re, `category: '${good}'`);
}

// 2. Fix Keywords from string to string[]
// Handle keywords: '...' patterns
content = content.replace(/keywords: '([^']+)'(,?)/g, "keywords: ['$1']$2");

// 3. Fix FAQ from string to []
// Patterns like faq: '...' or faq: "..."
content = content.replace(/faq: ['"][^'"]+['"](,?)/g, "faq: []$1");

// 4. Fix double-calculate error (just in case)
// (Sometimes they appear because of messy merging)
// Actually surgical_clean.js should have handled this.

fs.writeFileSync(targetFile, content);
console.log('Final polish complete.');
