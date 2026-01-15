#!/usr/bin/env node

/**
 * Redirect Testing Script
 * Tests all documented URL redirects on a specified domain
 *
 * Usage: node test-redirects.js [URL]
 * Example: node test-redirects.js http://localhost:3000
 * Example: node test-redirects.js https://deploy-preview-238--absmartly-docs.netlify.app
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Get URL from command line argument or use default
const PREVIEW_DOMAIN = process.argv[2] || 'http://localhost:3000';

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
    to: '/docs/web-console-docs/creating-a-feature#audiences'
  },
  {
    from: '/docs/web-console-docs/creating-a-feature#application',
    to: '/docs/web-console-docs/creating-a-feature#audiences'
  },
  {
    from: '/docs/web-console-docs/creating-a-feature#targeting-audiences',
    to: '/docs/web-console-docs/creating-a-feature#audiences'
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
  return url.replace(/#.*$/, '');
}

function checkRedirect(fromPath, expectedToPath) {
  return new Promise((resolve) => {
    const fullUrl = `${PREVIEW_DOMAIN}${fromPath}`;
    const parsedUrl = new URL(fullUrl);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const options = {
      method: 'GET',
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search + parsedUrl.hash,
      headers: {
        'User-Agent': 'Redirect-Checker/1.0'
      },
      // Don't follow redirects automatically
      followRedirect: false
    };

    const req = client.request(options, (res) => {
      const statusCode = res.statusCode;
      const location = res.headers.location;

      if (statusCode >= 300 && statusCode < 400 && location) {
        // Extract path from location (could be relative or absolute)
        let redirectPath;
        if (location.startsWith('http')) {
          const redirectUrl = new URL(location);
          redirectPath = redirectUrl.pathname + redirectUrl.search + redirectUrl.hash;
        } else {
          redirectPath = location;
        }

        const normalizedRedirect = normalizeUrl(redirectPath);
        const normalizedExpected = normalizeUrl(expectedToPath);

        const isMatch = normalizedRedirect === normalizedExpected || redirectPath === expectedToPath;

        resolve({
          success: true,
          statusCode,
          redirectsTo: redirectPath,
          expected: expectedToPath,
          match: isMatch,
          fromPath,
          fullUrl
        });
      } else if (statusCode === 200) {
        // Check if we landed on the expected page (might be client-side redirect)
        resolve({
          success: true,
          statusCode: 200,
          redirectsTo: fromPath,
          expected: expectedToPath,
          match: normalizeUrl(fromPath) === normalizeUrl(expectedToPath),
          warning: 'No redirect header (200 OK) - might be client-side redirect',
          fromPath,
          fullUrl
        });
      } else {
        resolve({
          success: false,
          statusCode,
          error: `Unexpected status code: ${statusCode}`,
          expected: expectedToPath,
          fromPath,
          fullUrl
        });
      }
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        error: error.message,
        expected: expectedToPath,
        fromPath,
        fullUrl
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        success: false,
        error: 'Request timeout',
        expected: expectedToPath,
        fromPath,
        fullUrl
      });
    });

    req.end();
  });
}

async function testAllRedirects() {
  console.log('🔍 Testing redirects on:', PREVIEW_DOMAIN);
  console.log('━'.repeat(80));
  console.log('');

  const results = [];
  let passed = 0;
  let failed = 0;
  let warnings = 0;

  for (const redirect of REDIRECTS) {
    const result = await checkRedirect(redirect.from, redirect.to);
    results.push(result);

    if (result.match) {
      passed++;
      console.log(`✅ PASS: ${redirect.from} → ${redirect.to}`);
    } else if (result.warning) {
      warnings++;
      console.log(`⚠️  WARN: ${redirect.from} → ${redirect.to} (${result.warning})`);
    } else {
      failed++;
      console.log(`❌ FAIL: ${redirect.from} → ${redirect.to} (${result.error || 'Status: ' + result.statusCode})`);
    }

    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('━'.repeat(80));
  console.log('');
  console.log('📊 SUMMARY');
  console.log('━'.repeat(80));
  console.log(`Total tests: ${REDIRECTS.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('');

  if (failed > 0) {
    console.log('❌ Some redirects are not working correctly.');
    process.exit(1);
  } else if (warnings > 0) {
    console.log('⚠️  All redirects passed, but some have warnings.');
    process.exit(0);
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
