# scripts/prerender.mjs

Runs after `vite build` (wired into `predeploy`, so `npm run deploy` covers it automatically — see `../CLAUDE.md`). Two jobs:

1. **Prerender `PRERENDERED_TOP_ROUTES` (`/`, `/servicios`, `/reservar`, `/cotizador`, `/portafolio`) plus `/faq` and every `/blog*` route.** Spins up a local static server over `dist/`, drives headless Puppeteer to each route, waits for the `<link rel="canonical">` that `src/components/Seo` writes on mount (confirms React actually rendered, not just an empty shell), then overwrites that route's `dist/<route>/index.html` with the captured DOM. This is so crawlers/link-preview bots that don't execute JS still get real content for these routes.
2. **Regenerate `dist/sitemap.xml`** from `STATIC_ROUTES` + `PRERENDERED_TOP_ROUTES` (both declared in this file) plus `/faq` and every blog slug found under `src/content/blog/`.

## Navigation wait strategy

`page.goto` uses `waitUntil: 'domcontentloaded'`, not `networkidle0` — several routes embed third-party iframes/scripts that poll continuously (Google Calendar Appointment Schedule on `/reservar`, Google Maps embed + the Instagram embed script on `/`) and would never let the network go fully idle, hanging the build indefinitely. The actual "did React render" signal is `page.waitForFunction` checking that `link[rel="canonical"]`'s `href` equals **this route's own** absolute URL — keep relying on that (not a bare `waitForSelector('link[rel="canonical"]')`, and not a tightened `waitUntil`) if you add more routes with embeds.

**Why it has to check the href, not just presence**: `startServer()` below falls back to serving `dist/index.html` for any path with no file on disk yet (mirroring the `public/404.html` GitHub Pages trick) — and since routes are prerendered in array order, every route after the first is exactly that at request time (its own `dist/<route>/index.html` doesn't exist until *this* iteration finishes writing it). So the browser's initial HTML for, say, `/servicios` is actually the previous route's already-captured output, canonical tag and all. A presence-only `waitForSelector` resolves against that stale tag instantly, before React has even re-rendered for the new URL — silently baking the wrong page's `<title>`/canonical/`og:image` into the captured HTML. This bit every `PRERENDERED_TOP_ROUTES` entry after `/` until it was caught (2026-09) — if you touch this wait condition, verify by grepping the built `dist/<route>/index.html` files' `<title>` and `canonical href`, not just by reading the page's source-level `<Seo>` props (which look correct even when the actual prerendered output isn't).

## `/` is a special case

`/`'s output file is `dist/index.html`, which is *also* the SPA fallback shell that `public/404.html` redirects every non-prerendered route to (GitHub Pages SPA trick). Prerendering it means a hard-reload or deep link to a non-prerendered route (`/nosotros`, `/estudio`, `/contacto`) briefly shows Home's markup before React mounts and swaps in the right page — a deliberate, accepted tradeoff (the alternative is an empty shell for crawlers hitting the homepage itself), not a bug.

## Editing checklist

- **New top-level route added to `src/routes.jsx`** that should stay pure SPA: add it to `STATIC_ROUTES` here too, unless it's an intentionally unregistered/unindexed stub (see the `<Seo noindex>` note in `../../src/components/Seo/CLAUDE.md` for that pattern).
- **New route that should get real prerendered HTML**: add it to `PRERENDERED_TOP_ROUTES` (or, for FAQ/blog-like content, to `routesToPrerender` directly in `main()`) — not to `STATIC_ROUTES`. Check first whether it embeds a continuously-polling third party (calendar/maps/chat widgets/etc.) — see the wait-strategy note above.
- All other routes stay pure client-rendered SPA — `<Seo>` still updates their `<head>` client-side on load, but the shipped HTML shell is generic until JS runs.

`public/sitemap.xml` is a committed fallback copy of the same list — keep it in sync manually if the route lists or blog slugs change and you're not immediately running a full build+prerender+deploy.

`getBlogSlugs()` explicitly excludes `CLAUDE.md` from `src/content/blog/` — that file documents the blog content format for Claude Code, it isn't a post. `src/lib/blog.js`'s glob excludes it the same way; if either exclusion is ever removed, `CLAUDE.md` gets prerendered and sitemapped as a bogus `/blog/CLAUDE` post.
