#!/usr/bin/env node

/**
 * Comprehensive URL Testing Script
 * Tests ALL documentation pages + all redirects using Playwright
 *
 * Usage: node test-all-urls.js [URL] [--only-failed]
 *
 * Examples:
 *   node test-all-urls.js http://localhost:3000
 *   node test-all-urls.js https://deploy-preview-243--absmartly-docs.netlify.app
 *   node test-all-urls.js https://deploy-preview-243--absmartly-docs.netlify.app --only-failed
 *
 * Flags:
 *   --only-failed  Test only the pages that failed in the previous run (avoids rate limits)
 *
 * This script:
 * 1. Finds all .mdx files in the docs directory (or uses failed list if --only-failed)
 * 2. Converts them to URL paths
 * 3. Tests that each page loads successfully (200 OK)
 * 4. Tests ALL old→new redirects work correctly
 * 5. Throttles requests (200ms delay) to avoid rate limiting
 *
 * Last Updated: 2026-01-26 (comprehensive redirect audit)
 * Total Redirects: 169 server-side + 9 anchor transforms + anchor preservation tests = 192+ total
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const onlyFailed = args.includes('--only-failed') || args.includes('--failed-only');
const BASE_URL = args.find(arg => !arg.startsWith('--')) || 'http://localhost:3000';
const DOCS_DIR = path.join(__dirname, 'docs');

// Throttling configuration to avoid rate limiting
const THROTTLE_MS = 25; // 25ms delay between requests (40 requests/second)

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Previously failed pages from last run (HTTP 403)
const PREVIOUSLY_FAILED_PAGES = [
  '/docs/platform-release-notes/2025/10',
  '/docs/platform-release-notes/2025/11',
  '/docs/platform-release-notes/2025/12',
  '/docs/web-console-docs/Configuration/Applications',
  '/docs/web-console-docs/Configuration/Units',
  '/docs/web-console-docs/Configuration/settings',
  '/docs/web-console-docs/Events/downloading-events',
  '/docs/web-console-docs/Events/exposure-events',
  '/docs/web-console-docs/Events/goal-events',
  '/docs/web-console-docs/Events/the-events-page',
  '/docs/web-console-docs/Events/visitors-identity',
  '/docs/web-console-docs/Users-teams-Permissions/Roles',
  '/docs/web-console-docs/Users-teams-Permissions/Teams',
  '/docs/web-console-docs/Users-teams-Permissions/ownership-and-permissions',
  '/docs/web-console-docs/experiments/Aborting-experiments',
  '/docs/web-console-docs/experiments/Experiment-reports',
  '/docs/web-console-docs/experiments/Interpreting-metrics-in-experiment-results',
  '/docs/web-console-docs/experiments/creating-an-experiment',
  '/docs/web-console-docs/experiments/overview',
  '/docs/web-console-docs/experiments/setting-up-a-fixed-horizon-experiment',
  '/docs/web-console-docs/experiments/setting-up-a-gst-experiment',
  '/docs/web-console-docs/experiments/templates',
  '/docs/web-console-docs/feature-flags/creating-a-feature',
  '/docs/web-console-docs/goals-and-metrics/goals/create',
  '/docs/web-console-docs/goals-and-metrics/goals/overview',
  '/docs/web-console-docs/goals-and-metrics/metrics/categories',
  '/docs/web-console-docs/goals-and-metrics/metrics/create',
  '/docs/web-console-docs/goals-and-metrics/metrics/metric-types/goal-count',
  '/docs/web-console-docs/goals-and-metrics/metrics/metric-types/goal-unique-count',
  '/docs/web-console-docs/goals-and-metrics/metrics/metric-types/property',
  '/docs/web-console-docs/goals-and-metrics/metrics/metric-types/ratio',
  '/docs/web-console-docs/goals-and-metrics/metrics/metric-types/time-to-achievement',
  '/docs/web-console-docs/goals-and-metrics/metrics/metric-types/unique-property-count',
  '/docs/web-console-docs/goals-and-metrics/metrics/overview',
  '/docs/web-console-docs/launchpad-browser-extension/creating-an-experiment-with-the-launchpad',
  '/docs/web-console-docs/launchpad-browser-extension/getting-started',
  '/docs/web-console-docs/overview',
];

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
        // Skip generated API documentation directories
        if (entry.name === 'SDK-API' && currentDir.includes('APIs-and-SDKs')) {
          continue;
        }
        if (entry.name === 'Web-Console-API' && currentDir.includes('APIs-and-SDKs')) {
          continue;
        }
        traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
        // Skip generated API files
        if (entry.name.endsWith('.api.mdx') || entry.name.endsWith('.info.mdx')) {
          continue;
        }
        // Skip underscore-prefixed partial files
        if (entry.name.startsWith('_')) {
          continue;
        }
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

// ALL SERVER-SIDE REDIRECTS (from static/_redirects) - 169 total
const SERVER_REDIRECTS = [
  // SDK Documentation moves - PascalCase (10)
  { from: '/docs/SDK-Documentation/Advanced/code-as-a-variant-variable', to: '/docs/APIs-and-SDKs/SDK-Documentation/Advanced/code-as-a-variant-variable', type: 'server' },
  { from: '/docs/SDK-Documentation/Advanced/context-attributes', to: '/docs/APIs-and-SDKs/SDK-Documentation/Advanced/context-attributes', type: 'server' },
  { from: '/docs/SDK-Documentation/Advanced/custom-assignments', to: '/docs/APIs-and-SDKs/SDK-Documentation/Advanced/custom-assignments', type: 'server' },
  { from: '/docs/SDK-Documentation/Advanced/finalize', to: '/docs/APIs-and-SDKs/SDK-Documentation/Advanced/finalize', type: 'server' },
  { from: '/docs/SDK-Documentation/Advanced/publish', to: '/docs/APIs-and-SDKs/SDK-Documentation/Advanced/publish', type: 'server' },
  { from: '/docs/SDK-Documentation/Advanced/tracking-goals', to: '/docs/APIs-and-SDKs/SDK-Documentation/Advanced/tracking-goals', type: 'server' },
  { from: '/docs/SDK-Documentation/Advanced/using-custom-fields-in-your-code', to: '/docs/APIs-and-SDKs/SDK-Documentation/Advanced/using-custom-fields-in-your-code', type: 'server' },
  { from: '/docs/SDK-Documentation/basic-usage', to: '/docs/APIs-and-SDKs/SDK-Documentation/basic-usage', type: 'server' },
  { from: '/docs/SDK-Documentation/getting-started', to: '/docs/APIs-and-SDKs/SDK-Documentation/getting-started', type: 'server' },
  { from: '/docs/SDK-Documentation', to: '/docs/APIs-and-SDKs/SDK-Documentation', type: 'server' },

  // SDK Documentation moves - Lowercase/Google-indexed (10)
  { from: '/docs/sdk-documentation/advanced/code-as-a-variant-variable', to: '/docs/APIs-and-SDKs/SDK-Documentation/Advanced/code-as-a-variant-variable', type: 'server' },
  { from: '/docs/sdk-documentation/advanced/context-attributes', to: '/docs/APIs-and-SDKs/SDK-Documentation/Advanced/context-attributes', type: 'server' },
  { from: '/docs/sdk-documentation/advanced/custom-assignments', to: '/docs/APIs-and-SDKs/SDK-Documentation/Advanced/custom-assignments', type: 'server' },
  { from: '/docs/sdk-documentation/advanced/finalize', to: '/docs/APIs-and-SDKs/SDK-Documentation/Advanced/finalize', type: 'server' },
  { from: '/docs/sdk-documentation/advanced/publish', to: '/docs/APIs-and-SDKs/SDK-Documentation/Advanced/publish', type: 'server' },
  { from: '/docs/sdk-documentation/advanced/tracking-goals', to: '/docs/APIs-and-SDKs/SDK-Documentation/Advanced/tracking-goals', type: 'server' },
  { from: '/docs/sdk-documentation/advanced/using-custom-fields-in-your-code', to: '/docs/APIs-and-SDKs/SDK-Documentation/Advanced/using-custom-fields-in-your-code', type: 'server' },
  { from: '/docs/sdk-documentation/basic-usage', to: '/docs/APIs-and-SDKs/SDK-Documentation/basic-usage', type: 'server' },
  { from: '/docs/sdk-documentation/getting-started', to: '/docs/APIs-and-SDKs/SDK-Documentation/getting-started', type: 'server' },
  { from: '/docs/sdk-documentation', to: '/docs/APIs-and-SDKs/SDK-Documentation', type: 'server' },

  // Old root-level getting-started (1)
  { from: '/docs/getting-started', to: '/docs/APIs-and-SDKs/SDK-Documentation/getting-started', type: 'server' },

  // Examples moves (2)
  { from: '/docs/Examples/Slack-Integration', to: '/docs/APIs-and-SDKs/Web-Console-API/Examples/Slack-Integration', type: 'server' },
  { from: '/docs/examples/slack-integration', to: '/docs/APIs-and-SDKs/Web-Console-API/Examples/Slack-Integration', type: 'server' },

  // Onboarding/SSO moves (12)
  { from: '/docs/onboarding/google%20saml%20setup', to: '/docs/Third-party-integrations/SSO/Google%20SAML%20Setup', type: 'server' },
  { from: '/docs/onboarding/azure%20saml%20setup', to: '/docs/Third-party-integrations/SSO/Azure%20SAML%20Setup', type: 'server' },
  { from: '/docs/onboarding/okta%20saml%20setup', to: '/docs/Third-party-integrations/SSO/Okta%20SAML%20Setup', type: 'server' },
  { from: '/docs/onboarding/google-saml-setup', to: '/docs/Third-party-integrations/SSO/Google%20SAML%20Setup', type: 'server' },
  { from: '/docs/onboarding/azure-saml-setup', to: '/docs/Third-party-integrations/SSO/Azure%20SAML%20Setup', type: 'server' },
  { from: '/docs/onboarding/okta-saml-setup', to: '/docs/Third-party-integrations/SSO/Okta%20SAML%20Setup', type: 'server' },
  { from: '/docs/Onboarding/Google%20SAML%20Setup', to: '/docs/Third-party-integrations/SSO/Google%20SAML%20Setup', type: 'server' },
  { from: '/docs/Onboarding/Azure%20SAML%20Setup', to: '/docs/Third-party-integrations/SSO/Azure%20SAML%20Setup', type: 'server' },
  { from: '/docs/Onboarding/Okta%20SAML%20Setup', to: '/docs/Third-party-integrations/SSO/Okta%20SAML%20Setup', type: 'server' },
  { from: '/docs/web-console-docs/SSO/Google%20SAML%20Setup', to: '/docs/Third-party-integrations/SSO/Google%20SAML%20Setup', type: 'server' },
  { from: '/docs/web-console-docs/SSO/Azure%20SAML%20Setup', to: '/docs/Third-party-integrations/SSO/Azure%20SAML%20Setup', type: 'server' },
  { from: '/docs/web-console-docs/SSO/Okta%20SAML%20Setup', to: '/docs/Third-party-integrations/SSO/Okta%20SAML%20Setup', type: 'server' },

  // Third-party integrations lowercase (3)
  { from: '/docs/third-party-integrations/zuko-integration', to: '/docs/Third-party-integrations/Zuko-Integration', type: 'server' },
  { from: '/docs/third-party-integrations/slack-integration', to: '/docs/Third-party-integrations/Slack-Integration', type: 'server' },
  { from: '/docs/third-party-integrations/segment-integration', to: '/docs/Third-party-integrations/Segment-Integration', type: 'server' },

  // Old API paths (6)
  { from: '/docs/API/collector-health-check', to: '/docs/APIs-and-SDKs/SDK-API/collector-health-check', type: 'server' },
  { from: '/docs/API/context-create', to: '/docs/APIs-and-SDKs/SDK-API/context-create', type: 'server' },
  { from: '/docs/API/context-get', to: '/docs/APIs-and-SDKs/SDK-API/context-get', type: 'server' },
  { from: '/docs/API/context-publish', to: '/docs/APIs-and-SDKs/SDK-API/context-publish', type: 'server' },
  { from: '/docs/API/context-publish-batch', to: '/docs/APIs-and-SDKs/SDK-API/context-publish-batch', type: 'server' },
  { from: '/docs/API/experiment-get', to: '/docs/APIs-and-SDKs/SDK-API/experiment-get', type: 'server' },

  // Web Console API - current naming (49)
  { from: '/docs/web-console-api/absmartly-web-console-api', to: '/docs/APIs-and-SDKs/Web-Console-API/absmartly-web-console-api', type: 'server' },
  { from: '/docs/web-console-api/api-key-get', to: '/docs/APIs-and-SDKs/Web-Console-API/api-key-get', type: 'server' },
  { from: '/docs/web-console-api/api-keys-list', to: '/docs/APIs-and-SDKs/Web-Console-API/api-keys-list', type: 'server' },
  { from: '/docs/web-console-api/application-get', to: '/docs/APIs-and-SDKs/Web-Console-API/application-get', type: 'server' },
  { from: '/docs/web-console-api/applications-list', to: '/docs/APIs-and-SDKs/Web-Console-API/applications-list', type: 'server' },
  { from: '/docs/web-console-api/cors-allowed-origin-get', to: '/docs/APIs-and-SDKs/Web-Console-API/cors-allowed-origin-get', type: 'server' },
  { from: '/docs/web-console-api/cors-allowed-origins-list', to: '/docs/APIs-and-SDKs/Web-Console-API/cors-allowed-origins-list', type: 'server' },
  { from: '/docs/web-console-api/environment-get', to: '/docs/APIs-and-SDKs/Web-Console-API/environment-get', type: 'server' },
  { from: '/docs/web-console-api/environments-list', to: '/docs/APIs-and-SDKs/Web-Console-API/environments-list', type: 'server' },
  { from: '/docs/web-console-api/experiment-activity-get', to: '/docs/APIs-and-SDKs/Web-Console-API/experiment-activity-get', type: 'server' },
  { from: '/docs/web-console-api/experiment-annotation-get', to: '/docs/APIs-and-SDKs/Web-Console-API/experiment-annotation-get', type: 'server' },
  { from: '/docs/web-console-api/experiment-annotations-list', to: '/docs/APIs-and-SDKs/Web-Console-API/experiment-annotations-list', type: 'server' },
  { from: '/docs/web-console-api/experiment-archive', to: '/docs/APIs-and-SDKs/Web-Console-API/experiment-archive', type: 'server' },
  { from: '/docs/web-console-api/experiment-comment-create', to: '/docs/APIs-and-SDKs/Web-Console-API/experiment-comment-create', type: 'server' },
  { from: '/docs/web-console-api/experiment-comment-reply-create', to: '/docs/APIs-and-SDKs/Web-Console-API/experiment-comment-reply-create', type: 'server' },
  { from: '/docs/web-console-api/experiment-full-on', to: '/docs/APIs-and-SDKs/Web-Console-API/experiment-full-on', type: 'server' },
  { from: '/docs/web-console-api/experiment-get', to: '/docs/APIs-and-SDKs/Web-Console-API/experiment-get', type: 'server' },
  { from: '/docs/web-console-api/experiment-main-metrics-data', to: '/docs/APIs-and-SDKs/Web-Console-API/experiment-main-metrics-data', type: 'server' },
  { from: '/docs/web-console-api/experiment-main-metrics-history-data', to: '/docs/APIs-and-SDKs/Web-Console-API/experiment-main-metrics-history-data', type: 'server' },
  { from: '/docs/web-console-api/experiment-participants-history-data', to: '/docs/APIs-and-SDKs/Web-Console-API/experiment-participants-history-data', type: 'server' },
  { from: '/docs/web-console-api/experiment-start', to: '/docs/APIs-and-SDKs/Web-Console-API/experiment-start', type: 'server' },
  { from: '/docs/web-console-api/experiment-stop', to: '/docs/APIs-and-SDKs/Web-Console-API/experiment-stop', type: 'server' },
  { from: '/docs/web-console-api/experiment-tag-get', to: '/docs/APIs-and-SDKs/Web-Console-API/experiment-tag-get', type: 'server' },
  { from: '/docs/web-console-api/experiment-tags-list', to: '/docs/APIs-and-SDKs/Web-Console-API/experiment-tags-list', type: 'server' },
  { from: '/docs/web-console-api/experiments-list', to: '/docs/APIs-and-SDKs/Web-Console-API/experiments-list', type: 'server' },
  { from: '/docs/web-console-api/goal-get', to: '/docs/APIs-and-SDKs/Web-Console-API/goal-get', type: 'server' },
  { from: '/docs/web-console-api/goal-tag-get', to: '/docs/APIs-and-SDKs/Web-Console-API/goal-tag-get', type: 'server' },
  { from: '/docs/web-console-api/goal-tags-list', to: '/docs/APIs-and-SDKs/Web-Console-API/goal-tags-list', type: 'server' },
  { from: '/docs/web-console-api/goals-list', to: '/docs/APIs-and-SDKs/Web-Console-API/goals-list', type: 'server' },
  { from: '/docs/web-console-api/metric-get', to: '/docs/APIs-and-SDKs/Web-Console-API/metric-get', type: 'server' },
  { from: '/docs/web-console-api/metric-tag-get', to: '/docs/APIs-and-SDKs/Web-Console-API/metric-tag-get', type: 'server' },
  { from: '/docs/web-console-api/metric-tags-list', to: '/docs/APIs-and-SDKs/Web-Console-API/metric-tags-list', type: 'server' },
  { from: '/docs/web-console-api/metrics-list', to: '/docs/APIs-and-SDKs/Web-Console-API/metrics-list', type: 'server' },
  { from: '/docs/web-console-api/permission-categories-list', to: '/docs/APIs-and-SDKs/Web-Console-API/permission-categories-list', type: 'server' },
  { from: '/docs/web-console-api/permissions-list', to: '/docs/APIs-and-SDKs/Web-Console-API/permissions-list', type: 'server' },
  { from: '/docs/web-console-api/role-get', to: '/docs/APIs-and-SDKs/Web-Console-API/role-get', type: 'server' },
  { from: '/docs/web-console-api/roles-list', to: '/docs/APIs-and-SDKs/Web-Console-API/roles-list', type: 'server' },
  { from: '/docs/web-console-api/segment-get', to: '/docs/APIs-and-SDKs/Web-Console-API/segment-get', type: 'server' },
  { from: '/docs/web-console-api/segments-list', to: '/docs/APIs-and-SDKs/Web-Console-API/segments-list', type: 'server' },
  { from: '/docs/web-console-api/team-get', to: '/docs/APIs-and-SDKs/Web-Console-API/team-get', type: 'server' },
  { from: '/docs/web-console-api/teams-list', to: '/docs/APIs-and-SDKs/Web-Console-API/teams-list', type: 'server' },
  { from: '/docs/web-console-api/unit-get', to: '/docs/APIs-and-SDKs/Web-Console-API/unit-get', type: 'server' },
  { from: '/docs/web-console-api/units-list', to: '/docs/APIs-and-SDKs/Web-Console-API/units-list', type: 'server' },
  { from: '/docs/web-console-api/user-api-keys-get', to: '/docs/APIs-and-SDKs/Web-Console-API/user-api-keys-get', type: 'server' },
  { from: '/docs/web-console-api/user-get', to: '/docs/APIs-and-SDKs/Web-Console-API/user-get', type: 'server' },
  { from: '/docs/web-console-api/users-list', to: '/docs/APIs-and-SDKs/Web-Console-API/users-list', type: 'server' },
  { from: '/docs/web-console-api/webhook-events-list', to: '/docs/APIs-and-SDKs/Web-Console-API/webhook-events-list', type: 'server' },
  { from: '/docs/web-console-api/webhook-get', to: '/docs/APIs-and-SDKs/Web-Console-API/webhook-get', type: 'server' },
  { from: '/docs/web-console-api/webhooks-list', to: '/docs/APIs-and-SDKs/Web-Console-API/webhooks-list', type: 'server' },

  // Web Console API - old naming convention get-*/list-* (39)
  { from: '/docs/web-console-api/get-api-key', to: '/docs/APIs-and-SDKs/Web-Console-API/api-key-get', type: 'server' },
  { from: '/docs/web-console-api/get-application', to: '/docs/APIs-and-SDKs/Web-Console-API/application-get', type: 'server' },
  { from: '/docs/web-console-api/get-cors-allowed-origin', to: '/docs/APIs-and-SDKs/Web-Console-API/cors-allowed-origin-get', type: 'server' },
  { from: '/docs/web-console-api/get-environment', to: '/docs/APIs-and-SDKs/Web-Console-API/environment-get', type: 'server' },
  { from: '/docs/web-console-api/get-experiment', to: '/docs/APIs-and-SDKs/Web-Console-API/experiment-get', type: 'server' },
  { from: '/docs/web-console-api/get-experiment-activity', to: '/docs/APIs-and-SDKs/Web-Console-API/experiment-activity-get', type: 'server' },
  { from: '/docs/web-console-api/get-experiment-annotation', to: '/docs/APIs-and-SDKs/Web-Console-API/experiment-annotation-get', type: 'server' },
  { from: '/docs/web-console-api/get-experiment-tag', to: '/docs/APIs-and-SDKs/Web-Console-API/experiment-tag-get', type: 'server' },
  { from: '/docs/web-console-api/get-goal', to: '/docs/APIs-and-SDKs/Web-Console-API/goal-get', type: 'server' },
  { from: '/docs/web-console-api/get-goal-tag', to: '/docs/APIs-and-SDKs/Web-Console-API/goal-tag-get', type: 'server' },
  { from: '/docs/web-console-api/get-metric', to: '/docs/APIs-and-SDKs/Web-Console-API/metric-get', type: 'server' },
  { from: '/docs/web-console-api/get-metric-tag', to: '/docs/APIs-and-SDKs/Web-Console-API/metric-tag-get', type: 'server' },
  { from: '/docs/web-console-api/get-role', to: '/docs/APIs-and-SDKs/Web-Console-API/role-get', type: 'server' },
  { from: '/docs/web-console-api/get-segment', to: '/docs/APIs-and-SDKs/Web-Console-API/segment-get', type: 'server' },
  { from: '/docs/web-console-api/get-team', to: '/docs/APIs-and-SDKs/Web-Console-API/team-get', type: 'server' },
  { from: '/docs/web-console-api/get-unit', to: '/docs/APIs-and-SDKs/Web-Console-API/unit-get', type: 'server' },
  { from: '/docs/web-console-api/get-user', to: '/docs/APIs-and-SDKs/Web-Console-API/user-get', type: 'server' },
  { from: '/docs/web-console-api/get-user-api-keys', to: '/docs/APIs-and-SDKs/Web-Console-API/user-api-keys-get', type: 'server' },
  { from: '/docs/web-console-api/get-webhook', to: '/docs/APIs-and-SDKs/Web-Console-API/webhook-get', type: 'server' },
  { from: '/docs/web-console-api/list-api-keys', to: '/docs/APIs-and-SDKs/Web-Console-API/api-keys-list', type: 'server' },
  { from: '/docs/web-console-api/list-applications', to: '/docs/APIs-and-SDKs/Web-Console-API/applications-list', type: 'server' },
  { from: '/docs/web-console-api/list-cors-allowed-origins', to: '/docs/APIs-and-SDKs/Web-Console-API/cors-allowed-origins-list', type: 'server' },
  { from: '/docs/web-console-api/list-environments', to: '/docs/APIs-and-SDKs/Web-Console-API/environments-list', type: 'server' },
  { from: '/docs/web-console-api/list-experiment-annotations', to: '/docs/APIs-and-SDKs/Web-Console-API/experiment-annotations-list', type: 'server' },
  { from: '/docs/web-console-api/list-experiment-tags', to: '/docs/APIs-and-SDKs/Web-Console-API/experiment-tags-list', type: 'server' },
  { from: '/docs/web-console-api/list-experiments', to: '/docs/APIs-and-SDKs/Web-Console-API/experiments-list', type: 'server' },
  { from: '/docs/web-console-api/list-goal-tags', to: '/docs/APIs-and-SDKs/Web-Console-API/goal-tags-list', type: 'server' },
  { from: '/docs/web-console-api/list-goals', to: '/docs/APIs-and-SDKs/Web-Console-API/goals-list', type: 'server' },
  { from: '/docs/web-console-api/list-metric-tags', to: '/docs/APIs-and-SDKs/Web-Console-API/metric-tags-list', type: 'server' },
  { from: '/docs/web-console-api/list-metrics', to: '/docs/APIs-and-SDKs/Web-Console-API/metrics-list', type: 'server' },
  { from: '/docs/web-console-api/list-permission-categories', to: '/docs/APIs-and-SDKs/Web-Console-API/permission-categories-list', type: 'server' },
  { from: '/docs/web-console-api/list-permissions', to: '/docs/APIs-and-SDKs/Web-Console-API/permissions-list', type: 'server' },
  { from: '/docs/web-console-api/list-roles', to: '/docs/APIs-and-SDKs/Web-Console-API/roles-list', type: 'server' },
  { from: '/docs/web-console-api/list-segments', to: '/docs/APIs-and-SDKs/Web-Console-API/segments-list', type: 'server' },
  { from: '/docs/web-console-api/list-teams', to: '/docs/APIs-and-SDKs/Web-Console-API/teams-list', type: 'server' },
  { from: '/docs/web-console-api/list-units', to: '/docs/APIs-and-SDKs/Web-Console-API/units-list', type: 'server' },
  { from: '/docs/web-console-api/list-users', to: '/docs/APIs-and-SDKs/Web-Console-API/users-list', type: 'server' },
  { from: '/docs/web-console-api/list-webhook-events', to: '/docs/APIs-and-SDKs/Web-Console-API/webhook-events-list', type: 'server' },
  { from: '/docs/web-console-api/list-webhooks', to: '/docs/APIs-and-SDKs/Web-Console-API/webhooks-list', type: 'server' },

  // SDK API - lowercase (7)
  { from: '/docs/sdk-api/absmartly-collector-api', to: '/docs/APIs-and-SDKs/SDK-API/absmartly-collector-api', type: 'server' },
  { from: '/docs/sdk-api/collector-health-check', to: '/docs/APIs-and-SDKs/SDK-API/collector-health-check', type: 'server' },
  { from: '/docs/sdk-api/context-create', to: '/docs/APIs-and-SDKs/SDK-API/context-create', type: 'server' },
  { from: '/docs/sdk-api/context-get', to: '/docs/APIs-and-SDKs/SDK-API/context-get', type: 'server' },
  { from: '/docs/sdk-api/context-publish', to: '/docs/APIs-and-SDKs/SDK-API/context-publish', type: 'server' },
  { from: '/docs/sdk-api/context-publish-batch', to: '/docs/APIs-and-SDKs/SDK-API/context-publish-batch', type: 'server' },
  { from: '/docs/sdk-api/experiment-get', to: '/docs/APIs-and-SDKs/SDK-API/experiment-get', type: 'server' },

  // SDK API - PascalCase (7)
  { from: '/docs/SDK-API/absmartly-collector-api', to: '/docs/APIs-and-SDKs/SDK-API/absmartly-collector-api', type: 'server' },
  { from: '/docs/SDK-API/collector-health-check', to: '/docs/APIs-and-SDKs/SDK-API/collector-health-check', type: 'server' },
  { from: '/docs/SDK-API/context-create', to: '/docs/APIs-and-SDKs/SDK-API/context-create', type: 'server' },
  { from: '/docs/SDK-API/context-get', to: '/docs/APIs-and-SDKs/SDK-API/context-get', type: 'server' },
  { from: '/docs/SDK-API/context-publish', to: '/docs/APIs-and-SDKs/SDK-API/context-publish', type: 'server' },
  { from: '/docs/SDK-API/context-publish-batch', to: '/docs/APIs-and-SDKs/SDK-API/context-publish-batch', type: 'server' },
  { from: '/docs/SDK-API/experiment-get', to: '/docs/APIs-and-SDKs/SDK-API/experiment-get', type: 'server' },

  // Web Console - Configuration (1)
  { from: '/docs/web-console-docs/settings', to: '/docs/web-console-docs/Configuration/settings', type: 'server' },

  // Web Console - Users, Teams & Permissions (3)
  { from: '/docs/web-console-docs/creating-and-managing-teams', to: '/docs/web-console-docs/Users-teams-Permissions/Teams', type: 'server' },
  { from: '/docs/web-console-docs/managing-teams', to: '/docs/web-console-docs/Users-teams-Permissions/Teams', type: 'server' },
  { from: '/docs/web-console-docs/ownership-and-permissions', to: '/docs/web-console-docs/Users-teams-Permissions/ownership-and-permissions', type: 'server' },

  // Web Console - Experiments (8)
  { from: '/docs/web-console-docs/Aborting-experiments', to: '/docs/web-console-docs/experiments/Aborting-experiments', type: 'server' },
  { from: '/docs/web-console-docs/Experiment-health-checks', to: '/docs/web-console-docs/experiments/Experiment-health-checks', type: 'server' },
  { from: '/docs/web-console-docs/Experiment-reports', to: '/docs/web-console-docs/experiments/Experiment-reports', type: 'server' },
  { from: '/docs/web-console-docs/Interpreting-metrics-in-experiment-results', to: '/docs/web-console-docs/experiments/Interpreting-metrics-in-experiment-results', type: 'server' },
  { from: '/docs/web-console-docs/creating-an-experiment', to: '/docs/web-console-docs/experiments/creating-an-experiment', type: 'server' },
  { from: '/docs/web-console-docs/setting-up-a-fixed-horizon-experiment', to: '/docs/web-console-docs/experiments/setting-up-a-fixed-horizon-experiment', type: 'server' },
  { from: '/docs/web-console-docs/setting-up-a-gst-experiment', to: '/docs/web-console-docs/experiments/setting-up-a-gst-experiment', type: 'server' },
  { from: '/docs/web-console-docs/templates', to: '/docs/web-console-docs/experiments/templates', type: 'server' },

  // Old pages that no longer exist (3)
  { from: '/docs/web-console-docs/dashboard', to: '/docs/web-console-docs/overview', type: 'server' },
  { from: '/docs/web-console-docs/tutorial', to: '/docs/web-console-docs/overview', type: 'server' },
  { from: '/docs/web-console-docs/product-docs', to: '/docs/web-console-docs/overview', type: 'server' },

  // Types of analysis (1)
  { from: '/docs/web-console-docs/types-of-analysis', to: '/docs/web-console-docs/experiments/overview', type: 'server' },

  // Web Console - Feature Flags (1)
  { from: '/docs/web-console-docs/creating-a-feature', to: '/docs/web-console-docs/feature-flags/creating-a-feature', type: 'server' },

  // Understanding experimentation metrics variations (4)
  { from: '/docs/web-console-docs/understanding-experimentation-metrics/test', to: '/docs/web-console-docs/goals-and-metrics/metrics/overview', type: 'server-wildcard' },
  { from: '/docs/web-console-docs/understanding-experimentation-metrics', to: '/docs/web-console-docs/goals-and-metrics/metrics/overview', type: 'server' },
  { from: '/docs/web-console-docs/Understanding-experimentation-metrics', to: '/docs/web-console-docs/goals-and-metrics/metrics/overview', type: 'server' },
  { from: '/docs/web-console-docs/goals-and-metrics/Understanding-experimentation-metrics', to: '/docs/web-console-docs/goals-and-metrics/metrics/overview', type: 'server' },

  // Type of analysis with anchor (1)
  { from: '/docs/web-console-docs/type-of-analysis', to: '/docs/web-console-docs/experiments/overview#analysis-methods', type: 'server-with-anchor' },

  // APIs-and-SDKs overview rename (1)
  { from: '/docs/APIs-and-SDKs/apis-and-sdks', to: '/docs/APIs-and-SDKs/overview', type: 'server' },
];

