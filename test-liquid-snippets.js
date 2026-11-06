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
  'docs/APIs-and-SDKs/SDK-Documentation/getting-started/import-and-initialize/liquid/initialize.liquid'
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

async function runSnippet(template, vars) {
  const html = render(template, vars);
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  assert.strictEqual(scripts.length, 2, 'expected config and initialization <script> blocks');
  const { absmartly, calls } = fakeAbsmartly();
  const window = {};
  const sandbox = vm.createContext({ window, absmartly });
  for (const script of scripts) vm.runInContext(script, sandbox);
  await calls.context.ready();
  return { config: window.absmartlyConfig, window, calls };
}

const template = fs.readFileSync(SNIPPET, 'utf8');
const hostile = `O'Brien's "Shop" \\ \n';alert(1);//`;

const cases = [
  {
    name: 'with customer and hostile values',
    vars: { shop: { name: hostile }, request: { cookie: { session_id: hostile } }, customer: { id: 42 } },
    expected: { session_id: hostile, customer_id: 42 },
  },
  {
    name: 'without customer',
    vars: { shop: { name: hostile }, request: { cookie: { session_id: 'abc' } } },
    expected: { session_id: 'abc' },
  },
];

(async () => {
  let failed = 0;
  for (const { name, vars, expected } of cases) {
    try {
      const { config, window, calls } = await runSnippet(template, vars);
      assert.strictEqual(config.application, hostile);
      assert.deepStrictEqual({ ...config.units }, expected);
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
