// Remark plugin: rewrite "/docs/foo/.md" links (emitted by the llms-txt plugin
// for trailing-slash links) to "/docs/foo.md", saving agents a redirect.
function walk(node) {
  if ((node.type === "link" || node.type === "definition") && typeof node.url === "string") {
    node.url = node.url.replace(/\/\.md(?=$|[?#])/, ".md");
  }
  for (const child of node.children || []) walk(child);
}

module.exports = function remarkFixMarkdownLinks() {
  return walk;
};
