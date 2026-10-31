// Rehype plugin for @signalwire/docusaurus-plugin-llms-txt.
//
// The llms-txt plugin converts the *rendered* Docusaurus HTML to Markdown.
// Theme components lose meaning in that conversion (tab labels become a
// detached bullet list, code fences lose their language, admonition titles
// become stray words). This plugin rewrites those components into plain,
// semantic HTML before the HTML -> Markdown step runs.

const el = (tagName, properties, children) => ({
  type: "element",
  tagName,
  properties: properties || {},
  children: children || [],
});
const text = (value) => ({ type: "text", value });

const classList = (node) => {
  const c = node.properties && node.properties.className;
  return Array.isArray(c) ? c : typeof c === "string" ? c.split(/\s+/) : [];
};
const hasClass = (node, name) => classList(node).includes(name);
const hasClassPrefix = (node, prefix) =>
  classList(node).some((c) => c.startsWith(prefix));
const isEl = (node) => node && node.type === "element";

function toText(node) {
  if (node.type === "text") return node.value;
  if (isEl(node) && node.tagName === "br") return "\n";
  return (node.children || []).map(toText).join("");
}

function find(node, pred) {
  if (pred(node)) return node;
  for (const child of node.children || []) {
    const hit = find(child, pred);
    if (hit) return hit;
  }
  return null;
}

function findAll(node, pred, acc = []) {
  if (pred(node)) {
    acc.push(node);
    return acc;
  }
  for (const child of node.children || []) findAll(child, pred, acc);
  return acc;
}

// <div class="language-js theme-code-block">...<div class="token-line">..</div>
//   -> <pre><code class="language-js">source</code></pre>
function convertCodeBlock(node) {
  const lang = classList(node)
    .find((c) => c.startsWith("language-"))
    ?.slice("language-".length);
  const code = find(node, (n) => isEl(n) && n.tagName === "code");
  if (!code) return null;
  const lines = findAll(code, (n) => isEl(n) && hasClass(n, "token-line"));
  const source = lines.length
    ? lines.map((l) => toText(l).replace(/\n$/, "")).join("\n")
    : toText(code);
  const title = find(node, (n) => isEl(n) && hasClassPrefix(n, "codeBlockTitle"));
  const pre = el("pre", {}, [
    el("code", lang ? { className: [`language-${lang}`] } : {}, [
      text(source.replace(/\n+$/, "")),
    ]),
  ]);
  return title ? [el("p", {}, [el("em", {}, [text(toText(title))])]), pre] : [pre];
}

// Tabs -> one bold label per panel, followed by the panel content.
function convertTabs(node) {
  const labels = findAll(node, (n) => isEl(n) && n.properties.role === "tab").map(
    (t) => toText(t).trim(),
  );
  const panels = findAll(node, (n) => isEl(n) && n.properties.role === "tabpanel");
  const out = [];
  panels.forEach((panel, i) => {
    out.push(el("p", {}, [el("strong", {}, [text(labels[i] || `Tab ${i + 1}`)])]));
    out.push(...panel.children);
  });
  return out;
}

// Admonition -> <blockquote><p><strong>Title:</strong></p>content</blockquote>
function convertAdmonition(node) {
  const heading = find(node, (n) => isEl(n) && hasClassPrefix(n, "admonitionHeading"));
  const content = find(node, (n) => isEl(n) && hasClassPrefix(n, "admonitionContent"));
  const type = classList(node)
    .find((c) => c.startsWith("theme-admonition-"))
    ?.slice("theme-admonition-".length);
  const title = (heading ? toText(heading) : "").trim() || type || "Note";
  return [
    el("blockquote", {}, [
      el("p", {}, [el("strong", {}, [text(title)])]),
      ...(content ? content.children : []),
    ]),
  ];
}

// <details><summary>X</summary>body</details> -> **X** + body
function convertDetails(node) {
  const summary = node.children.find((n) => isEl(n) && n.tagName === "summary");
  const rest = node.children.filter((n) => n !== summary);
  return [
    ...(summary ? [el("p", {}, [el("strong", {}, [text(toText(summary).trim())])])] : []),
    ...rest,
  ];
}

function transform(node) {
  if (!node.children) return;
  const next = [];
  for (const child of node.children) {
    if (!isEl(child)) {
      next.push(child);
      continue;
    }
    // Drop heading permalink anchors ("Direct link to ...") and icons.
    if (hasClass(child, "hash-link") || child.tagName === "svg") continue;

    let replacement = null;
    if (hasClass(child, "theme-code-block")) replacement = convertCodeBlock(child);
    else if (hasClass(child, "tabs-container")) replacement = convertTabs(child);
    else if (hasClass(child, "theme-admonition")) replacement = convertAdmonition(child);
    else if (child.tagName === "details") replacement = convertDetails(child);

    if (replacement) {
      const wrapper = { type: "root", children: replacement };
      transform(wrapper);
      next.push(...wrapper.children);
    } else {
      transform(child);
      next.push(child);
    }
  }
  node.children = next;
}

module.exports = function rehypeDocusaurusCleanup() {
  return (tree) => transform(tree);
};
