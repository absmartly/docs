#!/usr/bin/env node

/**
 * Browser-based Redirect Testing Script
 * Tests all documented URL redirects using Playwright (handles both server-side and client-side redirects)
 *
 * Usage: node test-redirects-browser.js [URL]
 * Example: node test-redirects-browser.js http://localhost:3000
 * Example: node test-redirects-browser.js https://deploy-preview-238--absmartly-docs.netlify.app
 */

const { chromium } = require('playwright');

// Get URL from command line argument or use default
const BASE_URL = process.argv[2] || 'http://localhost:3000';

// Hardcoded redirect mappings from Google Sheets
const REDIRECTS = [
  // Experiment Creation
  {
    from: '/docs/web-console-docs/creating-an-experiment',
    to: '/docs/web-console-docs/experiments/creating-an-experiment'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#metadata',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#metadata'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#experiment-name',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#experiment-name'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#tracking-unit',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#tracking-unit'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#application',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#applications'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#targeting-audiences',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#audiences'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#variants',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#variants'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#metrics',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#metrics'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#error-control',
    to: '/docs/web-console-docs/experiments/setting-up-a-gst-experiment#error-control'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#sample-size-calculation',
    to: '/docs/web-console-docs/experiments/setting-up-a-gst-experiment#what-is-the-experiment-duration-based-on'
  },
  // Feature Creation
  {
    from: '/docs/web-console-docs/creating-a-feature#feature-name',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature#basics'
  },
  {
    from: '/docs/web-console-docs/creating-a-feature#tracking-unit',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature#audiences'
  },
  {
    from: '/docs/web-console-docs/creating-a-feature#application',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature#audiences'
  },
  {
    from: '/docs/web-console-docs/creating-a-feature#targeting-audiences',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature#audiences'
  },
  {
    from: '/docs/web-console-docs/creating-a-feature#variants',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature#variants'
  },
  {
    from: '/docs/web-console-docs/creating-a-feature#metrics',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature#metrics'
  },
  // Experiment Reports
  {
    from: '/docs/web-console-docs/Experiment-reports#experiment-velocity-report',
    to: '/docs/web-console-docs/experiments/Experiment-reports#experiment-velocity-report'
  },
  {
    from: '/docs/web-console-docs/Experiment-reports#decisions-overview',
    to: '/docs/web-console-docs/experiments/Experiment-reports#decisions-overview'
  },
  {
    from: '/docs/web-console-docs/Experiment-reports#decisions-history',
    to: '/docs/web-console-docs/experiments/Experiment-reports#decisions-history'
  },
  // Metrics & Settings
  {
    from: '/docs/web-console-docs/understanding-experimentation-metrics/',
    to: '/docs/web-console-docs/goals-and-metrics/metrics/overview'
  },
  {
    from: '/docs/web-console-docs/settings#custom-fields',
    to: '/docs/web-console-docs/Configuration/settings#custom-fields'
  },
  {
    from: '/docs/web-console-docs/settings#dialogs',
    to: '/docs/web-console-docs/Configuration/settings#dialogs'
  },
  // Analysis Methods
  {
    from: '/docs/web-console-docs/creating-an-experiment#type-of-analysis',
    to: '/docs/web-console-docs/experiments/overview#analysis-methods'
  },
  {
    from: '/docs/web-console-docs/type-of-analysis',
    to: '/docs/web-console-docs/experiments/overview#analysis-methods'
  },
  {
    from: '/docs/web-console-docs/setting-up-a-gst-experiment',
    to: '/docs/web-console-docs/experiments/setting-up-a-fixed-horizon-experiment'
  }
];

function normalizeUrl(url) {
  // Normalize URL by removing trailing slashes and slashes before anchors
  return url.replace(/\/$/, '').replace(/\/#/, '#').toLowerCase();
}

async function checkRedirect(page, fromPath, expectedToPath) {
  const fullFromUrl = `${BASE_URL}${fromPath}`;
  const expectedFullUrl = `${BASE_URL}${expectedToPath}`;

  try {
    // Navigate to the from URL
    await page.goto(fullFromUrl, {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    // Wait a bit for any client-side redirects to complete
    await page.waitForTimeout(500);

    // Get the final URL after any redirects
    const finalUrl = page.url();
    const finalPath = finalUrl.replace(BASE_URL, '');

    // Normalize for comparison
    const normalizedFinal = normalizeUrl(finalPath);
    const normalizedExpected = normalizeUrl(expectedToPath);

    const match = normalizedFinal === normalizedExpected;

    return {
      success: true,
      match,
      fromPath,
      expectedPath: expectedToPath,
      finalPath,
      finalUrl
    };
  } catch (error) {
    return {
      success: false,
      match: false,
      fromPath,
      expectedPath: expectedToPath,
      error: error.message,
      finalUrl: null
    };
  }
}

async function testAllRedirects() {
  console.log('🔍 Testing redirects on:', BASE_URL);
  console.log('━'.repeat(80));
  console.log('');

  const browser = await chromium.launch({
    headless: true
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];
  let passed = 0;
  let failed = 0;

  for (const redirect of REDIRECTS) {
    const result = await checkRedirect(page, redirect.from, redirect.to);
    results.push(result);

    if (result.match) {
      passed++;
      console.log(`✅ PASS: ${redirect.from} → ${redirect.to}`);
    } else {
      failed++;
      console.log(`❌ FAIL: ${redirect.from} → ${redirect.to}`);
      if (result.finalPath) {
        console.log(`   Got: ${result.finalPath}`);
      }
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    }
  }

  await browser.close();

  console.log('');
  console.log('━'.repeat(80));
  console.log('');
  console.log('📊 SUMMARY');
  console.log('━'.repeat(80));
  console.log(`Total tests: ${REDIRECTS.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('');

  if (failed > 0) {
    console.log('❌ Some redirects are not working correctly.');
    process.exit(1);
  } else {
    console.log('✅ All redirects are working correctly!');
    process.exit(0);
  }
}

// Run the tests
testAllRedirects().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
