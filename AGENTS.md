# AGENTS.md

## Project

ABsmartly product documentation site, built with Docusaurus 3 and `docusaurus-plugin-openapi-docs`.

## Setup

```bash
yarn install
```

## Common commands

| Task | Command |
|------|---------|
| Local dev server | `yarn start` |
| Production build | `yarn build` |
| Regenerate API docs from OpenAPI specs | `yarn gen:api` |
| Clean generated API docs | `yarn clean:api` |
| Typecheck | `yarn typecheck` |

## API reference docs

Two OpenAPI specs are consumed by `docusaurus-plugin-openapi-docs` (see `docusaurus.config.js`):

- **Collector API** (`collector` config) — sourced from the local `api-spec.yaml` (ABsmartly Collector API). Output: `docs/APIs-and-SDKs/SDK-API/`.
- **Web Console API** (`nodeapi` config) — sourced from the `@absmartly/api-mocks` npm package at `node_modules/@absmartly/api-mocks/openapi/openapi.bundle.yaml`. Output: `docs/APIs-and-SDKs/Web-Console-API/`.

Generated API docs are gitignored (everything under the output dirs except `_category_.json` and the hand-authored `examples/` pages). Always run `yarn gen:api` after changing a spec or upgrading `@absmartly/api-mocks`, then `yarn build` to verify.

### Developing against the local `absmartly-api-mocks` repo

To pick up spec changes from the sibling `../absmartly-api-mocks` repo:

```bash
cd ../absmartly-api-mocks && npm link && cd -
npm link @absmartly/api-mocks
yarn gen:api
```

To return to the pinned published package, unlink without saving (so the dependency stays in
`package.json`) and reinstall:

```bash
npm unlink @absmartly/api-mocks --no-save
yarn install
yarn gen:api
```

## Markdown for AI agents

- `@signalwire/docusaurus-plugin-llms-txt` converts every built page to Markdown at `<route>.md`
  (e.g. `/docs/glossary/` -> `/docs/glossary.md`) and writes `/llms.txt` and `/llms-full.txt`.
- `plugins/llms-markdown/rehype-docusaurus-cleanup.js` rewrites tabs, code blocks, admonitions and
  `<details>` into plain HTML first so they survive the conversion.
- `netlify/edge-functions/markdown-negotiation.js` serves the `.md` at the normal page URL when the
  request's `Accept` header prefers `text/markdown`, and adds `Vary: Accept` plus a
  `Link: <...md>; rel="alternate"` header to HTML responses. Explicit `.md` URLs are served as
  static files; the function also normalises `/foo/index.md` and `/foo/.md` to `/foo.md`, sends
  `.md` URLs of redirected pages to the Markdown of the redirect target, and sends `/index.md` to
  `/llms.txt`. Tests: `yarn build && deno test --no-check --allow-read netlify/edge-functions-tests/`.
- Discovery: every docs page has `<link rel="alternate" type="text/markdown" href="<route>.md">` in
  its `<head>` (`src/theme/DocItem/Metadata/index.js`, a swizzle wrapper), and the `/llms.txt`
  header explains the `.md` suffix and `Accept: text/markdown` options.
- API reference pages render schemas client-side, so their Markdown has only the endpoint and
  description; the raw specs are published at `/openapi/*.yaml` and linked from `/llms.txt`.

## Notes

- The Web Console API spec uses placeholder metadata (`sandbox.example.com/v1`, `api@example.com`) from the api-mocks package; this is intentional.
- `yarn build` may emit a pre-existing broken-anchor warning on `SDK-Documentation/getting-started` (`#using-a-custom-event-logger`) — unrelated to the API docs work.
