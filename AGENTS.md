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

## Notes

- The Web Console API spec uses placeholder metadata (`sandbox.example.com/v1`, `api@example.com`) from the api-mocks package; this is intentional.
- `yarn build` may emit a pre-existing broken-anchor warning on `SDK-Documentation/getting-started` (`#using-a-custom-event-logger`) — unrelated to the API docs work.
