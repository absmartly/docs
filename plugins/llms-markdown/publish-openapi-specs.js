// Publishes the OpenAPI specs at /openapi/*.yaml: API pages render schemas
// client-side, so their Markdown lacks them.

const fs = require("fs/promises");
const path = require("path");

module.exports = function publishOpenApiSpecs(context, options) {
  return {
    name: "publish-openapi-specs",
    async postBuild({ outDir }) {
      const target = path.join(outDir, "openapi");
      await fs.mkdir(target, { recursive: true });
      for (const [name, source] of Object.entries(options.specs)) {
        await fs.copyFile(path.resolve(context.siteDir, source), path.join(target, name));
      }
    },
  };
};
