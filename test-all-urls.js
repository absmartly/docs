#!/usr/bin/env node

/**
 * Comprehensive URL Testing Script
 * Tests ALL documentation pages + all redirects using Playwright
 *
 * Usage: node test-all-urls.js [URL]
 * Example: node test-all-urls.js http://localhost:3000
 * Example: node test-all-urls.js https://deploy-preview-243--absmartly-docs.netlify.app
 *
 * This script:
 * 1. Finds all .mdx files in the docs directory
 * 2. Converts them to URL paths
 * 3. Tests that each page loads successfully (200 OK)
 * 4. Tests all old→new redirects work correctly
 *
 * Last Updated: 2026-01-14 (commits 45eeaf3, 666c96c, 9e122f8)
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Get URL from command line argument or use default
const BASE_URL = process.argv[2] || 'http://localhost:3000';
const DOCS_DIR = path.join(__dirname, 'docs');

/**
 * Convert filesystem path to URL path
 * /Users/.../docs/docs/get-started.mdx → /docs/get-started
 * /Users/.../docs/docs/web-console-docs/Events/goal-events.mdx → /docs/web-console-docs/Events/goal-events
 */
function filePathToUrl(filePath) {
  const relativePath = path.relative(DOCS_DIR, filePath);
  const urlPath = '/' + relativePath
    .replace(/\.mdx$/, '')
    .replace(/\\/g, '/');
  return '/docs' + urlPath;
}

/**
 * Recursively find all .mdx files
 */
function findAllMdxFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        // Skip API documentation directories (generated files)
        if (entry.name === 'SDK-API' || entry.name === 'Web-Console-API') {
          continue;
        }
        traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
        // Skip generated API files
        if (entry.name.endsWith('.api.mdx') || entry.name.endsWith('.info.mdx')) {
          continue;
        }
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

// Redirect test cases
const REDIRECT_TESTS = [
  // SERVER-SIDE REDIRECTS
  {
    from: '/docs/web-console-docs/creating-an-experiment',
    to: '/docs/web-console-docs/experiments/creating-an-experiment',
    type: 'server-redirect'
  },
  {
    from: '/docs/web-console-docs/creating-a-feature',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature',
    type: 'server-redirect'
  },
  {
    from: '/docs/web-console-docs/setting-up-a-gst-experiment',
    to: '/docs/web-console-docs/experiments/setting-up-a-gst-experiment',
    type: 'server-redirect'
  },
  {
    from: '/docs/web-console-docs/Experiment-reports',
    to: '/docs/web-console-docs/experiments/Experiment-reports',
    type: 'server-redirect'
  },
  {
    from: '/docs/web-console-docs/understanding-experimentation-metrics/test',
    to: '/docs/web-console-docs/goals-and-metrics/metrics/overview',
    type: 'server-wildcard'
  },
  {
    from: '/docs/web-console-docs/settings',
    to: '/docs/web-console-docs/Configuration/settings',
    type: 'server-redirect'
  },
  {
    from: '/docs/web-console-docs/type-of-analysis',
    to: '/docs/web-console-docs/experiments/overview#analysis-methods',
    type: 'server-redirect'
  },

  // BROWSER-PRESERVED ANCHORS
  {
    from: '/docs/web-console-docs/creating-an-experiment#metadata',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#metadata',
    type: 'browser-preserved'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#experiment-name',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#experiment-name',
    type: 'browser-preserved'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#variants',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#variants',
    type: 'browser-preserved'
  },
  {
    from: '/docs/web-console-docs/creating-a-feature#variants',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature#variants',
    type: 'browser-preserved'
  },
  {
    from: '/docs/web-console-docs/settings#custom-fields',
    to: '/docs/web-console-docs/Configuration/settings#custom-fields',
    type: 'browser-preserved'
  },

  // CLIENT-SIDE ANCHOR TRANSFORMS
  {
    from: '/docs/web-console-docs/creating-an-experiment#application',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#applications',
    type: 'js-transform'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#targeting-audiences',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#audiences',
    type: 'js-transform'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#error-control',
    to: '/docs/web-console-docs/experiments/setting-up-a-gst-experiment#error-control',
    type: 'js-cross-page'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#sample-size-calculation',
    to: '/docs/web-console-docs/experiments/setting-up-a-gst-experiment#what-is-the-experiment-duration-based-on',
    type: 'js-cross-page'
  },
  {
    from: '/docs/web-console-docs/creating-an-experiment#type-of-analysis',
    to: '/docs/web-console-docs/experiments/overview#analysis-methods',
    type: 'js-cross-page'
  },
  {
    from: '/docs/web-console-docs/creating-a-feature#feature-name',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature#basics',
    type: 'js-transform'
  },
  {
    from: '/docs/web-console-docs/creating-a-feature#tracking-unit',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature#audiences',
    type: 'js-transform'
  },
  {
    from: '/docs/web-console-docs/creating-a-feature#application',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature#audiences',
    type: 'js-transform'
  },
  {
    from: '/docs/web-console-docs/creating-a-feature#targeting-audiences',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature#audiences',
    type: 'js-transform'
  },

  // NEW PATH ANCHOR TRANSFORMS
  {
    from: '/docs/web-console-docs/experiments/creating-an-experiment#application',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#applications',
    type: 'js-transform-new'
  },
  {
    from: '/docs/web-console-docs/experiments/creating-an-experiment#targeting-audiences',
    to: '/docs/web-console-docs/experiments/creating-an-experiment#audiences',
    type: 'js-transform-new'
  },
  {
    from: '/docs/web-console-docs/feature-flags/creating-a-feature#feature-name',
    to: '/docs/web-console-docs/feature-flags/creating-a-feature#basics',
    type: 'js-transform-new'
  },
];

