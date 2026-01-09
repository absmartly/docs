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
    'application': 'audiences',
    'targeting-audiences': 'audiences',
  },
};

function handleAnchorRedirect() {
  const path = window.location.pathname.replace(/\/$/, ''); // Remove trailing slash
  const hash = window.location.hash.slice(1);

  console.log('[AnchorRedirect] Checking:', { path, hash, hasRedirects: !!ANCHOR_REDIRECTS[path] });

  if (!hash) return;

  const redirects = ANCHOR_REDIRECTS[path];
  if (!redirects) return;

  const newDestination = redirects[hash];
  console.log('[AnchorRedirect] Found mapping:', { hash, newDestination });
  if (!newDestination) return;

  if (newDestination.startsWith('/')) {
    console.log('[AnchorRedirect] Redirecting to different page:', newDestination);
    window.location.replace(newDestination);
  } else {
    const newUrl = `${path}#${newDestination}`;
    console.log('[AnchorRedirect] Redirecting anchor:', newUrl);
    window.location.replace(newUrl);
  }
}

if (typeof window !== 'undefined') {
  // Run on initial load
  handleAnchorRedirect();

  // Also run after client-side navigation (for SPAs like Docusaurus)
  if (window.addEventListener) {
    window.addEventListener('load', handleAnchorRedirect);
    window.addEventListener('hashchange', handleAnchorRedirect);
  }
}
