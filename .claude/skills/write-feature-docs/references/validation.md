# Validation

How to confirm new/edited doc pages are correct before handing off. Validate via the **dev server**, not the production build (see the cytoscape note below).

All commands run from the repo root (`~/git_tree/docs`, or a worktree of it).

## Prerequisite: node_modules

A fresh worktree has no `node_modules` (worktrees don't share them). Either `yarn install`, or for a quick check symlink the main checkout's:

```bash
ln -s /Users/<you>/git_tree/docs/node_modules node_modules   # from inside the worktree
```

Remove the symlink before committing (it's not tracked, but keep the tree clean).

## Start the dev server

```bash
yarn start --port 3111 --no-open > /tmp/docs-dev.log 2>&1 &
# wait for readiness:
for i in $(seq 1 15); do
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3111/docs/web-console-docs/<area>/<page> | grep -q 200 && { echo READY; break; }
  sleep 5
done
```

## What to check

### 1. Pages compile (no MDX errors)
If an `.mdx` page has a syntax error, the dev server logs it and the page won't load. A clean start + HTTP 200 on your pages = compiled.

### 2. No broken internal links / anchors
Docusaurus logs broken links. Filter the dev log for real problems (excluding the known cytoscape/mermaid noise):

```bash
grep -iE "broken|anchor" /tmp/docs-dev.log | grep -iv "cytoscape\|mermaid"
```

To positively confirm an anchor exists (client-rendered, so use a JS-capable check rather than curl+grep):

```js
// via a standalone Playwright script (see the abs skill's app-bring-up.md for resolving playwright)
await page.goto('http://localhost:3111/docs/web-console-docs/<area>/<page>', { waitUntil: 'networkidle' });
const ok = await page.evaluate(() => !!document.getElementById('<expected-anchor-slug>'));
```

### 3. Images load
Confirm every `<Image>` resolves (no missing file / `naturalWidth === 0`):

```js
const broken = await page.evaluate(() =>
  Array.from(document.querySelectorAll('article img')).filter(i => i.complete && i.naturalWidth === 0).length);
console.log('broken images:', broken);   // expect 0
```

A broken image usually means a wrong `img=` path (check it's relative to `static/img/`) or the PNG wasn't written.

## The known cytoscape / mermaid build error — ignore it

`yarn build` (the production build) currently fails with:

```
Module not found: Error: Package path ./dist/cytoscape.umd.js is not exported from package .../node_modules/cytoscape
```

This is **pre-existing and unrelated** to feature pages — it comes from a mermaid diagram used elsewhere in the docs (e.g. the GCP-BigQuery integration page) and a `cytoscape` package-exports incompatibility in the shared `node_modules`. It is **not** caused by your changes and does **not** affect the warehouse-native / feature pages.

- **Don't try to fix it** as part of documenting a feature — it's out of scope and an environment/dependency issue.
- **Validate with the dev server**, which compiles and serves pages despite it. (CI's own "Yarn Build" check has passed for merged docs PRs, confirming it's a local-environment quirk.)
- The dev server shows the same error as a red overlay in dev mode — recognize it and move on; your pages still render underneath.

## Clean up

```bash
# stop the dev server
pkill -f "docusaurus start --port 3111"
# remove the node_modules symlink if you made one
rm -f node_modules
```

Then confirm `git status` shows only the intended files (pages, `static/img/<feature>/*.png`, any `_category_.json`) — no stray scratch files. Keep research reports and screenshot scratch under gitignored paths.