function normalizeUrl(url) {
  return url.replace(/\/$/, '').replace(/\/#/, '#').toLowerCase();
}

async function checkPageLoads(page, urlPath) {
  const fullUrl = `${BASE_URL}${urlPath}`;

  try {
    const response = await page.goto(fullUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    const status = response.status();
    const success = status === 200;

    return {
      success,
      urlPath,
      status,
      error: success ? null : `HTTP ${status}`
    };
  } catch (error) {
    return {
      success: false,
      urlPath,
      status: null,
      error: error.message
    };
  }
}

async function checkRedirect(page, fromPath, expectedToPath) {
  const fullFromUrl = `${BASE_URL}${fromPath}`;

  try {
    await page.goto(fullFromUrl, {
      waitUntil: 'networkidle',
      timeout: 15000
    });

    // Wait for client-side redirects
    await page.waitForTimeout(1000);

    const finalUrl = page.url();
    const finalPath = finalUrl.replace(BASE_URL, '');

    const normalizedFinal = normalizeUrl(finalPath);
    const normalizedExpected = normalizeUrl(expectedToPath);

    const match = normalizedFinal === normalizedExpected;

    return {
      success: true,
      match,
      fromPath,
      expectedPath: expectedToPath,
      finalPath
    };
  } catch (error) {
    return {
      success: false,
      match: false,
      fromPath,
      expectedPath: expectedToPath,
      error: error.message
    };
  }
}

async function testAllUrls() {
  console.log('🔍 Comprehensive URL Testing');
  console.log('━'.repeat(80));
  console.log('Base URL:', BASE_URL);
  console.log('');

  // Find all MDX files and convert to URLs
  console.log('📁 Scanning for documentation files...');
  const mdxFiles = findAllMdxFiles(DOCS_DIR);
  const pageUrls = mdxFiles.map(filePathToUrl);

  console.log(`Found ${mdxFiles.length} documentation pages`);
  console.log(`Found ${REDIRECT_TESTS.length} redirect tests`);
  console.log(`Total URLs to test: ${pageUrls.length + REDIRECT_TESTS.length}`);
  console.log('');
  console.log('━'.repeat(80));
  console.log('');

  const browser = await chromium.launch({
    headless: true
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Test 1: All current pages load correctly
  console.log('📄 TESTING ALL DOCUMENTATION PAGES');
  console.log('━'.repeat(80));
  console.log('');

  let pagesOk = 0;
  let pagesFailed = 0;
  const failedPages = [];

  for (const urlPath of pageUrls) {
    const result = await checkPageLoads(page, urlPath);

    if (result.success) {
      pagesOk++;
      process.stdout.write('✅');
    } else {
      pagesFailed++;
      failedPages.push(result);
      process.stdout.write('❌');
    }

    // New line every 50 tests for readability
    if ((pagesOk + pagesFailed) % 50 === 0) {
      process.stdout.write('\n');
    }
  }

  console.log('\n');
  console.log(`Pages tested: ${pageUrls.length}`);
  console.log(`✅ Passed: ${pagesOk}`);
  console.log(`❌ Failed: ${pagesFailed}`);

  if (pagesFailed > 0) {
    console.log('');
    console.log('❌ Failed pages:');
    failedPages.forEach(p => {
      console.log(`  - ${p.urlPath} (${p.error})`);
    });
  }

  console.log('');
  console.log('━'.repeat(80));
  console.log('');

  // Test 2: All redirects work correctly
  console.log('🔀 TESTING ALL REDIRECTS');
  console.log('━'.repeat(80));
  console.log('');

  let redirectsOk = 0;
  let redirectsFailed = 0;
  const failedRedirects = [];

  const redirectsByType = {};

  for (const redirectTest of REDIRECT_TESTS) {
    const result = await checkRedirect(page, redirectTest.from, redirectTest.to);
    result.type = redirectTest.type;

    if (!redirectsByType[redirectTest.type]) {
      redirectsByType[redirectTest.type] = { passed: 0, failed: 0, tests: [] };
    }

    if (result.match) {
      redirectsOk++;
      redirectsByType[redirectTest.type].passed++;
      console.log(`✅ PASS: ${redirectTest.from} → ${redirectTest.to}`);
    } else {
      redirectsFailed++;
      redirectsByType[redirectTest.type].failed++;
      failedRedirects.push(result);
      console.log(`❌ FAIL: ${redirectTest.from}`);
      console.log(`   Expected: ${redirectTest.to}`);
      console.log(`   Got: ${result.finalPath || 'error'}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    }

    redirectsByType[redirectTest.type].tests.push(result);
  }

  await browser.close();

  console.log('');
  console.log('Redirects tested: ${REDIRECT_TESTS.length}');
  console.log(`✅ Passed: ${redirectsOk}`);
  console.log(`❌ Failed: ${redirectsFailed}`);

  console.log('');
  console.log('By type:');
  for (const [type, stats] of Object.entries(redirectsByType)) {
    const total = stats.passed + stats.failed;
    console.log(`  ${type}: ${stats.passed}/${total} passed`);
  }

  console.log('');
  console.log('━'.repeat(80));
  console.log('');
  console.log('📊 FINAL SUMMARY');
  console.log('━'.repeat(80));
  console.log('');
  console.log(`Total documentation pages: ${pageUrls.length}`);
  console.log(`  ✅ Working: ${pagesOk}`);
  console.log(`  ❌ Broken: ${pagesFailed}`);
  console.log('');
  console.log(`Total redirects: ${REDIRECT_TESTS.length}`);
  console.log(`  ✅ Working: ${redirectsOk}`);
  console.log(`  ❌ Broken: ${redirectsFailed}`);
  console.log('');
  console.log(`GRAND TOTAL: ${pageUrls.length + REDIRECT_TESTS.length} URLs tested`);
  console.log(`  ✅ Passed: ${pagesOk + redirectsOk}`);
  console.log(`  ❌ Failed: ${pagesFailed + redirectsFailed}`);
  console.log('');

  const totalFailed = pagesFailed + redirectsFailed;

  if (totalFailed > 0) {
    console.log(`❌ ${totalFailed} URLs are not working correctly.`);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('  1. Ensure the site is fully built (yarn build)');
    console.log('  2. Check that anchorRedirects.ts is loaded correctly');
    console.log('  3. Verify static/_redirects is deployed to Netlify');
    console.log('  4. For server redirects, test on deploy preview URL');
    console.log('');
    process.exit(1);
  } else {
    console.log('✅ All URLs are working correctly!');
    console.log('');
    console.log('🎉 Site is healthy:');
    console.log(`  - ${pagesOk} documentation pages accessible`);
    console.log(`  - ${redirectsOk} redirects working`);
    console.log(`  - 0 broken links`);
    console.log('');
    process.exit(0);
  }
}

// Run the tests
console.log('Starting comprehensive URL testing...\n');
testAllUrls().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
