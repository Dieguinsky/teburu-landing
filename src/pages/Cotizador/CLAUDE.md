# Cotizador page

The pricing engine replicates the logic of the studio's internal Excel quote
sheet ("Cotizador podcast.xlsx"). All prices and tiers live in
`src/content/copy.js` — this page only reads them and does the arithmetic in
`index.jsx`. **To change a price, edit `copy.js`; never hardcode a number in
`index.jsx`.**

## The three core tables (`copy.js`)

1. **`COTIZADOR_LOCACIONES`** — price by location × mic count.
   `pricesByMic` is keyed `1`–`4` and must have all four keys (the "Cantidad
   de micrófonos" select is generated from `COTIZADOR_MICROFONOS_OPCIONES =
   [1, 2, 3, 4]`, so a missing key renders `undefined` in the table).
   **`domicilio` must stay ≥ `teburu` at every mic tier** — it implies
   travel, so it should never be cheaper. The original sheet had this
   inverted for 2–4 mics (fixed 2026-08); the working rule used to fix it was
   `domicilio ≈ teburu × 1.2` (a 20% travel surcharge — this matched the
   sheet's own 1-mic value exactly, `25000 × 1.2 = 30000`). If you update
   `teburu`'s prices, re-check `domicilio` against this ratio rather than
   editing it in isolation.

2. **`COTIZADOR_TIPOS_SERVICIO`** — price by service type × camera count.
   `pricesByCamara` is keyed `0`–`3` (0 = solo audio), matching
   `COTIZADOR_CAMARAS_OPCIONES`. **Every service type needs a real price at
   key `0`** — audio-only projects still get edited/streamed/delivered, so
   this should never be `0` (it was `0` for all three in the original sheet;
   fixed 2026-08). Prices should also increase monotonically as camera count
   goes up within each service type (the original Streaming row had 1 and 2
   cámaras priced identically at 45000 — a data error, not an intentional
   flat tier; fixed by interpolating to 52500). An entry can carry an
   optional `extraFee` (currently only `streaming: 45000`) — a **flat,
   one-time charge** added once per project when that service type is
   selected. It is *not* multiplied by chapter count and does *not* receive
   the volume discount below, unlike everything else in this table.

3. **`COTIZADOR_DESCUENTO_TRAMOS`** — volume discount by chapter count
   (`max` is inclusive, tiers checked in order, first match wins). Applies
   only to `(locación price + servicio price) × capítulos` — never to the
   Streaming `extraFee`, and never to the à la carte extras below.

To add a new location, service type, mic/camera option, or discount tier,
add an entry to the matching array — `index.jsx` renders selects and price
lookups generically off these arrays, no other code changes needed. If you
add a mic/camera count, make sure **every** location/service-type entry gets
a price for that new key, or the lookup returns `undefined`.

## À la carte extras (`COTIZADOR_SERVICES`)

Anything *not* covered by the Excel model (clips/reels, dirección de
streaming, sonidista, dirección artística, fotografía, diseño de escena)
lives here as a flat add/remove list, same as before this rebuild. Set
`perEpisode: true` if the price should multiply by chapter count — these
extras are multiplied but never discounted (the volume discount is scoped to
the core Locación + Servicio calculation only, per the source spreadsheet).

## Calculation order (`index.jsx`)

```
locación price  = COTIZADOR_LOCACIONES[locación].pricesByMic[micrófonos]
servicio price  = COTIZADOR_TIPOS_SERVICIO[tipoServicio].pricesByCamara[cámaras]
core (antes dcto) = (locación price + servicio price) × capítulos
descuento       = core × tramo.pct                         // tramo por capítulos
extra streaming = tipoServicio.extraFee ?? 0                // solo si aplica, no se multiplica/descuenta
extras a la carta = suma de servicios agregados (× capítulos si perEpisode)

subtotal = core - descuento + extra streaming + extras a la carta
iva      = round(subtotal × 0.19)
total    = subtotal + iva
```

This mirrors the subtotal → IVA(19%) → total pattern from
`src/components/BookingFlow/useBookingFlow.js` (`formatPrice` is imported
from there rather than duplicated).

**On-page display vs. email are intentionally different levels of detail.**
The visible breakdown (`.cotizador-summary-wrap`) only shows a plain-language
resumen of the selections plus four numbers: Subtotal (pre-discount),
Descuentos aplicados, IVA, and Total estimado — no more per-line unit prices.
The itemized version (`coreRows`/`extraFeeRows`/`discountRows`/`serviceRows`
→ `allRows`) still exists and is still fully itemized — it's only used to
build `lineItemsSummary` for the emailed quote in `handleSubmit`. If you add
a new line item to the calculation, it goes in `allRows` either way, but it
won't appear on-page unless you also add it to the `cotizador-resumen` list.

## Known quirk carried over from the source spreadsheet

The "¿Cuántos capítulos estimas?" select (`COTIZADOR_EPISODIOS_OPCIONES` in
`copy.js`) tops out at `15+ capítulos`. Per existing convention (see comment
in `index.jsx`), that option is parsed as exactly `15` for the multiplier —
there's no way to select a chapter count above 15, so the `16+` discount
tier (20%) is defined for completeness but never actually reachable from the
form as-is. If the studio starts quoting 16+ chapter seasons, add higher
options to `COTIZADOR_EPISODIOS_OPCIONES` first.
