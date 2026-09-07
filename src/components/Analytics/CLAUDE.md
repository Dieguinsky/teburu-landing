# Analytics component

Mounted once in `App.jsx`. Lazily injects GA4 and Microsoft Clarity via `src/lib/analytics.js`:

- Gated on `import.meta.env.PROD` — nothing loads in dev.
- Also gated per-provider on `VITE_GA_MEASUREMENT_ID` / `VITE_CLARITY_PROJECT_ID` being set (see `.env.example` / `.env`) — either can be added/removed independently without code changes.
- `initAnalytics()` itself is scheduled via `requestIdleCallback` (falls back to `setTimeout` where unsupported, e.g. older Safari) rather than called directly on mount, so the GA/Clarity script fetches don't compete with LCP-critical resources for bandwidth right after first paint.
- Pageviews are tracked on every route change via `useLocation` in this component, calling `trackPageview(path)` from `src/lib/analytics.js` (manual `gtag('event', 'page_view', ...)`, since `send_page_view` is disabled on init to avoid double-counting the first load). Because init is deferred, `trackPageview` queues any path fired before `window.gtag` exists yet and flushes the queue once `initAnalytics` actually runs — don't remove that queue when touching this file, it's what stops the first pageview of a session from being silently dropped.

No other analytics providers exist in this project — don't assume Segment/Mixpanel/etc. are wired up anywhere.
