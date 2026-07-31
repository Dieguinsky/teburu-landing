# BookingFlow

State machine (`useBookingFlow.js`) driving `src/pages/Reservar` through: servicio → extras → fecha/hora → pago. Step labels/order come from `BOOKING_STEPS` in `src/content/copy.js`.

## What actually books the slot

The fecha/hora step embeds a **Google Calendar Appointment Schedule** iframe (`BOOKING_CALENDAR_URL` in `copy.js`). That embed is the real booking system — it owns the studio's Google Calendar, computes available blocks/business hours, and collects the customer's name/email/guests through its own form. This app's UI around it (steps, service/extras selection, coupon codes) is presentation and upsell, not the reservation logic itself.

## Soft limits, not real protection

There's a client-side attempt counter that soft-limits how many times the agenda view can be opened per session/day. This is a UX nudge (avoid someone endlessly reloading the calendar), **not** real rate-limiting or per-IP abuse protection — it's trivially bypassed (clear localStorage, private window, etc.) and shouldn't be relied on as a security control.

## Payment

Payment step supports bank transfer (`BOOKING_TRANSFER` in `copy.js`) and coupon codes — no payment gateway/processor integration exists; nothing here charges a card automatically.

## Coupons

Coupon codes are validated server-side by a small Cloudflare Worker (`worker/`, see `worker/CLAUDE.md`) via `VITE_COUPON_API_URL` — they used to be a plain object in `copy.js`, but that leaked every code in the client JS bundle of this public repo. `applyCoupon` in `useBookingFlow.js` is now async: it POSTs the entered code to the worker and applies whatever discount comes back, rather than looking anything up locally.
