# MyCalcOnline Calculator Platform

## Development

```bash
# Start server
npx next dev -p 3005
```

## Testing

To verify all 110+ calculators:

```bash
# Install browsers (first time)
npx playwright install chromium

# Run all tests
npx playwright test
```

## Architecture
- **Calculators**: Defined in `src/config/calculators.ts`
- **Engine**: `src/app/[locale]/calculator/[id]/engine-client.tsx`
