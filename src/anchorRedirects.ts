// Client-side anchor redirects for URL structure changes
// This handles ONLY cases where anchor names changed or moved to different pages
// Note: Browsers automatically preserve unchanged anchors during 302 redirects per HTTP spec

interface AnchorRedirects {
  [path: string]: {
    [anchor: string]: string;
  };
}

// All paths are stored in lowercase for case-insensitive matching
const ANCHOR_REDIRECTS: AnchorRedirects = {
  // =============================================================================
  // NEW paths (after server redirect) - ONLY anchors that transform or move
  // =============================================================================
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
  '/docs/web-console-docs/experiments/templates': {
    'introduction': 'overview',
  },
  '/docs/web-console-docs/users-teams-permissions/teams': {
    'creating-a-team': 'create-a-team',
    'viewing-the-company-hierarchy': 'viewing-the-team-hierarchy',
  },
  '/docs/web-console-docs/configuration/settings': {
    'applications': '/docs/web-console-docs/Configuration/Applications',
    'units': '/docs/web-console-docs/Configuration/Units',
    'goals': '/docs/web-console-docs/goals-and-metrics/goals/overview',
    'metrics': '/docs/web-console-docs/goals-and-metrics/metrics/overview',
    'teams': '/docs/web-console-docs/Users-teams-Permissions/Teams',
  },
  '/docs/web-console-docs/experiments/overview': {
    'fixed-horizon-testing': 'fixed-horizon',
    'group-sequential-testing': 'group-sequential',
    'which-analysis-type-should-i-choose-for-my-experiment': 'how-to-choose',
  },
  '/docs/web-console-docs/goals-and-metrics/metrics/overview': {
    'primary-metric': 'role',
    'secondary-metrics': 'role',
    'guardrail-metrics': 'role',
    'exploratory-metrics': 'role',
    'business': 'purpose',
    'behavioural': 'purpose',
    'operational': 'purpose',
    'binomial': 'data-structure',
    'continuous': 'data-structure',
    'short-term': 'time-horizon',
    'long-term': 'time-horizon',
    'proxy': 'functionality',
    'composite': 'functionality',
  },

  // =============================================================================
  // OLD paths (for local testing and fallback) - redirect to new structure
  // Only include anchors that TRANSFORM - browser preserves unchanged anchors automatically
  // =============================================================================
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
  '/docs/web-console-docs/templates': {
    'introduction': '/docs/web-console-docs/experiments/templates#overview',
  },
  '/docs/web-console-docs/managing-teams': {
    'creating-a-team': '/docs/web-console-docs/Users-teams-Permissions/Teams#create-a-team',
    'viewing-the-company-hierarchy': '/docs/web-console-docs/Users-teams-Permissions/Teams#viewing-the-team-hierarchy',
  },
  '/docs/web-console-docs/creating-and-managing-teams': {
    'creating-a-team': '/docs/web-console-docs/Users-teams-Permissions/Teams#create-a-team',
    'viewing-the-company-hierarchy': '/docs/web-console-docs/Users-teams-Permissions/Teams#viewing-the-team-hierarchy',
  },
  '/docs/web-console-docs/settings': {
    'applications': '/docs/web-console-docs/Configuration/Applications',
    'units': '/docs/web-console-docs/Configuration/Units',
    'goals': '/docs/web-console-docs/goals-and-metrics/goals/overview',
    'metrics': '/docs/web-console-docs/goals-and-metrics/metrics/overview',
    'teams': '/docs/web-console-docs/Users-teams-Permissions/Teams',
  },
  '/docs/web-console-docs/types-of-analysis': {
    'fixed-horizon-testing': '/docs/web-console-docs/experiments/overview#fixed-horizon',
    'group-sequential-testing': '/docs/web-console-docs/experiments/overview#group-sequential',
    'which-analysis-type-should-i-choose-for-my-experiment': '/docs/web-console-docs/experiments/overview#how-to-choose',
  },
  '/docs/web-console-docs/understanding-experimentation-metrics': {
    'primary-metric': '/docs/web-console-docs/goals-and-metrics/metrics/overview#role',
    'secondary-metrics': '/docs/web-console-docs/goals-and-metrics/metrics/overview#role',
    'guardrail-metrics': '/docs/web-console-docs/goals-and-metrics/metrics/overview#role',
    'exploratory-metrics': '/docs/web-console-docs/goals-and-metrics/metrics/overview#role',
    'business': '/docs/web-console-docs/goals-and-metrics/metrics/overview#purpose',
    'behavioural': '/docs/web-console-docs/goals-and-metrics/metrics/overview#purpose',
    'operational': '/docs/web-console-docs/goals-and-metrics/metrics/overview#purpose',
    'binomial': '/docs/web-console-docs/goals-and-metrics/metrics/overview#data-structure',
    'continuous': '/docs/web-console-docs/goals-and-metrics/metrics/overview#data-structure',
    'short-term': '/docs/web-console-docs/goals-and-metrics/metrics/overview#time-horizon',
    'long-term': '/docs/web-console-docs/goals-and-metrics/metrics/overview#time-horizon',
    'proxy': '/docs/web-console-docs/goals-and-metrics/metrics/overview#functionality',
    'composite': '/docs/web-console-docs/goals-and-metrics/metrics/overview#functionality',
  },
};

function handleAnchorRedirect(): void {
  // Normalize path to lowercase for case-insensitive matching
  const path = window.location.pathname.replace(/\/$/, '').toLowerCase();
  const hash = window.location.hash.slice(1);

  if (!hash) return;

  const redirects = ANCHOR_REDIRECTS[path];
  if (!redirects) return;

  const newDestination = redirects[hash];
  if (!newDestination) return;

  if (newDestination.startsWith('/')) {
    window.location.replace(newDestination);
  } else {
    window.location.replace(`${window.location.pathname}#${newDestination}`);
  }
}

if (typeof window !== 'undefined') {
  handleAnchorRedirect();

  if (window.addEventListener) {
    window.addEventListener('load', handleAnchorRedirect);
    window.addEventListener('hashchange', handleAnchorRedirect);
  }
}
