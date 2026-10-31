// Run: deno test --no-check --allow-read netlify/edge-functions-tests/
// Requires a built site (`yarn build`); static serving and _redirects are mocked.
import handler, {
  appendVary,
  canonicalMarkdownPath,
  markdownPathFor,
  prefersMarkdown,
} from "../edge-functions/markdown-negotiation.js";

const BUILD = new URL("../../build", import.meta.url).pathname;

// Minimal _redirects emulation: first match wins, as on Netlify.
const REDIRECTS = [
  [/^\/docs\/SDK-Documentation$/, "/docs/APIs-and-SDKs/SDK-Documentation/", 302],
  [/^\/docs\/SDK-Documentation\/(.*)$/, "/docs/APIs-and-SDKs/SDK-Documentation/$1", 302],
  [/^\/docs\/web-console-api\/get-api-key$/, "/docs/APIs-and-SDKs/Web-Console-API/api-key-get/", 302],
  [/^\/docs\/web-console-api\/(.*)$/, "/docs/APIs-and-SDKs/Web-Console-API/$1", 302],
];

async function serve(pathname) {
  let file = BUILD + pathname;
  if (pathname.endsWith("/")) file += "index.html";
  try {
    const body = await Deno.readFile(file);
    const type = file.endsWith(".md") ? "text/markdown" : "text/html; charset=utf-8";
    return new Response(body, { headers: { "content-type": type } });
  } catch {
    for (const [re, to, status] of REDIRECTS) {
      if (re.test(pathname)) {
        return new Response(null, { status, headers: { location: pathname.replace(re, to) } });
      }
    }
    return new Response("not found", { status: 404, headers: { "content-type": "text/html" } });
  }
}

const realFetch = globalThis.fetch;
globalThis.fetch = (u) => serve(new URL(u).pathname);
const call = (path, accept) =>
  handler(new Request("https://x" + path, { headers: accept ? { accept } : {} }), {
    next: () => serve(path),
  });
const loc = (r) => new URL(r.headers.get("location"), "https://x").pathname;
const eq = (a, b) => {
  if (a !== b) throw new Error(`expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
};

Deno.test("Accept parsing", () => {
  eq(prefersMarkdown("text/html,application/xhtml+xml,*/*;q=0.8"), false);
  eq(prefersMarkdown("*/*"), false);
  eq(prefersMarkdown(""), false);
  eq(prefersMarkdown("text/markdown"), true);
  eq(prefersMarkdown("text/markdown, text/html;q=0.9"), true);
  eq(prefersMarkdown("text/html, text/markdown;q=0.5"), false);
  eq(prefersMarkdown("text/markdown;q=0"), false);
});

Deno.test("path mapping", () => {
  eq(markdownPathFor("/docs/foo/"), "/docs/foo.md");
  eq(markdownPathFor("/docs/foo"), "/docs/foo.md");
  eq(markdownPathFor("/docs/foo/index.html"), "/docs/foo.md");
  eq(markdownPathFor("/docs/img/a.png"), null);
  eq(canonicalMarkdownPath("/docs/foo.md"), "/docs/foo.md");
  eq(canonicalMarkdownPath("/docs/foo/index.md"), "/docs/foo.md");
  eq(canonicalMarkdownPath("/docs/foo/.md"), "/docs/foo.md");
  eq(canonicalMarkdownPath("/docs/foo.md/"), "/docs/foo.md");
  eq(canonicalMarkdownPath("/docs/foo"), null);
});

Deno.test("appendVary matches whole tokens", () => {
  const vary = (v) => {
    const h = new Headers(v === undefined ? {} : { vary: v });
    appendVary(h);
    return h.get("vary");
  };
  eq(vary(undefined), "Accept");
  eq(vary("Accept-Encoding"), "Accept-Encoding, Accept");
  eq(vary("Accept-Encoding, Accept"), "Accept-Encoding, Accept");
  eq(vary("accept"), "accept");
  eq(vary("*"), "*");
});

const PAGE = "/docs/APIs-and-SDKs/SDK-Documentation/getting-started/";

Deno.test("negotiation: agent gets Markdown, browser gets HTML", async () => {
  let r = await call(PAGE, "text/markdown");
  eq(r.headers.get("content-type").startsWith("text/markdown"), true);
  eq((await r.text()).startsWith("# Getting Started"), true);
  eq(r.headers.get("vary"), "Accept");

  r = await call(PAGE, "text/html,*/*;q=0.8");
  eq((await r.text()).startsWith("<!doctype html>"), true);
  eq(r.headers.get("vary"), "Accept");
  eq(r.headers.get("link").includes("getting-started.md"), true);

  r = await call("/docs/nope/", "text/markdown");
  eq(r.status, 404);
});

Deno.test("negotiation adds Accept to an upstream Vary: Accept-Encoding", async () => {
  const withVary = async (p) => {
    const r = await serve(p);
    const h = new Headers(r.headers);
    h.set("vary", "Accept-Encoding");
    return new Response(r.body, { status: r.status, headers: h });
  };
  globalThis.fetch = (u) => withVary(new URL(u).pathname);
  try {
    for (const accept of ["text/markdown", "text/html"]) {
      const r = await handler(new Request("https://x" + PAGE, { headers: { accept } }), {
        next: () => withVary(PAGE),
      });
      eq(r.headers.get("vary"), "Accept-Encoding, Accept");
    }
  } finally {
    globalThis.fetch = (u) => serve(new URL(u).pathname);
  }
});

Deno.test("negotiation falls back to HTML when the Markdown fetch throws", async () => {
  globalThis.fetch = () => Promise.reject(new TypeError("network"));
  try {
    const r = await call(PAGE, "text/markdown");
    eq(r.status, 200);
    eq((await r.text()).startsWith("<!doctype html>"), true);
  } finally {
    globalThis.fetch = (u) => serve(new URL(u).pathname);
  }
});

Deno.test(".md URLs", async () => {
  let r = await call("/docs/glossary.md");
  eq(r.status, 200);
  r = await call(PAGE + "index.md");
  eq(r.status, 301);
  eq(loc(r), PAGE.replace(/\/$/, ".md"));
  r = await call("/docs/glossary/.md");
  eq(loc(r), "/docs/glossary.md");
  r = await call("/docs/does-not-exist.md");
  eq(r.status, 404);
  r = await call("/index.md");
  eq(loc(r), "/llms.txt");
});

Deno.test(".md URLs of redirected pages follow the page's redirect", async () => {
  let r = await call("/docs/SDK-Documentation.md");
  eq(loc(r), "/docs/APIs-and-SDKs/SDK-Documentation.md");
  r = await call("/docs/SDK-Documentation/getting-started.md");
  eq(loc(r), "/docs/APIs-and-SDKs/SDK-Documentation/getting-started.md");
  // The broad splat matches the .md URL itself, but the specific page rule wins.
  r = await call("/docs/web-console-api/get-api-key.md");
  eq(loc(r), "/docs/APIs-and-SDKs/Web-Console-API/api-key-get.md");
});

Deno.test(".md redirect probing survives fetch failures", async () => {
  globalThis.fetch = () => Promise.reject(new TypeError("network"));
  try {
    const r = await call("/docs/does-not-exist.md");
    eq(r.status, 404);
  } finally {
    globalThis.fetch = realFetch;
  }
});
