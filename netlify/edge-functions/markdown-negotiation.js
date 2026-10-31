// Content negotiation for AI agents.
//
// Every docs page also exists as Markdown at `<route>.md` (generated at build
// time by @signalwire/docusaurus-plugin-llms-txt). When a client asks for
// Markdown via the Accept header (e.g. `Accept: text/markdown`), serve that
// file at the normal page URL instead of the HTML. Browsers never send
// text/markdown, so human visitors are unaffected.

export function parseAccept(header) {
  return (header || "")
    .split(",")
    .map((part) => {
      const [type, ...params] = part.trim().toLowerCase().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="));
      const qValue = q ? Number.parseFloat(q.slice(2)) : 1;
      return { type: type.trim(), q: Number.isNaN(qValue) ? 0 : qValue };
    })
    .filter((entry) => entry.type);
}

// True when text/markdown is explicitly accepted and preferred at least as much
// as text/html. Wildcards alone never select Markdown.
export function prefersMarkdown(acceptHeader) {
  const entries = parseAccept(acceptHeader);
  const qFor = (type) => {
    const hit = entries.find((e) => e.type === type);
    return hit ? hit.q : undefined;
  };
  const md = qFor("text/markdown") ?? qFor("text/x-markdown");
  if (!md) return false;
  const html = qFor("text/html") ?? 0;
  return md >= html;
}

// "/docs/foo/" -> "/docs/foo.md". Returns null for paths that are not pages.
export function markdownPathFor(pathname) {
  let path = pathname.replace(/\/index\.html$/, "").replace(/\.html$/, "");
  path = path.replace(/\/+$/, "");
  if (!path) return null; // site root has no Markdown version
  const last = path.slice(path.lastIndexOf("/") + 1);
  if (last.includes(".")) return null; // asset or file with an extension
  return `${path}.md`;
}

function appendVary(headers) {
  const vary = headers.get("Vary");
  if (!vary || !/\baccept\b/i.test(vary)) {
    headers.set("Vary", vary ? `${vary}, Accept` : "Accept");
  }
}

export default async function handler(request, context) {
  const url = new URL(request.url);
  const mdPath = markdownPathFor(url.pathname);

  if (mdPath && prefersMarkdown(request.headers.get("accept"))) {
    const mdResponse = await fetch(new URL(mdPath, url.origin), {
      headers: { accept: "text/markdown" },
    });
    if (mdResponse.ok) {
      const headers = new Headers(mdResponse.headers);
      headers.set("Content-Type", "text/markdown; charset=utf-8");
      headers.set("Content-Location", mdPath);
      appendVary(headers);
      return new Response(mdResponse.body, { status: 200, headers });
    }
    // No Markdown version (e.g. landing page): fall through to HTML.
  }

  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (mdPath && contentType.includes("text/html")) {
    // Caches must not serve the HTML to an agent that asked for Markdown (or
    // vice versa), and agents can discover the Markdown version.
    const headers = new Headers(response.headers);
    appendVary(headers);
    if (response.ok) {
      headers.append("Link", `<${mdPath}>; rel="alternate"; type="text/markdown"`);
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
  return response;
}

export const config = {
  path: "/docs/*",
  excludedPath: ["/docs/*.md", "/docs/*.json"],
};
