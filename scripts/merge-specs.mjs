import { readFileSync, writeFileSync } from "fs";
import yaml from "js-yaml";

const [primaryPath, fallbackPath, outputPath] = process.argv.slice(2);

if (!primaryPath || !fallbackPath || !outputPath) {
  console.error(
    "Usage: node merge-specs.mjs <primary-spec> <fallback-spec> <output>"
  );
  process.exit(1);
}

function loadSpec(filePath) {
  const content = readFileSync(filePath, "utf8");
  return filePath.endsWith(".yaml") || filePath.endsWith(".yml")
    ? yaml.load(content)
    : JSON.parse(content);
}

const primary = loadSpec(primaryPath);
const fallback = loadSpec(fallbackPath);

const merged = {
  openapi: primary.openapi || fallback.openapi,
  info: { ...fallback.info, ...primary.info },
  servers: stripTrailingSlashes(primary.servers || fallback.servers),
  security: primary.security || fallback.security,
  tags: mergeTags(primary.tags, fallback.tags),
  paths: { ...fallback.paths, ...primary.paths },
  components: mergeComponents(primary.components, fallback.components),
};

if (fallback.externalDocs || primary.externalDocs) {
  merged.externalDocs = primary.externalDocs || fallback.externalDocs;
}

function stripTrailingSlashes(servers) {
  if (!servers) return servers;
  return servers.map((s) => ({ ...s, url: s.url.replace(/\/+$/, "") }));
}

function mergeTags(primaryTags = [], fallbackTags = []) {
  const seen = new Set(primaryTags.map((t) => t.name));
  return [...primaryTags, ...fallbackTags.filter((t) => !seen.has(t.name))];
}

function mergeComponents(primary = {}, fallback = {}) {
  const allKeys = new Set([
    ...Object.keys(primary),
    ...Object.keys(fallback),
  ]);
  const merged = {};
  for (const key of allKeys) {
    merged[key] = { ...fallback[key], ...primary[key] };
  }
  return merged;
}

writeFileSync(outputPath, JSON.stringify(merged, null, 2));

const primaryPathCount = Object.keys(primary.paths || {}).length;
const fallbackPathCount = Object.keys(fallback.paths || {}).length;
const mergedPathCount = Object.keys(merged.paths).length;
const overwritten = primaryPathCount + fallbackPathCount - mergedPathCount;

console.log(`  Primary spec:  ${primaryPathCount} paths (from ${primaryPath})`);
console.log(`  Fallback spec: ${fallbackPathCount} paths (from ${fallbackPath})`);
console.log(`  Merged result: ${mergedPathCount} paths (${overwritten} overwritten)`);
console.log(`  Output: ${outputPath}`);
