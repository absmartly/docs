#!/usr/bin/env node

/**
 * Only the Liquid features used by the snippet are supported:
 * {% comment %}, {% if x %}...{% endif %} and {{ path | json }}.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const SNIPPET = path.join(
  __dirname,
  'docs/APIs-and-SDKs/SDK-Documentation/_shared/initialize/liquid/initialize.liquid'
);

function lookup(vars, expr) {
  return expr.split('.').reduce((obj, key) => (obj == null ? undefined : obj[key]), vars);
}

function render(template, vars) {
  return template
    .replace(/{%\s*comment\s*%}[\s\S]*?{%\s*endcomment\s*%}/g, '')
    .replace(/{%\s*if\s+([\w.]+)\s*%}([\s\S]*?){%\s*endif\s*%}/g, (_, cond, body) =>
      lookup(vars, cond) ? body : ''
    )
    .replace(/{{\s*([\w.]+)\s*(\|\s*json\s*)?}}/g, (_, expr, json) => {
      const value = lookup(vars, expr);
      return json ? JSON.stringify(value) : String(value);
    });
}

// Mirrors the browser bundle's `absmartly` global: an SDK class whose
// createContext returns a Context that exposes a ready() promise.
function fakeAbsmartly() {
  const calls = { sdkOptions: null, contextParams: null, context: null };
  class SDK {
    constructor(options) {
      calls.sdkOptions = options;
    }
    createContext(params) {
      calls.contextParams = params;
      calls.context = { ready: () => Promise.resolve() };
      return calls.context;
    }
  }
  return { absmartly: { SDK }, calls };
}

function fakeLocalStorage(initial = {}) {
  const items = { ...initial };
  return {
    items,
    getItem: (key) => (key in items ? items[key] : null),
    setItem: (key, value) => {
      items[key] = String(value);
    },
  };
}

async function runSnippet(template, vars, storage) {
  const html = render(template, vars);
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  assert.strictEqual(scripts.length, 2, 'expected config and initialization <script> blocks');
  const { absmartly, calls } = fakeAbsmartly();
  const window = {};
  const crypto = { randomUUID: () => 'generated-id' };
  const sandbox = vm.createContext({ window, absmartly, localStorage: storage, crypto });
  for (const script of scripts) vm.runInContext(script, sandbox);
  await calls.context.ready();
  return { config: window.absmartlyConfig, window, calls };
}

const template = fs.readFileSync(SNIPPET, 'utf8');
// A Liquid value that would break out of a JS string if it were not JSON-encoded.
const hostile = `42'; alert(1); //"\\`;

const cases = [
  {
    name: 'new visitor with customer and hostile value',
    vars: { customer: { id: hostile } },
    stored: {},
    expected: { anonymous_id: 'generated-id', customer_id: hostile },
  },
  {
    name: 'returning visitor without customer',
    vars: {},
    stored: { absmartly_anonymous_id: 'stored-id' },
    expected: { anonymous_id: 'stored-id' },
  },
];

(async () => {
  let failed = 0;
  for (const { name, vars, stored, expected } of cases) {
    try {
      const storage = fakeLocalStorage(stored);
      const { config, window, calls } = await runSnippet(template, vars, storage);
      assert.deepStrictEqual({ ...config.units }, expected);
      assert.strictEqual(storage.items.absmartly_anonymous_id, expected.anonymous_id);
      assert.deepStrictEqual({ ...calls.sdkOptions }, {
        endpoint: config.endpoint,
        apiKey: config.apiKey,
        application: config.application,
        environment: config.environment,
      });
      assert.strictEqual(calls.contextParams.units, config.units);
      assert.strictEqual(window.absmartlyContext, calls.context);
      console.log(`✓ ${name}`);
    } catch (err) {
      failed++;
      console.error(`✗ ${name}: ${err.message}`);
    }
  }

  process.exit(failed ? 1 : 0);
})();
