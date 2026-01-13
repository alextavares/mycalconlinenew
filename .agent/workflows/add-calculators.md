---
description: How to add calculators from Omni Calculator using AI
---

# Workflow: Adding Calculators from Omni Calculator

This workflow describes the systematic process for adding calculators to the project using AI assistance. Follow this process to avoid duplicates and maintain consistency.

## Pre-Session Checklist

Before starting a new AI session:

1. Check `calculator-registry.json` for the last session's progress
2. Note the `lastAddedId` and `lastAddedCategory`
3. Decide which Omni category to work on next

## Adding Calculators (Step-by-Step)

### Step 1: Identify Target Calculators

Navigate to the Omni Calculator category page and select 5-10 calculators to add.

### Step 2: Validate Each ID

// turbo
For each calculator, run the validation script:
```bash
node scripts/validate-new-calculator.js <calculator-id>
```

If validation fails, skip that calculator and move to the next.

### Step 3: Create Calculator Definition

Use the template at `templates/calculator-template.ts` as reference.

Add the new calculator at the **END** of the `calculators` object in `src/config/calculators.ts`:

```typescript
    'new-calculator-id': {
        id: 'new-calculator-id',
        title: 'Calculator Title',
        description: 'Description here',
        category: 'math', // Use valid category
        icon: 'calculator-icon',
        meta: {
            title: 'Calculator Title | MyCalcOnline',
            description: 'SEO description',
            keywords: ['keyword1', 'keyword2']
        },
        inputs: [
            { id: 'input1', label: 'Label', type: 'number', placeholder: 'Value' }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs: Record<string, any>) => {
                    return Number(inputs.input1) || 0;
                }
            }
        ],
        content: {
            whatIs: 'new-calculator-id.whatIs',
            howTo: 'new-calculator-id.howTo',
            faq: []
        }
    },
```

### Step 4: Verify TypeScript

// turbo
After adding each calculator, run:
```bash
npm run calc:check
```

If there are errors, fix them before proceeding.

### Step 5: Update Registry

// turbo
After successful addition:
```bash
node scripts/update-registry.js <calculator-id> <category> omni
```

### Step 6: Test in Browser

// turbo
Start the dev server if not running:
```bash
npm run dev
```

Navigate to `http://localhost:3000/en/calculator/<calculator-id>` and verify:
- Page loads without errors
- Inputs are displayed correctly
- Calculations work properly

## End of Session

### Step 7: Log the Session

// turbo
At the end of each AI session:
```bash
node scripts/log-session.js "<summary of what was added>" <number-of-calculators>
```

### Step 8: Commit Changes

```bash
git add .
git commit -m "feat(calculators): add <N> calculators from <category> category"
```

## Rules to Follow

1. **Maximum 10 calculators per session** - Reduces risk of accumulated errors
2. **Always validate before adding** - Prevents duplicates
3. **Always use the template structure** - Ensures consistency
4. **Never modify existing calculators** - Only add new ones
5. **Always test in browser** - Catches runtime errors
6. **Log every session** - Enables progress tracking

## Troubleshooting

### "ID already exists"
Skip this calculator - it's already in the system.

### TypeScript errors after adding
Check for:
- Missing commas
- Incorrect property names (`unit` not `primaryUnit`)
- Invalid category values
- `calculate` function not returning `string | number`

### Calculator page shows "Not Found"
Check that the `id` in the URL matches the key in the `calculators` object.
