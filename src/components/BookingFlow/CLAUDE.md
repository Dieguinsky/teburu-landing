# BookingFlow

State machine (`useBookingFlow.js`) driving `src/pages/Reservar` through: servicio → extras → fecha/hora → pago. Step labels/order come from `BOOKING_STEPS` in `src/content/copy.js`.

## What actually books the slot

The fecha/hora step embeds a **Google Calendar Appointment Schedule** iframe (`BOOKING_CALENDAR_URL` in `copy.js`). That embed is the real booking system — it owns the studio's Google Calendar, computes available blocks/business hours, and collects the customer's name/email/guests through its own form. This app's UI around it (steps, service/extras selection, coupon codes) is presentation and upsell, not the reservation logic itself.

## Soft limits, not real protection

There's a client-side attempt counter that soft-limits how many times the agenda view can be opened per session/day. This is a UX nudge (avoid someone endlessly reloading the calendar), **not** real rate-limiting or per-IP abuse protection — it's trivially bypassed (clear localStorage, private window, etc.) and shouldn't be relied on as a security control.

## Pricing: servicio + extra + descuento por cantidad de canciones

`BOOKING_SERVICES` (`copy.js`) includes a `price: 0` entry (`sin-sesion`, "Solo mezcla/masterización") for clients who don't need studio time at all — just send material and pick an extra. `canProceed()`'s gate on the `servicios` step only checks `!!booking.serviceId` (a truthy id string), so a `price: 0` service is a valid, selectable choice, not a special case.

`BOOKING_EXTRAS` (Mezcla / Master / Mezcla + Master) still use `toggleExtra`'s single-select-with-deselect behavior (selecting one clears any other, clicking the selected one again clears to none) — despite `booking.extras` being an array, at most one extra is ever selected.

**Song-count volume discount** (`useBookingFlow.js`): `booking.songCount` (default `1`, set via `setSongCount`) looks up a tier in `BOOKING_EXTRAS_DESCUENTO_TRAMOS` (`copy.js`, same `{max, pct, label}` shape as `COTIZADOR_DESCUENTO_TRAMOS`) and applies `pct` as a percentage discount to **whichever extra's own base price is selected** — so Mezcla, Master, and Mezcla+Master each get their own discounted per-song price at the same tier, not a shared/fixed table. `extraUnitPrice` is the resulting per-song price (already rounded); `extrasPrice = extraUnitPrice * songCount`. Deselecting the extra resets `songCount` back to `1` (`toggleExtra`) so a stale high count doesn't linger if a different extra gets picked later.

If you change `BOOKING_EXTRAS_DESCUENTO_TRAMOS`, keep the tiers ordered ascending by `max` (first match wins, same lookup pattern as Cotizador) — the current calibration was built backward from "12+ canciones → Mezcla + Master a $50.000 c/u" (37.5% off its $80.000 base), then applied as the same 37.5%-at-12+ curve to Mezcla and Master's own base prices.

## Payment

Payment step supports bank transfer (`BOOKING_TRANSFER` in `copy.js`) and coupon codes — no payment gateway/processor integration exists; nothing here charges a card automatically.

## Coupons

Coupon codes are validated server-side by a small Cloudflare Worker (`worker/`, see `worker/CLAUDE.md`) via `VITE_COUPON_API_URL` — they used to be a plain object in `copy.js`, but that leaked every code in the client JS bundle of this public repo. `applyCoupon` in `useBookingFlow.js` is now async: it POSTs the entered code to the worker and applies whatever discount comes back, rather than looking anything up locally.
