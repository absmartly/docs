// Serves the build-time `<route>.md` at the page URL when the Accept header
// prefers text/markdown (browsers never send it), and handles `.md` URLs.

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

export function appendVary(headers) {
  const vary = headers.get("Vary");
  const tokens = (vary || "").split(",").map((t) => t.trim().toLowerCase());
  if (!tokens.includes("accept") && !tokens.includes("*")) {
    headers.set("Vary", vary ? `${vary}, Accept` : "Accept");
  }
}

// Canonical Markdown path for a URL that already asks for Markdown by
// extension: "/docs/foo/index.md", "/docs/foo/.md", "/docs/foo.md/" all map
// to "/docs/foo.md". Returns null when the path is not a .md request.
export function canonicalMarkdownPath(pathname) {
  const m = pathname.match(/^(.*?)(?:\/index)?\/?\.md\/?$/);
  if (!m) return null;
  const base = m[1].replace(/\/+$/, "");
  return base ? `${base}.md` : null;
}

// Handles explicit `.md` URLs. The static file is served directly when it
// exists; otherwise normalise odd spellings and follow page redirects (e.g.
// renamed sections in _redirects) to the Markdown of the target page.
async function handleMarkdownUrl(request, context, url) {
  const canonical = canonicalMarkdownPath(url.pathname);
  if (!canonical) {
    // "/index.md" or "/.md": the landing page has no Markdown; send the index.
    return Response.redirect(new URL("/llms.txt", url.origin), 302);
  }
  if (canonical !== url.pathname) {
    return Response.redirect(new URL(canonical + url.search, url.origin), 301);
  }

  const response = await context.next();
  if (response.ok) return response;

  // A splat in _redirects can match the .md URL before a page-specific rule,
  // so follow the redirect of the HTML page URL instead.
  const pagePath = canonical.replace(/\.md$/, "");
  for (const candidate of [pagePath, `${pagePath}/`]) {
    let probe;
    try {
      probe = await fetch(new URL(candidate, url.origin), { redirect: "manual" });
    } catch (err) {
      console.warn(`markdown-negotiation: probe ${candidate} failed: ${err}`);
      continue;
    }
    const location = probe.headers.get("location");
    if (probe.status >= 300 && probe.status < 400 && location) {
      const target = new URL(location, url.origin);
      const targetMd = target.origin === url.origin && markdownPathFor(target.pathname);
      if (targetMd && targetMd !== canonical) {
        return Response.redirect(new URL(targetMd, url.origin), probe.status === 301 ? 301 : 302);
      }
    }
  }
  return response;
}

// Returns null on any failure so the caller falls back to HTML.
async function fetchMarkdown(mdPath, origin) {
  try {
    const res = await fetch(new URL(mdPath, origin), { headers: { accept: "text/markdown" } });
    if (res.ok) return res;
    console.warn(`markdown-negotiation: ${mdPath} returned ${res.status}; serving HTML`);
  } catch (err) {
    console.warn(`markdown-negotiation: fetching ${mdPath} failed: ${err}; serving HTML`);
  }
  return null;
}

export default async function handler(request, context) {
  const url = new URL(request.url);
  if (/\.md\/?$/.test(url.pathname)) {
    return handleMarkdownUrl(request, context, url);
  }
  const mdPath = markdownPathFor(url.pathname);

  if (mdPath && prefersMarkdown(request.headers.get("accept"))) {
    const mdResponse = await fetchMarkdown(mdPath, url.origin);
    if (mdResponse) {
      const headers = new Headers(mdResponse.headers);
      // fetch() hands back a decoded body; the upstream encoding/length no
      // longer describe it.
      headers.delete("Content-Encoding");
      headers.delete("Content-Length");
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
  path: ["/docs/*", "/index.md", "/.md"],
  excludedPath: ["/docs/*.json"],
};
