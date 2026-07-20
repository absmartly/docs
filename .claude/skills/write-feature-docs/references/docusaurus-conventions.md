# Docusaurus Conventions

How Product Documentation pages are structured on this site, so new pages are indistinguishable from existing ones. This is a **Docusaurus** site (not Mintlify). Pages live under `docs/`; the sidebar is auto-generated from the folder tree.

**Always study 2–3 sibling pages in the same folder before writing.** These conventions are the pattern; the neighbors are the ground truth.

## Page frontmatter

Every `.mdx` page starts with YAML frontmatter:

```markdown
---
sidebar_position: 2
title: "Warehouse Native Modes"
description: "One-sentence summary used for SEO and previews."
---
```

- `sidebar_position` orders the page within its folder. When inserting a page between existing ones, renumber siblings so the order reads right (e.g. new page at position 1 pushes get-started to 2).
- `title` and `description` are user-facing.

## The `<Image>` component

Screenshots use a custom component (`src/components/Image`, wrapping IdealImage), **not** raw markdown images.

```markdown
import Image from "../../../src/components/Image";

<Image maxWidth="40rem" centered img="warehouse-native/exposure-mapping-complete.png" alt="Completed exposure table mapping" />
```

- **The import path is relative and depth-sensitive.** From `docs/web-console-docs/<area>/page.mdx` it's `../../../src/components/Image`; from one level deeper (`docs/web-console-docs/<area>/<sub>/page.mdx`) it's `../../../../src/components/Image`. Count the directories up to repo root, then into `src/`. Copy the import line from a sibling at the **same depth**.
- `img` is relative to `static/img/`. So `img="warehouse-native/foo.png"` → `static/img/warehouse-native/foo.png`.
- `maxWidth` (e.g. `"40rem"`, `"48rem"`) keeps large screenshots readable; `centered` centers the figure. Always include meaningful `alt`.

Put PNGs in `static/img/<feature>/`. Reuse existing images when they still match the UI; only add new ones.

## `_category_.json`

Each folder that appears as a sidebar section has a `_category_.json`:

```json
{
  "position": 8,
  "collapsible": true,
  "collapsed": true,
  "label": "Warehouse Native"
}
```

`position` orders the section among its siblings; `label` is the sidebar heading. Add one when you create a new section folder.

## Admonitions

Use Docusaurus admonitions for asides — they render as colored callouts:

```markdown
:::note
Neutral clarification.
:::

:::tip
Best-practice advice.
:::

:::info Custom title
Important context; the text after ::: becomes the title.
:::
```

Match the neighbors' usage — `:::tip` for guidance, `:::note` for caveats, `:::info` for a highlighted concept.

## Internal links and anchors

- **Cross-page:** relative path without extension — `[Get Started](./get-started)` or `[Modes](./modes)`.
- **Anchor on another page:** `./get-started#step-4-configure-exposures-import-hybrid-only`.
- **Same-page anchor:** `#the-default-data-source`.
- The anchor **slug is the kebab-cased heading text** (lowercased, spaces→hyphens, punctuation dropped, `_italics_` markers dropped). So `## Step 4: Configure exposures import _(Hybrid only)_` → `step-4-configure-exposures-import-hybrid-only`.
- **If you rename a heading, update every link that targets its old slug.** Validation (Phase 5) catches broken anchors, but grep for the old slug proactively:
  ```bash
  grep -rn "old-anchor-slug" docs/
  ```

## Tables

Standard GitHub-flavored markdown tables are used heavily for field/option references (field | description | accepted types). Mirror the columns the neighbors use.

## Structure of a good page

Overview → concept → step-by-step, with cross-links. For a multi-page feature: an `overview.mdx` (why + what), a concept/`modes` page if there's a fork to explain, a `get-started` walkthrough, and per-variant pages in a subfolder (e.g. `connect/<warehouse>.mdx`). Keep each page focused; link between them rather than repeating.

## Content rules

- **Mirror the product's own labels** (from the research report's UI strings) for buttons, fields, and options.
- **Don't leak internal implementation** the product doesn't intend to expose (this session we removed a Parquet export/import mechanism at the product owner's request — describe what the user configures and sees instead).
- **Say "can", not "must",** when the product allows a choice (a goal *can* live in an external warehouse; it isn't required).
