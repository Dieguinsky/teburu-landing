# Analytics component

Mounted once in `App.jsx`. Lazily injects GA4 and Microsoft Clarity via `src/lib/analytics.js`:

- Gated on `import.meta.env.PROD` — nothing loads in dev.
- Also gated per-provider on `VITE_GA_MEASUREMENT_ID` / `VITE_CLARITY_PROJECT_ID` being set (see `.env.example` / `.env`) — either can be added/removed independently without code changes.
- Pageviews are tracked on every route change via `useLocation` in this component, calling `trackPageview(path)` from `src/lib/analytics.js` (manual `gtag('event', 'page_view', ...)`, since `send_page_view` is disabled on init to avoid double-counting the first load).

No other analytics providers exist in this project — don't assume Segment/Mixpanel/etc. are wired up anywhere.