// CLIENT-SIDE ANCHOR REDIRECTS (from anchorRedirects.ts) - transforms and cross-page
const ANCHOR_REDIRECTS = [
  // Creating an Experiment - same-page anchor transforms
  { from: '/docs/web-console-docs/creating-an-experiment#application', to: '/docs/web-console-docs/experiments/creating-an-experiment#applications', type: 'js-transform' },
  { from: '/docs/web-console-docs/creating-an-experiment#targeting-audiences', to: '/docs/web-console-docs/experiments/creating-an-experiment#audiences', type: 'js-transform' },

  // Creating an Experiment - cross-page redirects
  { from: '/docs/web-console-docs/creating-an-experiment#error-control', to: '/docs/web-console-docs/experiments/setting-up-a-gst-experiment#error-control', type: 'js-cross-page' },
  { from: '/docs/web-console-docs/creating-an-experiment#sample-size-calculation', to: '/docs/web-console-docs/experiments/setting-up-a-gst-experiment#what-is-the-experiment-duration-based-on', type: 'js-cross-page' },
  { from: '/docs/web-console-docs/creating-an-experiment#type-of-analysis', to: '/docs/web-console-docs/experiments/overview#analysis-methods', type: 'js-cross-page' },

  // Creating a Feature - same-page anchor transforms
  { from: '/docs/web-console-docs/creating-a-feature#feature-name', to: '/docs/web-console-docs/feature-flags/creating-a-feature#basics', type: 'js-transform' },
  { from: '/docs/web-console-docs/creating-a-feature#tracking-unit', to: '/docs/web-console-docs/feature-flags/creating-a-feature#audiences', type: 'js-transform' },
  { from: '/docs/web-console-docs/creating-a-feature#application', to: '/docs/web-console-docs/feature-flags/creating-a-feature#audiences', type: 'js-transform' },
  { from: '/docs/web-console-docs/creating-a-feature#targeting-audiences', to: '/docs/web-console-docs/feature-flags/creating-a-feature#audiences', type: 'js-transform' },

  // Templates - anchor rename
  { from: '/docs/web-console-docs/templates#introduction', to: '/docs/web-console-docs/experiments/templates#overview', type: 'js-transform' },

  // Managing teams - anchor renames
  { from: '/docs/web-console-docs/managing-teams#creating-a-team', to: '/docs/web-console-docs/Users-teams-Permissions/Teams#create-a-team', type: 'js-transform' },
  { from: '/docs/web-console-docs/managing-teams#viewing-the-company-hierarchy', to: '/docs/web-console-docs/Users-teams-Permissions/Teams#viewing-the-team-hierarchy', type: 'js-transform' },
  { from: '/docs/web-console-docs/creating-and-managing-teams#creating-a-team', to: '/docs/web-console-docs/Users-teams-Permissions/Teams#create-a-team', type: 'js-transform' },
  { from: '/docs/web-console-docs/creating-and-managing-teams#viewing-the-company-hierarchy', to: '/docs/web-console-docs/Users-teams-Permissions/Teams#viewing-the-team-hierarchy', type: 'js-transform' },

  // Settings - sections moved to separate pages
  { from: '/docs/web-console-docs/settings#applications', to: '/docs/web-console-docs/Configuration/Applications', type: 'js-cross-page' },
  { from: '/docs/web-console-docs/settings#units', to: '/docs/web-console-docs/Configuration/Units', type: 'js-cross-page' },
  { from: '/docs/web-console-docs/settings#goals', to: '/docs/web-console-docs/goals-and-metrics/goals/overview', type: 'js-cross-page' },
  { from: '/docs/web-console-docs/settings#metrics', to: '/docs/web-console-docs/goals-and-metrics/metrics/overview', type: 'js-cross-page' },
  { from: '/docs/web-console-docs/settings#teams', to: '/docs/web-console-docs/Users-teams-Permissions/Teams', type: 'js-cross-page' },

  // Types-of-analysis - anchor renames
  { from: '/docs/web-console-docs/types-of-analysis#fixed-horizon-testing', to: '/docs/web-console-docs/experiments/overview#fixed-horizon', type: 'js-transform' },
  { from: '/docs/web-console-docs/types-of-analysis#group-sequential-testing', to: '/docs/web-console-docs/experiments/overview#group-sequential', type: 'js-transform' },
  { from: '/docs/web-console-docs/types-of-analysis#which-analysis-type-should-i-choose-for-my-experiment', to: '/docs/web-console-docs/experiments/overview#how-to-choose', type: 'js-transform' },

  // Understanding-experimentation-metrics - sections consolidated
  { from: '/docs/web-console-docs/understanding-experimentation-metrics#primary-metric', to: '/docs/web-console-docs/goals-and-metrics/metrics/overview#role', type: 'js-transform' },
  { from: '/docs/web-console-docs/understanding-experimentation-metrics#secondary-metrics', to: '/docs/web-console-docs/goals-and-metrics/metrics/overview#role', type: 'js-transform' },
  { from: '/docs/web-console-docs/understanding-experimentation-metrics#guardrail-metrics', to: '/docs/web-console-docs/goals-and-metrics/metrics/overview#role', type: 'js-transform' },
  { from: '/docs/web-console-docs/understanding-experimentation-metrics#exploratory-metrics', to: '/docs/web-console-docs/goals-and-metrics/metrics/overview#role', type: 'js-transform' },
  { from: '/docs/web-console-docs/understanding-experimentation-metrics#business', to: '/docs/web-console-docs/goals-and-metrics/metrics/overview#purpose', type: 'js-transform' },
  { from: '/docs/web-console-docs/understanding-experimentation-metrics#behavioural', to: '/docs/web-console-docs/goals-and-metrics/metrics/overview#purpose', type: 'js-transform' },
  { from: '/docs/web-console-docs/understanding-experimentation-metrics#operational', to: '/docs/web-console-docs/goals-and-metrics/metrics/overview#purpose', type: 'js-transform' },
  { from: '/docs/web-console-docs/understanding-experimentation-metrics#binomial', to: '/docs/web-console-docs/goals-and-metrics/metrics/overview#data-structure', type: 'js-transform' },
  { from: '/docs/web-console-docs/understanding-experimentation-metrics#continuous', to: '/docs/web-console-docs/goals-and-metrics/metrics/overview#data-structure', type: 'js-transform' },
  { from: '/docs/web-console-docs/understanding-experimentation-metrics#short-term', to: '/docs/web-console-docs/goals-and-metrics/metrics/overview#time-horizon', type: 'js-transform' },
  { from: '/docs/web-console-docs/understanding-experimentation-metrics#long-term', to: '/docs/web-console-docs/goals-and-metrics/metrics/overview#time-horizon', type: 'js-transform' },
  { from: '/docs/web-console-docs/understanding-experimentation-metrics#proxy', to: '/docs/web-console-docs/goals-and-metrics/metrics/overview#functionality', type: 'js-transform' },
  { from: '/docs/web-console-docs/understanding-experimentation-metrics#composite', to: '/docs/web-console-docs/goals-and-metrics/metrics/overview#functionality', type: 'js-transform' },
];

