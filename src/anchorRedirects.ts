// Client-side anchor redirects for URL structure changes
// This handles ONLY cases where anchor names changed or moved to different pages
// Note: Browsers automatically preserve unchanged anchors during 302 redirects per HTTP spec

interface AnchorRedirects {
  [path: string]: {
    [anchor: string]: string;
  };
}

const ANCHOR_REDIRECTS: AnchorRedirects = {
  // NEW paths (after server redirect) - ONLY anchors that transform or move
  '/docs/web-console-docs/experiments/creating-an-experiment': {
    // Same-page anchor renames
    'application': 'applications',
    'targeting-audiences': 'audiences',
    // Cross-page redirects (content moved to different pages)
    'error-control': '/docs/web-console-docs/experiments/setting-up-a-gst-experiment#error-control',
    'sample-size-calculation': '/docs/web-console-docs/experiments/setting-up-a-gst-experiment#what-is-the-experiment-duration-based-on',
    'type-of-analysis': '/docs/web-console-docs/experiments/overview#analysis-methods',
  },
  '/docs/web-console-docs/feature-flags/creating-a-feature': {
    'feature-name': 'basics',
    'tracking-unit': 'audiences',
    'application': 'audiences',
    'targeting-audiences': 'audiences',
  },
  // OLD paths (for local testing and fallback) - redirect to new structure
  // Only include anchors that TRANSFORM - browser preserves unchanged anchors automatically
  '/docs/web-console-docs/creating-an-experiment': {
    'application': '/docs/web-console-docs/experiments/creating-an-experiment#applications',
    'targeting-audiences': '/docs/web-console-docs/experiments/creating-an-experiment#audiences',
    'error-control': '/docs/web-console-docs/experiments/setting-up-a-gst-experiment#error-control',
    'sample-size-calculation': '/docs/web-console-docs/experiments/setting-up-a-gst-experiment#what-is-the-experiment-duration-based-on',
    'type-of-analysis': '/docs/web-console-docs/experiments/overview#analysis-methods',
  },
  '/docs/web-console-docs/creating-a-feature': {
    'feature-name': '/docs/web-console-docs/feature-flags/creating-a-feature#basics',
    'tracking-unit': '/docs/web-console-docs/feature-flags/creating-a-feature#audiences',
    'application': '/docs/web-console-docs/feature-flags/creating-a-feature#audiences',
    'targeting-audiences': '/docs/web-console-docs/feature-flags/creating-a-feature#audiences',
  },
};

function handleAnchorRedirect(): void {
  const path = window.location.pathname.replace(/\/$/, ''); // Remove trailing slash
  const hash = window.location.hash.slice(1);

  // Early return if no anchor present - no need to check redirects
  if (!hash) return;

  const redirects = ANCHOR_REDIRECTS[path];
  if (!redirects) return;

  const newDestination = redirects[hash];
  if (!newDestination) return;

  if (newDestination.startsWith('/')) {
    window.location.replace(newDestination);
  } else {
    window.location.replace(`${path}#${newDestination}`);
  }
}

if (typeof window !== 'undefined') {
  // Run on initial load
  handleAnchorRedirect();

  // Also run after client-side navigation
  if (window.addEventListener) {
    window.addEventListener('load', handleAnchorRedirect);
    window.addEventListener('hashchange', handleAnchorRedirect);
  }
}
