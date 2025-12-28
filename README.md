# Demo Web Shop • Playwright JS

Minimal Playwright test suite for https://demowebshop.tricentis.com with dotenv-based config and Allure reporting.

## Quick Start

```bash
npm install
npx playwright install

# run the full suite
npm test

# headed mode (debug visually)
npm run test:headed
```

## Environment

- `BASE_URL`: Base site under test (defaults to https://demowebshop.tricentis.com).
- `DEMO_EMAIL` / `DEMO_PASSWORD`: Login credentials used by tests (fallbacks exist in [src/utils/env.js](src/utils/env.js)).

To override values locally, create a `.env` file and set:

```bash
# .env
BASE_URL=https://demowebshop.tricentis.com
DEMO_EMAIL=your-email@example.com
DEMO_PASSWORD=your-password
```

## Test Data

- Order data lives in [test-data/order-multiple-products.json](test-data/order-multiple-products.json).
- The test loads it via [src/utils/testData.js](src/utils/testData.js).

## Run A Specific Test

```bash
npx playwright test tests/place-order-multiple-products.spec.js
```

## Reports

```bash
# HTML report (after a run)
npm run report:html

## Cleanup (Optional)

- Clear previous artifacts to reduce noise:

```bash
rm -rf playwright-report/*
rm -rf test-results/*
```
