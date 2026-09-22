[![Netlify Status](https://api.netlify.com/api/v1/badges/3171614f-c5ee-4e28-93a5-1b12dda9f055/deploy-status)](https://app.netlify.com/sites/absmartly-docs/deploys)

# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### API Docs

The Web Console API reference docs are generated from the bundled OpenAPI spec shipped by the
[`@absmartly/api-mocks`](https://www.npmjs.com/package/@absmartly/api-mocks) package. The
`docusaurus-plugin-openapi-docs` `nodeapi` config points at
`node_modules/@absmartly/api-mocks/openapi/openapi.bundle.yaml`. The package is pinned to a
specific version in `package.json` (currently `1.0.8`), so `yarn install` fetches that pinned
spec — to pick up a newer spec, bump the `@absmartly/api-mocks` version in `package.json` first.

To regenerate the API docs after upgrading the package or changing the spec:

```
$ yarn gen:api
```

#### Developing against the local `absmartly-api-mocks` repo

If you are iterating on the API spec in the sibling `absmartly-api-mocks` repo and want the docs
site to pick up your local changes, link the package instead of using the published one:

```
# from the absmartly-api-mocks repo
$ cd ../absmartly-api-mocks
$ npm link

# back in the docs repo
$ cd -
$ npm link @absmartly/api-mocks
```

Then regenerate the docs (`yarn gen:api`). To go back to the pinned published package, unlink
without saving (so the dependency stays in `package.json`) and reinstall:

```
$ npm unlink @absmartly/api-mocks --no-save
$ yarn install
$ yarn gen:api
```

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
