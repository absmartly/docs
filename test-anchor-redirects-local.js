#!/usr/bin/env node

/**
 * Local Anchor Redirect Testing Script
 * Tests client-side anchor redirects on pages that exist locally
 * This tests the JavaScript redirect logic without needing server-side redirects
 *
 * Usage: node test-anchor-redirects-local.js [URL]
 * Example: node test-anchor-redirects-local.js http://localhost:3000
 */

const { chromium } = require('playwright');

// Get URL from command line argument or use default
const BASE_URL = process.argv[2] || 'http://localhost:3000';

// Test anchor redirects on OLD pages (that still exist locally)
// These should redirect to the new structure via client-side JS
const ANCHOR_REDIRECT_TESTS = [
  // Old page anchor redirects - should redirect to NEW pages with transformed anchors
  {
    from: '/docs/web-console-docs/creating-an-experiment#application',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#applications',
    description: 'Old page anchor → new page with transformed anchor'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#targeting-audiences',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#audiences',
    description: 'Old page anchor → new page with transformed anchor'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#error-control',
    to: '/docs/web-console-docs/experiments/setting-up-a-gst-experiment#error-control',
    description: 'Redirect to different page from old page'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#type-of-analysis',
    to: '/docs/web-console-docs/experiments/overview#analysis-methods',
    description: 'Redirect to different page from old page'
  },
  {
    from: '/docs/web-console-docs/creating-a-feature#feature-name',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature#basics',
    description: 'Old page anchor → new page with transformed anchor'
  },
  {
    from: '/docs/web-console-docs/creating-a-feature#tracking-unit',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature#audiences',
    description: 'Old page anchor → new page with transformed anchor'
  },
];

function normalizeUrl(url) {
  return url.replace(/\/$/, '').replace(/\/#/, '#').toLowerCase();
}

async function checkAnchorRedirect(page, fromPath, expectedToPath, description) {
  const fullFromUrl = `${BASE_URL}${fromPath}`;

  try {
    // Enable console message capturing to see our debug logs
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.text().includes('[AnchorRedirect]')) {
        consoleLogs.push(msg.text());
      }
    });

    // Navigate to the from URL
    await page.goto(fullFromUrl, {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    // Wait a bit for any client-side redirects to complete
    await page.waitForTimeout(1000);

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
      description,
      consoleLogs
    };
  } catch (error) {
    return {
      success: false,
      match: false,
      fromPath,
      expectedPath: expectedToPath,
      error: error.message,
      description
    };
  }
}

async function testAllAnchorRedirects() {
  console.log('🔍 Testing anchor redirects on:', BASE_URL);
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

  for (const test of ANCHOR_REDIRECT_TESTS) {
    const result = await checkAnchorRedirect(page, test.from, test.to, test.description);
    results.push(result);

    if (result.match) {
      passed++;
      console.log(`✅ PASS: ${test.from} → ${test.to}`);
      console.log(`   ${test.description}`);
    } else {
      failed++;
      console.log(`❌ FAIL: ${test.from} → ${test.to}`);
      console.log(`   ${test.description}`);
      if (result.finalPath) {
        console.log(`   Got: ${result.finalPath}`);
      }
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      if (result.consoleLogs && result.consoleLogs.length > 0) {
        console.log(`   Console logs:`);
        result.consoleLogs.forEach(log => console.log(`     ${log}`));
      }
    }
    console.log('');
  }

  await browser.close();

  console.log('━'.repeat(80));
  console.log('');
  console.log('📊 SUMMARY');
  console.log('━'.repeat(80));
  console.log(`Total tests: ${ANCHOR_REDIRECT_TESTS.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('');

  if (failed > 0) {
    console.log('❌ Some anchor redirects are not working correctly.');
    process.exit(1);
  } else {
    console.log('✅ All anchor redirects are working correctly!');
    process.exit(0);
  }
}

// Run the tests
testAllAnchorRedirects().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
