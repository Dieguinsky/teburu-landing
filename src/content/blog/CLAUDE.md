# Blog content

Each file here is one post. The filename (minus `.md`) becomes the slug used at `/blog/:slug`.

## Frontmatter

```md
---
title: "¿Cuánto cuesta grabar vocales en un estudio en Santiago?"
description: "Precios reales, qué incluye una sesión..."
date: "2026-07-06"
author: "Diego Novoa"
---

Post body in Markdown.
```

Required fields: `title`, `description`, `date` (`YYYY-MM-DD`, used for sort order), `author`. No other frontmatter fields are read.

## How it's loaded

`src/lib/blog.js` pulls every file here in at build time via `import.meta.glob(['../content/blog/*.md', '!../content/blog/CLAUDE.md'], { eager: true, query: '?raw', import: 'default' })`, parses frontmatter with a minimal hand-rolled parser (single-line `key: "value"` pairs only — not full YAML), and renders the body with `marked`. A full frontmatter/YAML library was deliberately avoided: most (e.g. `gray-matter` → `js-yaml`) pull in Node's `Buffer`, which doesn't exist in the browser bundle.

This very file (`CLAUDE.md`) is explicitly excluded from that glob — and from the equivalent scan in `scripts/prerender.mjs` — so it never gets treated as a post. If you ever add another non-post file to this folder, exclude it the same way in both places (it previously shipped as a real bogus `/blog/CLAUDE` post/route until this was caught).

`src/pages/Blog/index.jsx` lists all posts (newest first); `src/pages/BlogPost/index.jsx` renders one by slug, including its `<Seo>` title/description (from frontmatter) and a `BlogPosting` JSON-LD schema.

## Adding a post

Just add a new `.md` file here with the frontmatter above — no route registration needed, `import.meta.glob` picks it up automatically. After adding, run `npm run build && npm run prerender` (or `npm run deploy`) so the post gets prerendered static HTML and is added to `dist/sitemap.xml` — see `../../../scripts/CLAUDE.md`.

## Counter-argument sections

Posts that make a debatable claim or bust a myth (e.g. "expensive cables don't matter", "192kHz is placebo") should include a `## El contraargumento: "..."` section: a steelmanned objection stated in quotes, then refuted using the same evidence/logic the rest of the post already relies on — not a straw man. Place it after the post's main evidence sections and before the closing CTA paragraph/section. Skip the objection's quote-and-refute framing (but a "when X actually matters" nuance section is still fine) if the post already substantively addresses a counterpoint to its own thesis elsewhere.

Do **not** add this to purely informational posts — pricing FAQs, service/checklist descriptions, listicles/roundups (e.g. free-tools bundles). Those have no single thesis to argue against, so a manufactured counter-argument would be forced.