// BROWSER ANCHOR PRESERVATION TESTS - verify unchanged anchors are preserved
const ANCHOR_PRESERVATION_TESTS = [
  { from: '/docs/web-console-docs/creating-an-experiment#metadata', to: '/docs/web-console-docs/experiments/creating-an-experiment#metadata', type: 'browser-preserved' },
  { from: '/docs/web-console-docs/creating-an-experiment#experiment-name', to: '/docs/web-console-docs/experiments/creating-an-experiment#experiment-name', type: 'browser-preserved' },
  { from: '/docs/web-console-docs/creating-an-experiment#variants', to: '/docs/web-console-docs/experiments/creating-an-experiment#variants', type: 'browser-preserved' },
  { from: '/docs/web-console-docs/creating-an-experiment#metrics', to: '/docs/web-console-docs/experiments/creating-an-experiment#metrics', type: 'browser-preserved' },
  { from: '/docs/web-console-docs/creating-a-feature#variants', to: '/docs/web-console-docs/feature-flags/creating-a-feature#variants', type: 'browser-preserved' },
  { from: '/docs/web-console-docs/creating-a-feature#metrics', to: '/docs/web-console-docs/feature-flags/creating-a-feature#metrics', type: 'browser-preserved' },
  { from: '/docs/web-console-docs/settings#custom-fields', to: '/docs/web-console-docs/Configuration/settings#custom-fields', type: 'browser-preserved' },
  { from: '/docs/web-console-docs/Experiment-reports#experiment-velocity-report', to: '/docs/web-console-docs/experiments/Experiment-reports#experiment-velocity-report', type: 'browser-preserved' },
  { from: '/docs/web-console-docs/Aborting-experiments#when-to-abort', to: '/docs/web-console-docs/experiments/Aborting-experiments#when-to-abort', type: 'browser-preserved' },
  { from: '/docs/web-console-docs/templates#what-are-templates', to: '/docs/web-console-docs/experiments/templates#what-are-templates', type: 'browser-preserved' },
];

