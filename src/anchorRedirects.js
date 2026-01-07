// Client-side anchor redirects for URL structure changes
// This handles cases where anchor names changed or moved to different pages

const ANCHOR_REDIRECTS = {
  '/docs/web-console-docs/experiments/creating-an-experiment': {
    'application': 'applications',
    'targeting-audiences': 'audiences',
    'error-control': '/docs/web-console-docs/experiments/setting-up-a-gst-experiment#error-control',
    'sample-size-calculation': '/docs/web-console-docs/experiments/setting-up-a-gst-experiment#what-is-the-experiment-duration-based-on',
    'type-of-analysis': '/docs/web-console-docs/experiments/overview#analysis-methods',
  },
  '/docs/web-console-docs/feature-flags/creating-a-feature': {
    'feature-name': 'basics',
    'tracking-unit': 'audiences',
  },
};

function handleAnchorRedirect() {
  const path = window.location.pathname;
  const hash = window.location.hash.slice(1);

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
  handleAnchorRedirect();
}
