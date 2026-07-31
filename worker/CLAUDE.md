# Coupon validation worker

Standalone Cloudflare Worker, deployed independently from the main site (its own `package.json`/`node_modules`, not part of the Vite app). Exposes a single `POST /` endpoint: `{ code: string }` in, `{ valid: boolean, discount?, label? }` out.

Deployed to the free `*.workers.dev` subdomain — this deliberately avoids touching `estudioteburu.cl` DNS/proxy (see [[project_hosting_cloudflare]]), so it's independent of that decision.

Coupon codes live in the `COUPONS` secret (set via `wrangler secret put COUPONS`, a JSON object keyed by lowercase code — same shape `BOOKING_COUPONS` used to have in `copy.js`), not in source, since this repo is public. To add/change a coupon, update the secret and redeploy is not even required — secrets are read at request time.

The frontend calls this via `VITE_COUPON_API_URL` (see root `.env.example`) from `src/components/BookingFlow/useBookingFlow.js`.
