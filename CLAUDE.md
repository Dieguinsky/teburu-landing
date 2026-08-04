# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Landing site for Estudio Teburu (a recording/music production/podcast studio), built with React 19 + Vite + React Router 7, styled with Sass.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint (flat config, `eslint.config.js`)
- `npm run prerender` — bakes static HTML for SEO-critical routes and regenerates the sitemap; see `scripts/CLAUDE.md`
- `npm run deploy` — `predeploy` (build + prerender) then publishes `dist/` to `gh-pages`. This is the only deploy path — there is no CI; deploys are manual from a dev machine.

There is no test runner configured in this project.

## Architecture

**Routing**: `src/routes.jsx` defines all routes under a shared `Layout` (`src/components/Layout`), which renders the nav/logo and an `<Outlet />`. Add new pages by creating a folder under `src/pages/<PageName>/` and registering the route in `routes.jsx`.

**Page structure**: each page lives in `src/pages/<PageName>/` with an `index.jsx` and a co-located `<PageName>.scss` imported directly in the component (plain CSS, not CSS modules — class names are global). The Home page additionally splits into `sections/<SectionName>/` subfolders (e.g. `Hero`, `Intro`, `Services`, `Studio`, `Welcome`, `Artists`, `Team`, `Agenda`, `Reel`, `Location`), each following the same `index.jsx` + co-located `.scss` pattern. Follow this convention for new pages/sections rather than introducing a different styling approach.

**Content/copy**: all user-facing text (brand name, nav labels in Spanish and Japanese, hero taglines, service descriptions, per-page `seoTitle`/`seoDescription`, etc.) lives centrally in `src/content/copy.js` as exported constants, not inlined in components. The nav (`Layout`) renders both a Japanese and Spanish label per link (`NAV_ITEMS_JP` / `NAV_ITEMS_ES`) with a fade transition between them — this JP→ES fade is a deliberate brand/design choice, not leftover code.

**Blog**: posts are Markdown files with frontmatter under `src/content/blog/*.md`, rendered by `src/pages/Blog` (list) and `src/pages/BlogPost` (single post by `:slug`) via `src/lib/blog.js`. See `src/content/blog/CLAUDE.md` for the frontmatter format and parsing details.

**SEO**: every page should render `<Seo title description path noindex />` (and `<JsonLd>` where a schema applies) with page-specific copy from its `*_INFO`/`*_INTRO`/`*_SEO` object in `copy.js` — don't rely on the generic fallback title/description baked into `index.html`. See `src/components/Seo/CLAUDE.md` for the component API and `scripts/CLAUDE.md` for how prerendering (only `/faq` + `/blog*` get real static HTML — everything else is pure client-rendered SPA) and sitemap generation work.

**Analytics**: GA4 + Microsoft Clarity, lazily loaded and env-gated. See `src/components/Analytics/CLAUDE.md`.

**Contact form**: `src/pages/Contacto` submits client-side to Web3Forms, no backend. See `src/pages/Contacto/CLAUDE.md`.

**Booking flow**: `src/pages/Reservar` + `src/components/BookingFlow` walk through service → extras → date/time → payment; a Google Calendar embed is what actually reserves the slot. See `src/components/BookingFlow/CLAUDE.md`.

**Cotizador**: `src/pages/Cotizador` is a live podcast-quote calculator — not just a lead-capture form. The core pricing (Locación × micrófonos, Tipo de servicio × cámaras, descuento por volumen según capítulos) replicates the studio's internal Excel quote sheet; à la carte extras (fotografía, clips, etc.) are a separate add/remove list on top. All prices/tiers live in `copy.js` (`COTIZADOR_LOCACIONES`, `COTIZADOR_TIPOS_SERVICIO`, `COTIZADOR_DESCUENTO_TRAMOS`, `COTIZADOR_SERVICES`). See `src/pages/Cotizador/CLAUDE.md` for the full calculation order and how to edit prices.

**Coupon validation**: discount codes are validated server-side by a standalone Cloudflare Worker in `worker/` (own `package.json`, deployed separately from the site via Wrangler) — codes used to be a plain object in `copy.js`, which leaked every code in the client bundle of this public repo, so that format is retired. See `worker/CLAUDE.md` for the deploy/secret-update workflow.

**Images**: image imports are centralized in `src/assets/*Images.js` files (e.g. `homeImages.js`, `pageImages.js`, `serviciosImages.js`) rather than imported ad hoc per component — each exports a keyed object mapping semantic names to imported image assets. Add new images to the relevant `*Images.js` file rather than importing raw paths directly in page/section components. Actual image files live under `src/assets/img/`, organized in subfolders by shoot/source (e.g. `oficials/` general studio photos, `podcast/` podcast session photos, `Espacio/` studio/equipment photos). **`diam1/`, `diam2/`, `puntiagudo1/`, `puntiagudo2/` are NOT photos** — they're abstract Teburu star-mark logo/graphic assets in different colors. View a file before reusing it as a "real photo" placement; don't pick by filename-pattern analogy alone.

**Styles**: global Sass entry point is `src/styles/index.scss`, which just forwards `fonts`, `variables`, and `base` partials. Brand colors, grayscale, and font stacks are defined once in `src/styles/_variables.scss` — reference these Sass variables rather than hardcoding colors/fonts in page-level SCSS.

**Deploy**: hosted on GitHub Pages via `gh-pages` (not Cloudflare — Cloudflare only holds unproxied DNS for the domain; the coupon-validation Worker above is a separate, unrelated use of the same Cloudflare account and does not touch the site's DNS/proxy). `public/404.html` + the inline script in `index.html` implement the standard SPA-on-GitHub-Pages redirect trick so deep links survive a full page load.

**Design references**: the `refes/` directory holds local design reference images (mockups, chat screenshots) and is git-ignored — it's for local reference only, not part of the shipped app.
