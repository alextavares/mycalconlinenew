---
name: add-calculator
description: Adds new calculators to the project following the established workflow (Omni Calculator replication). Use this skill when the user asks to "add calculators", "continue adding", or "work on the roadmap".
---

# Add Calculator Skill

This skill guides you through the process of adding new calculators to the `sitemycalc` project, replicating them from Omni Calculator.

## When to use this skill

- When the user asks to add new calculators.
- When working on the `CALCULATOR_ROADMAP.md`.
- When you need to systematically add a batch of calculators (max 10 per session).

## 🛠️ Prerequisites

Before adding any calculator, you MUST:
1.  Read `calculator-registry.json` to check the current progress (`lastAddedId`, `lastAddedCategory`).
2.  Consult `docs/CALCULATOR_ROADMAP.md` to identify the next category/subcategory.
3.  Visit [Omni Calculator](https://www.omnicalculator.com/all) (or specific category page) to find calculator sources.

## 📋 Workflow

Follow these steps strictly for each session:

### 1. Preparation
1.  **Identify Category:** Determine which category to work on (e.g., `math/percentages`, `finance/loans`).
2.  **Select Calculators:** Choose up to 10 calculators from Omni Calculator that fit the category.

### 2. Validation (CRITICAL)
For **EACH** calculator you plan to add, run the validation script:
```bash
node scripts/validate-new-calculator.js <calculator-id>
```
- If validation **FAILS** (duplicate ID), SKIP that calculator or choose a different ID.
- If validation **PASSES**, proceed.

### 3. Implementation
Add the calculator definition to `src/config/calculators.ts`.
- **Location:** Append to the end of the `calculators` object.
- **Template:** Use the structure below (do not invent new fields).

```typescript
'calculator-id': {
    id: 'calculator-id',
    title: 'Calculator Title',
    description: 'Brief description.',
    category: 'category-name', // e.g: math, finance
    icon: 'calculator-icon',
    meta: {
        title: 'SEO Title | MyCalcOnline',
        description: 'SEO Description.',
        keywords: ['keyword1', 'keyword2']
    },
    inputs: [
        { id: 'input1', label: 'Label', type: 'number', placeholder: '0' }
    ],
    outputs: [
        {
            label: 'Result Label',
            calculate: (inputs: Record<string, any>) => {
                const val = Number(inputs.input1) || 0;
                return (val * 2).toFixed(2);
            }
        }
    ],
    content: {
        whatIs: 'calculator-id.whatIs',
        howTo: 'calculator-id.howTo',
        faq: []
    }
},
```

### 4. Verification
After adding the code, run:
```bash
npm run calc:check
```
Fix any TypeScript errors immediately.

### 5. Registry Update
Update the registry for EACH added calculator:
```bash
node scripts/update-registry.js <calculator-id> <category> omni
```

### 6. Session Logging & Roadmap
At the end of the batch (max 10):
1.  Log the session:
    ```bash
    node scripts/log-session.js "Added 10 [category] calculators: list, of, ids" <count>
    ```
2.  Update `docs/CALCULATOR_ROADMAP.md`:
    - Update the progress count (e.g., `10/~150`).
    - Change status to `🟡 Em progresso` if needed.

## ✅ Quality Checklist

- [ ] **ID Format:** Kebab-case (e.g., `simple-interest`).
- [ ] **No Duplicates:** Validated with script.
- [ ] **Types:** `calculate` function uses `Number()` and handles `NaN`.
- [ ] **Return:** Always returns string or number, never `null`.
- [ ] **Categories:** Matches `calculator-registry.json` categories.

## ⚠️ Common Pitfalls

- **Do not** use `width` in inputs.
- **Do not** return `null` in calculate function (use `0` or `'---'`).
- **Do not** add more than 10 calculators without user confirmation.
- **Do not** break the build (always run `npm run calc:check`).