// NEW PATH ANCHOR TRANSFORMS - verify JS works on new paths
const NEW_PATH_ANCHOR_TESTS = [
  // Creating an Experiment - new path anchor transforms
  { from: '/docs/web-console-docs/experiments/creating-an-experiment#application', to: '/docs/web-console-docs/experiments/creating-an-experiment#applications', type: 'js-new-path' },
  { from: '/docs/web-console-docs/experiments/creating-an-experiment#targeting-audiences', to: '/docs/web-console-docs/experiments/creating-an-experiment#audiences', type: 'js-new-path' },
  { from: '/docs/web-console-docs/experiments/creating-an-experiment#error-control', to: '/docs/web-console-docs/experiments/setting-up-a-gst-experiment#error-control', type: 'js-new-path' },

  // Creating a Feature - new path anchor transforms
  { from: '/docs/web-console-docs/feature-flags/creating-a-feature#feature-name', to: '/docs/web-console-docs/feature-flags/creating-a-feature#basics', type: 'js-new-path' },
  { from: '/docs/web-console-docs/feature-flags/creating-a-feature#tracking-unit', to: '/docs/web-console-docs/feature-flags/creating-a-feature#audiences', type: 'js-new-path' },
  { from: '/docs/web-console-docs/feature-flags/creating-a-feature#application', to: '/docs/web-console-docs/feature-flags/creating-a-feature#audiences', type: 'js-new-path' },
  { from: '/docs/web-console-docs/feature-flags/creating-a-feature#targeting-audiences', to: '/docs/web-console-docs/feature-flags/creating-a-feature#audiences', type: 'js-new-path' },

  // Templates - new path anchor transform
  { from: '/docs/web-console-docs/experiments/templates#introduction', to: '/docs/web-console-docs/experiments/templates#overview', type: 'js-new-path' },

  // Teams - new path anchor transforms
  { from: '/docs/web-console-docs/Users-teams-Permissions/Teams#creating-a-team', to: '/docs/web-console-docs/Users-teams-Permissions/Teams#create-a-team', type: 'js-new-path' },
  { from: '/docs/web-console-docs/Users-teams-Permissions/Teams#viewing-the-company-hierarchy', to: '/docs/web-console-docs/Users-teams-Permissions/Teams#viewing-the-team-hierarchy', type: 'js-new-path' },

  // Settings - new path cross-page anchors
  { from: '/docs/web-console-docs/Configuration/settings#applications', to: '/docs/web-console-docs/Configuration/Applications', type: 'js-new-path' },
  { from: '/docs/web-console-docs/Configuration/settings#units', to: '/docs/web-console-docs/Configuration/Units', type: 'js-new-path' },
  { from: '/docs/web-console-docs/Configuration/settings#goals', to: '/docs/web-console-docs/goals-and-metrics/goals/overview', type: 'js-new-path' },
  { from: '/docs/web-console-docs/Configuration/settings#metrics', to: '/docs/web-console-docs/goals-and-metrics/metrics/overview', type: 'js-new-path' },
  { from: '/docs/web-console-docs/Configuration/settings#teams', to: '/docs/web-console-docs/Users-teams-Permissions/Teams', type: 'js-new-path' },

  // Experiments overview - new path anchor transforms
  { from: '/docs/web-console-docs/experiments/overview#fixed-horizon-testing', to: '/docs/web-console-docs/experiments/overview#fixed-horizon', type: 'js-new-path' },
  { from: '/docs/web-console-docs/experiments/overview#group-sequential-testing', to: '/docs/web-console-docs/experiments/overview#group-sequential', type: 'js-new-path' },
  { from: '/docs/web-console-docs/experiments/overview#which-analysis-type-should-i-choose-for-my-experiment', to: '/docs/web-console-docs/experiments/overview#how-to-choose', type: 'js-new-path' },

  // Metrics overview - new path anchor transforms
  { from: '/docs/web-console-docs/goals-and-metrics/metrics/overview#primary-metric', to: '/docs/web-console-docs/goals-and-metrics/metrics/overview#role', type: 'js-new-path' },
  { from: '/docs/web-console-docs/goals-and-metrics/metrics/overview#binomial', to: '/docs/web-console-docs/goals-and-metrics/metrics/overview#data-structure', type: 'js-new-path' },
];

