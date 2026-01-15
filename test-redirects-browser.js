#!/usr/bin/env node

/**
 * Browser-based Redirect Testing Script
 * Tests ALL documented URL redirects using Playwright (handles both server-side and client-side redirects)
 *
 * Usage: node test-redirects-browser.js [URL]
 * Example: node test-redirects-browser.js http://localhost:3000
 * Example: node test-redirects-browser.js https://deploy-preview-243--absmartly-docs.netlify.app
 *
 * Last Updated: 2026-01-14 (commits 45eeaf3, 666c96c)
 * Reference: .claude/audits/complete_url_mapping_45eeaf3.md
 */

const { chromium } = require('playwright');

// Get URL from command line argument or use default
const BASE_URL = process.argv[2] || 'http://localhost:3000';

// Comprehensive redirect mappings from static/_redirects and anchorRedirects.ts
const REDIRECTS = [
  // ============================================================================
  // SERVER-SIDE REDIRECTS (from static/_redirects)
  // ============================================================================

  // 1. Creating an Experiment - Base redirect
  {
    from: '/docs/web-console-docs/creating-an-experiment',
    to: '/docs/web-console-docs/experiments/creating-an-experiment',
    type: 'server-only',
    description: 'Base page redirect (no anchor)'
  },

  // 2. Creating a Feature - Base redirect
  {
    from: '/docs/web-console-docs/creating-a-feature',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature',
    type: 'server-only',
    description: 'Base page redirect (no anchor)'
  },

  // 3. Setting up GST Experiment - Base redirect (CORRECTED in 666c96c)
  {
    from: '/docs/web-console-docs/setting-up-a-gst-experiment',
    to: '/docs/web-console-docs/experiments/setting-up-a-gst-experiment',
    type: 'server-only',
    description: 'Base page redirect (corrected in 666c96c)'
  },

  // 4. Experiment Reports - Base redirect
  {
    from: '/docs/web-console-docs/Experiment-reports',
    to: '/docs/web-console-docs/experiments/Experiment-reports',
    type: 'server-only',
    description: 'Base page redirect (case-sensitive)'
  },

  // 5. Understanding Experimentation Metrics - Wildcard redirect
  {
    from: '/docs/web-console-docs/understanding-experimentation-metrics/anything',
    to: '/docs/web-console-docs/goals-and-metrics/metrics/overview',
    type: 'server-wildcard',
    description: 'Wildcard redirect test'
  },

  // 6. Settings - Base redirect
  {
    from: '/docs/web-console-docs/settings',
    to: '/docs/web-console-docs/Configuration/settings',
    type: 'server-only',
    description: 'Base page redirect'
  },

  // 7. Type of Analysis - Redirect with forced anchor
  {
    from: '/docs/web-console-docs/type-of-analysis',
    to: '/docs/web-console-docs/experiments/overview#analysis-methods',
    type: 'server-with-anchor',
    description: 'Server redirect to specific anchor'
  },

  // ============================================================================
  // BROWSER ANCHOR PRESERVATION TESTS (should work without JavaScript)
  // ============================================================================

  // Test that browser preserves unchanged anchors during 302 redirects
  {
    from: '/docs/web-console-docs/creating-an-experiment#metadata',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#metadata',
    type: 'browser-preserved',
    description: 'Unchanged anchor - browser preserves'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#experiment-name',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#experiment-name',
    type: 'browser-preserved',
    description: 'Unchanged anchor - browser preserves'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#variants',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#variants',
    type: 'browser-preserved',
    description: 'Unchanged anchor - browser preserves'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#metrics',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#metrics',
    type: 'browser-preserved',
    description: 'Unchanged anchor - browser preserves'
  },
  {
    from: '/docs/web-console-docs/creating-a-feature#variants',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature#variants',
    type: 'browser-preserved',
    description: 'Unchanged anchor - browser preserves'
  },
  {
    from: '/docs/web-console-docs/creating-a-feature#metrics',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature#metrics',
    type: 'browser-preserved',
    description: 'Unchanged anchor - browser preserves'
  },
  {
    from: '/docs/web-console-docs/settings#custom-fields',
    to: '/docs/web-console-docs/Configuration/settings#custom-fields',
    type: 'browser-preserved',
    description: 'Unchanged anchor - browser preserves'
  },
  {
    from: '/docs/web-console-docs/Experiment-reports#experiment-velocity-report',
    to: '/docs/web-console-docs/experiments/Experiment-reports#experiment-velocity-report',
    type: 'browser-preserved',
    description: 'Unchanged anchor - browser preserves'
  },

  // ============================================================================
  // CLIENT-SIDE ANCHOR REDIRECTS (from anchorRedirects.ts)
  // ============================================================================

  // Creating an Experiment - Same-page anchor transformations (2)
  {
    from: '/docs/web-console-docs/creating-an-experiment#application',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#applications',
    type: 'js-transform',
    description: 'Anchor rename: application → applications'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#targeting-audiences',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#audiences',
    type: 'js-transform',
    description: 'Anchor rename: targeting-audiences → audiences'
  },

  // Creating an Experiment - Cross-page anchor redirects (3)
  {
    from: '/docs/web-console-docs/creating-an-experiment#error-control',
    to: '/docs/web-console-docs/experiments/setting-up-a-gst-experiment#error-control',
    type: 'js-cross-page',
    description: 'Cross-page redirect to GST experiment'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#sample-size-calculation',
    to: '/docs/web-console-docs/experiments/setting-up-a-gst-experiment#what-is-the-experiment-duration-based-on',
    type: 'js-cross-page',
    description: 'Cross-page redirect to GST experiment'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#type-of-analysis',
    to: '/docs/web-console-docs/experiments/overview#analysis-methods',
    type: 'js-cross-page',
    description: 'Cross-page redirect to overview'
  },

  // Creating a Feature - Same-page anchor transformations (4)
  {
    from: '/docs/web-console-docs/creating-a-feature#feature-name',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature#basics',
    type: 'js-transform',
    description: 'Anchor rename: feature-name → basics'
  },
  {
    from: '/docs/web-console-docs/creating-a-feature#tracking-unit',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature#audiences',
    type: 'js-transform',
    description: 'Anchor rename: tracking-unit → audiences'
  },
  {
    from: '/docs/web-console-docs/creating-a-feature#application',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature#audiences',
    type: 'js-transform',
    description: 'Anchor rename: application → audiences'
  },
  {
    from: '/docs/web-console-docs/creating-a-feature#targeting-audiences',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature#audiences',
    type: 'js-transform',
    description: 'Anchor rename: targeting-audiences → audiences'
  },

  // ============================================================================
  // NEW PATH ANCHOR TRANSFORMATIONS (after server redirect completes)
  // ============================================================================

  // Test that JS redirects work on NEW paths (after server redirect already happened)
  {
    from: '/docs/web-console-docs/experiments/creating-an-experiment#application',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#applications',
    type: 'js-transform-new-path',
    description: 'Anchor transform on new path'
  },
  {
    from: '/docs/web-console-docs/experiments/creating-an-experiment#targeting-audiences',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#audiences',
    type: 'js-transform-new-path',
    description: 'Anchor transform on new path'
  },
  {
    from: '/docs/web-console-docs/experiments/creating-an-experiment#error-control',
    to: '/docs/web-console-docs/experiments/setting-up-a-gst-experiment#error-control',
    type: 'js-cross-page-new-path',
    description: 'Cross-page redirect from new path'
  },
  {
    from: '/docs/web-console-docs/feature-flags/creating-a-feature#feature-name',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature#basics',
    type: 'js-transform-new-path',
    description: 'Anchor transform on new path'
  },
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
      timeout: 15000
    });

    // Wait longer for client-side redirects to complete
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
  console.log('🔍 Testing ALL redirects on:', BASE_URL);
  console.log('📋 Total tests:', REDIRECTS.length);
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

  // Group results by type for better reporting
  const resultsByType = {
    'server-only': [],
    'server-wildcard': [],
    'server-with-anchor': [],
    'browser-preserved': [],
    'js-transform': [],
    'js-cross-page': [],
    'js-transform-new-path': [],
    'js-cross-page-new-path': []
  };

  for (const redirect of REDIRECTS) {
    const result = await checkRedirect(page, redirect.from, redirect.to);
    result.type = redirect.type;
    result.description = redirect.description;
    results.push(result);

    if (!resultsByType[redirect.type]) {
      resultsByType[redirect.type] = [];
    }
    resultsByType[redirect.type].push(result);

    if (result.match) {
      passed++;
      console.log(`✅ PASS: ${redirect.from}`);
      console.log(`   → ${redirect.to}`);
      console.log(`   (${redirect.description})`);
    } else {
      failed++;
      console.log(`❌ FAIL: ${redirect.from}`);
      console.log(`   Expected: ${redirect.to}`);
      if (result.finalPath) {
        console.log(`   Got: ${result.finalPath}`);
      }
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      console.log(`   (${redirect.description})`);
    }
    console.log('');
  }

  await browser.close();

  console.log('━'.repeat(80));
  console.log('');
  console.log('📊 SUMMARY BY TYPE');
  console.log('━'.repeat(80));
  console.log('');

  // Report results by type
  for (const [type, typeResults] of Object.entries(resultsByType)) {
    if (typeResults.length === 0) continue;

    const typePassed = typeResults.filter(r => r.match).length;
    const typeFailed = typeResults.filter(r => !r.match).length;
    const typeTotal = typeResults.length;

    const typeLabel = {
      'server-only': 'Server-Side Base Redirects',
      'server-wildcard': 'Server-Side Wildcard Redirects',
      'server-with-anchor': 'Server-Side with Forced Anchor',
      'browser-preserved': 'Browser-Preserved Anchors',
      'js-transform': 'Client-Side Anchor Transforms (Old Paths)',
      'js-cross-page': 'Client-Side Cross-Page Redirects (Old Paths)',
      'js-transform-new-path': 'Client-Side Anchor Transforms (New Paths)',
      'js-cross-page-new-path': 'Client-Side Cross-Page Redirects (New Paths)'
    }[type] || type;

    console.log(`${typeLabel}:`);
    console.log(`  Total: ${typeTotal} | ✅ Pass: ${typePassed} | ❌ Fail: ${typeFailed}`);

    if (typeFailed > 0) {
      console.log(`  Failed tests:`);
      typeResults.filter(r => !r.match).forEach(r => {
        console.log(`    - ${r.fromPath} → Expected: ${r.expectedPath}, Got: ${r.finalPath || 'error'}`);
      });
    }
    console.log('');
  }

  console.log('━'.repeat(80));
  console.log('');
  console.log('📊 OVERALL SUMMARY');
  console.log('━'.repeat(80));
  console.log(`Total tests: ${REDIRECTS.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('');

  if (failed > 0) {
    console.log('❌ Some redirects are not working correctly.');
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('  1. Ensure the site is fully built (yarn build)');
    console.log('  2. Check that anchorRedirects.ts is loaded in docusaurus.config.js');
    console.log('  3. Verify static/_redirects file is deployed to Netlify');
    console.log('  4. Test on deploy preview URL, not localhost (if testing server redirects)');
    console.log('');
    process.exit(1);
  } else {
    console.log('✅ All redirects are working correctly!');
    console.log('');
    console.log('📝 Redirect Summary:');
    console.log(`  - Server-side redirects: 7`);
    console.log(`  - Browser-preserved anchors: 8`);
    console.log(`  - JavaScript anchor transforms: 13`);
    console.log(`  - Total URL mappings tested: ${REDIRECTS.length}`);
    console.log('');
    process.exit(0);
  }
}

// Run the tests
testAllRedirects().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
