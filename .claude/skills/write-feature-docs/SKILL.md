---
name: write-feature-docs
description: Use when writing or updating ABsmartly Product Documentation pages for a feature - creates or extends Docusaurus pages that match the existing docs conventions, with accurate content and screenshots. Orchestrates the whole flow - researches the feature from the abs codebase, confirms the framing with you, writes the .mdx pages, captures screenshots, and validates the build. Triggers on "document this feature", "write docs for X", "add a docs page for the new Y feature", "/write-feature-docs". Focuses on content + validation; leave worktree/JIRA/PR to start-feature.
---

# Write Feature Docs

## Overview

Turns an ABsmartly feature into Product Documentation pages on this Docusaurus site, matching how the existing pages look and read. It orchestrates five phases and delegates the abs-specific work (research, screenshots) to the abs repo's **`document-feature-capture`** skill.

This skill owns **content + validation**. It does **not** create worktrees, JIRA tickets, or PRs — that's `start-feature`, which can call this skill as its implementation step.

**Announce at start:** "Using the write-feature-docs skill to document `<feature>`."

## What you need

- A feature to document (name + ideally a pointer: the area of the app, a ticket, or the abs subsystem).
- The abs checkout at `~/git_tree/abs` **if** you want live research and screenshots. Without it, the skill still writes pages but leaves screenshots as TODOs.

## The five phases

Create a task per phase and work them in order.

```
Research → Confirm framing → Write pages → Screenshots → Validate
```

### Phase 1 — Research (delegate)

Invoke **`document-feature-capture`** (research mode) with the specific feature. It returns a structured report describing how the feature actually works — with a **"Confirm before writing"** section listing anything the code can't settle (marketing terms not in code, product-judgment calls, low-confidence claims).

Read the report. It is your source of truth for the content; its cited file paths let you verify specifics.

### Phase 2 — Confirm framing (soft gate)

If the report flagged anything in "Confirm before writing", surface it to the user with **`AskUserQuestion`** before writing: state your understanding of the feature and ask them to confirm or correct the flagged items (e.g. "Are 'Fully' and 'Hybrid' the right names, and is my Hybrid-vs-Fully distinction correct?").

- **Strongly recommended, not hard-blocking.** If the user says "proceed as-is," continue.
- This is the step that prevents shipping a confidently-wrong framing. Don't skip it when the report flags real product judgment.

### Phase 3 — Write pages

**First, study 2–3 sibling pages** in the same section (`docs/web-console-docs/<area>/`) so your new page matches them. Then write. See `references/docusaurus-conventions.md` for the details: frontmatter (`sidebar_position`, `title`, `description`), the `<Image>` component and its relative import path, `_category_.json`, admonitions (`:::note`, `:::tip`, `:::info`), and internal links/anchors.

Rules that matter:

- **Extend, don't duplicate.** If pages for the area already exist, add to them and insert a new page only for a genuinely new concept. Renumber `sidebar_position` as needed.
- **Mirror the product's own words** (from the research report's UI strings) for labels and options.
- **Lead the reader:** overview → concept → step-by-step, with cross-links between the new page and siblings.
- **Anchor discipline:** when you link to a heading (same-page `#slug` or cross-page `./page#slug`), the slug is the kebab-cased heading. If you rename a heading later, update every link to it.

### Phase 4 — Screenshots (delegate, best-effort)

Decide which screens illustrate the feature (the research report tells you where they live). Invoke **`document-feature-capture`** (capture mode) with a brief: which screens, what state/data, and **save PNGs into `static/img/<feature>/`** in this repo. It will bring the app up screenshot-ready and drive the UI (via `absmartly-tester`).

Then wire the images into the pages with the `<Image>` component. Reuse existing screenshots when they still match the current UI — only (re)capture what's missing or stale.

**Graceful degradation:** if the app can't be brought up (or you're in a docs-only session), write the pages referencing the intended `img` paths, and clearly list the screenshots still owed. Don't block the whole doc on screenshots.

### Phase 5 — Validate

Run the checks in `references/validation.md`:

- Start the dev server; confirm the new/edited pages **compile** (no MDX errors).
- **Anchors resolve**, no **broken internal links**, and every `<Image>` **loads** (no missing-file / broken-image).
- Recognize and **ignore the known `cytoscape`/mermaid production-build error** — it's pre-existing and unrelated to feature pages (it comes from a mermaid diagram elsewhere in the docs). Validate via the dev server, which serves pages despite it.

## Done

When pages compile, links/anchors/images check out, and the framing is confirmed, the content is ready. Hand back to the caller (or to `start-feature` / `full-review` / PR flow) for review and merge — those are out of this skill's scope.

## Guardrails

- **Accuracy over completeness.** A flagged-but-honest gap beats a confident wrong statement. Respect the Phase 2 gate.
- **Match the neighbors.** New pages should be indistinguishable in style from existing Product Documentation pages.
- **No internal implementation leakage.** Describe what the user configures and sees, not internal mechanisms, unless the product intends them to be public. (This session we removed a Parquet export/import detail at the product owner's request.)
- **Screenshots must be honest** — real, schema-valid data (the capture skill handles fixtures).

## Integration

- **Invokes:** `document-feature-capture` (abs repo) — research + screenshots.
- **Invoked by / pairs with:** `start-feature` (owns worktree/JIRA/plan/PR; can call this as its implementation step), `full-review` (closing review).

## References

- `references/docusaurus-conventions.md` — frontmatter, `<Image>`, `_category_.json`, admonitions, links/anchors, the mimic-siblings rule.
- `references/validation.md` — the dev-server validation loop and the known cytoscape/mermaid build quirk.