// Combine all redirect tests
const ALL_REDIRECT_TESTS = [
  ...SERVER_REDIRECTS,
  ...ANCHOR_REDIRECTS,
  ...ANCHOR_PRESERVATION_TESTS,
  ...NEW_PATH_ANCHOR_TESTS
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
    // Navigate and follow all redirects
    const response = await page.goto(fullFromUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    // Wait for client-side redirects
    await page.waitForTimeout(1000);

    const finalUrl = page.url();
    const finalPath = finalUrl.replace(BASE_URL, '');

    // Normalize for comparison (case-insensitive)
    const normalizedFinal = normalizeUrl(finalPath);
    const normalizedExpected = normalizeUrl(expectedToPath);

    // Case-insensitive comparison (Netlify may lowercase URLs)
    const match = normalizedFinal === normalizedExpected;

    return {
      success: true,
      match,
      fromPath,
      expectedPath: expectedToPath,
      finalPath,
      statusCode: response.status()
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
  if (onlyFailed) {
    console.log('Mode: Testing ONLY previously failed pages (--only-failed)');
  }
  console.log('');

  // Find all MDX files and convert to URLs
  let pageUrls;

  if (onlyFailed) {
    console.log('📁 Using previously failed pages list...');
    pageUrls = PREVIOUSLY_FAILED_PAGES;
    console.log(`Testing ${pageUrls.length} previously failed pages`);
  } else {
    console.log('📁 Scanning for documentation files...');
    const mdxFiles = findAllMdxFiles(DOCS_DIR);
    pageUrls = mdxFiles.map(filePathToUrl);
    console.log(`Found ${mdxFiles.length} documentation pages`);
  }

  console.log(`Found ${ALL_REDIRECT_TESTS.length} redirect tests`);
  console.log(`  - ${SERVER_REDIRECTS.length} server-side redirects`);
  console.log(`  - ${ANCHOR_REDIRECTS.length} JS anchor transforms`);
  console.log(`  - ${ANCHOR_PRESERVATION_TESTS.length} anchor preservation tests`);
  console.log(`  - ${NEW_PATH_ANCHOR_TESTS.length} new-path anchor tests`);
  console.log(`Total URLs to test: ${pageUrls.length + ALL_REDIRECT_TESTS.length}`);
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

  for (let i = 0; i < pageUrls.length; i++) {
    const urlPath = pageUrls[i];
    const result = await checkPageLoads(page, urlPath);

    if (result.success) {
      pagesOk++;
      process.stdout.write('✅');
    } else {
      pagesFailed++;
      failedPages.push(result);
      process.stdout.write('❌');
      // Show failed page immediately
      console.log(` ${urlPath} (${result.error})`);
    }

    // New line every 50 tests for readability
    if ((pagesOk + pagesFailed) % 50 === 0) {
      process.stdout.write(` [${pagesOk + pagesFailed}/${pageUrls.length}]\n`);
    }

    // Throttle to avoid rate limiting
    await sleep(THROTTLE_MS);
  }

  console.log(`\n[${pagesOk + pagesFailed}/${pageUrls.length}]\n`);
  console.log(`Pages tested: ${pageUrls.length}`);
  console.log(`✅ Passed: ${pagesOk}`);
  if (pagesFailed > 0) {
    console.log(`❌ Failed: ${pagesFailed}`);
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

  for (const redirectTest of ALL_REDIRECT_TESTS) {
    const result = await checkRedirect(page, redirectTest.from, redirectTest.to);
    result.type = redirectTest.type;

    if (!redirectsByType[redirectTest.type]) {
      redirectsByType[redirectTest.type] = { passed: 0, failed: 0, tests: [] };
    }

    if (result.match) {
      redirectsOk++;
      redirectsByType[redirectTest.type].passed++;
      console.log(`✅ ${redirectTest.from} → ${redirectTest.to}`);
    } else {
      redirectsFailed++;
      redirectsByType[redirectTest.type].failed++;
      failedRedirects.push(result);
      console.log(`❌ ${redirectTest.from} → ${redirectTest.to}`);
      console.log(`   Expected: ${redirectTest.to}, Got: ${result.finalPath || 'error'}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    }

    redirectsByType[redirectTest.type].tests.push(result);

    // Throttle to avoid rate limiting
    await sleep(THROTTLE_MS);
  }

  console.log(`\n[${redirectsOk + redirectsFailed}/${ALL_REDIRECT_TESTS.length}]\n`);
  console.log(`Redirects tested: ${ALL_REDIRECT_TESTS.length}`);
  console.log(`✅ Passed: ${redirectsOk}`);
  if (redirectsFailed > 0) {
    console.log(`❌ Failed: ${redirectsFailed}`);
    console.log('');
    console.log('❌ Failed redirects:');
    failedRedirects.forEach(r => {
      console.log(`  - ${r.fromPath}`);
      console.log(`    Expected: ${r.expectedPath}`);
      console.log(`    Got: ${r.finalPath || 'error'}`);
      if (r.error) {
        console.log(`    Error: ${r.error}`);
      }
    });
  }

  console.log('');
  console.log('By type:');
  for (const [type, stats] of Object.entries(redirectsByType)) {
    if (stats.passed + stats.failed === 0) continue;
    const total = stats.passed + stats.failed;
    const status = stats.failed === 0 ? '✅' : '❌';
    const failedText = stats.failed > 0 ? `, ${stats.failed} failed` : '';
    console.log(`  ${status} ${type}: ${stats.passed}/${total} passed${failedText}`);
  }

  await browser.close();

  console.log('');
  console.log('━'.repeat(80));
  console.log('');
  console.log('📊 FINAL SUMMARY');
  console.log('━'.repeat(80));
  console.log('');
  console.log(`Total documentation pages: ${pageUrls.length}`);
  console.log(`  ✅ Working: ${pagesOk}`);
  if (pagesFailed > 0) {
    console.log(`  ❌ Broken: ${pagesFailed}`);
  }
  console.log('');
  console.log(`Total redirects: ${ALL_REDIRECT_TESTS.length}`);
  console.log(`  ✅ Working: ${redirectsOk}`);
  if (redirectsFailed > 0) {
    console.log(`  ❌ Broken: ${redirectsFailed}`);
  }
  console.log('');
  console.log(`GRAND TOTAL: ${pageUrls.length + ALL_REDIRECT_TESTS.length} URLs tested`);
  console.log(`  ✅ Passed: ${pagesOk + redirectsOk}`);
  if (pagesFailed + redirectsFailed > 0) {
    console.log(`  ❌ Failed: ${pagesFailed + redirectsFailed}`);
  }
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
