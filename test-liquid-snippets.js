#!/usr/bin/env node

/**
 * Liquid Snippet Testing Script
 * Renders the Liquid initialize snippet with hostile values and checks that the
 * generated config is valid JavaScript and round-trips those values unchanged.
 *
 * Only the Liquid features used by the snippet are supported:
 * {% comment %}, {% if x %}...{% endif %} and {{ path | json }}.
 *
 * Usage: node test-liquid-snippets.js
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

function configFrom(template, vars) {
  const html = render(template, vars);
  const script = html.match(/<script>([\s\S]*?window\.absmartlyConfig[\s\S]*?)<\/script>/);
  assert.ok(script, 'absmartlyConfig <script> block not found');
  const sandbox = { window: {} };
  vm.runInNewContext(script[1], sandbox);
  return sandbox.window.absmartlyConfig;
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

let failed = 0;
for (const { name, vars, expected } of cases) {
  try {
    const config = configFrom(template, vars);
    assert.strictEqual(config.application, hostile);
    assert.deepStrictEqual({ ...config.units }, expected);
    console.log(`✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`✗ ${name}: ${err.message}`);
  }
}

process.exit(failed ? 1 : 0);
