// Publishes the raw OpenAPI specs at /openapi/*.yaml.
//
// The API reference pages render their schemas client-side, so the
// generated Markdown for those pages contains only the endpoint and
// description. Agents get the full request/response schemas from these
// spec files instead (linked from /llms.txt).

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
