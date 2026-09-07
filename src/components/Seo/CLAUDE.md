# Seo component

`<Seo title description path image type noindex />` writes `document.title`, the meta description, `og:title`/`og:description`/`twitter:title`/`twitter:description`, `og:url`, and `<link rel="canonical">` straight into `<head>` on mount (no `react-helmet` — this is a small hand-rolled effect). Pass `noindex` to add `<meta name="robots" content="noindex, nofollow">` for any page that's registered in `routes.jsx` but shouldn't be indexed yet (e.g. a stub page with no real content).

`image` is a root-relative asset URL (pass an import from one of the `src/assets/*Images.js` files, e.g. `pageImages.portafolioHero`) — resolved to an absolute URL the same way `path` is, and written to both `og:image`/`twitter:image`. Omit it to keep the sitewide default (`og-image.png`, hardcoded in `index.html`) — every page did this before `image` existed, so it's a safe fallback, not a broken state. `type` sets `og:type` (e.g. `"article"` for `BlogPost`); omit it to keep `index.html`'s static `website` default.

`<JsonLd id schema />` injects a `<script type="application/ld+json">` with the given object, keyed by `id` so repeated mounts update in place rather than duplicating tags.

## Convention

Every page should render `<Seo>` near the top of its JSX, pulling `title`/`description` from that page's `*_INFO`/`*_INTRO`/`*_SEO` object in `src/content/copy.js` (e.g. `SERVICIOS_INTRO.seoTitle`, `HOME_SEO.seoDescription`) — don't rely on the generic fallback baked into `index.html`, and don't hardcode copy inline in the component.

## Why this matters for crawlers

`scripts/prerender.mjs` waits for the `<link rel="canonical">` this component writes as its signal that React has actually rendered before capturing the page's HTML — see `../../../scripts/CLAUDE.md`. If a page's `<Seo>` never mounts (e.g. it's conditionally rendered behind a loading state), that route's prerender will hang/timeout.
