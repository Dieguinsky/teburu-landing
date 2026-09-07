# Informe de auditoría: SEO + reposicionamiento a "estudio creativo" — Estudio Teburu

Auditoría solicitada en `BRIEF-AUDITORIA-SEO-REPOSICIONAMIENTO.md`. Todas las referencias `archivo:línea` apuntan al estado del repo al momento de esta auditoría (commit `be9f1a4`).

**Estado: Frentes 1 y 2 completos.** El único punto descartado a propósito (no un pendiente) es el cotizador propio para Audiovisual — confirmado con el equipo que sus variables no se prestan a una calculadora fija, así que el formulario de contacto actual queda como está. Ver **"¿Qué sigue?"** al final del documento para lo poco que queda realmente abierto.

## Resumen ejecutivo

| # | Hallazgo | Frente | Impacto | Esfuerzo | Urgencia | Estado |
|---|---|---|---|---|---|---|
| 1 | Título SEO de Home es solo la marca, sin keywords | SEO | Alto | Trivial | 🔴 Urgente | ✅ Aplicado |
| 2 | `/portafolio`, `/nosotros`, `/estudio`, `/contacto` no tienen HTML prerenderizado — bots sin JS ven el shell de Home | SEO | Alto | Bajo | 🔴 Urgente | ✅ Aplicado (`/portafolio`); `/nosotros`, `/estudio`, `/contacto` quedan pendientes de evaluar |
| 3 | Imagen de 1.29MB sin comprimir como poster de video en Home | Performance | Alto | Trivial | 🔴 Urgente | ✅ Aplicado |
| 4 | Nosotros/Home framean la marca 100% como "estudio de música", no "estudio creativo" | IA/Reposicionamiento | Alto | Bajo-Medio | 🔴 Urgente | ✅ Aplicado (Nosotros y Home) |
| 5 | Audiovisual es el único de los 3 servicios sin cotizador ni calendario — solo formulario de contacto | IA/Reposicionamiento | — | — | ✅ Descartado | Confirmado con el equipo: Cobertura de eventos y Redes sociales varían demasiado proyecto a proyecto — a diferencia de Podcast, no se prestan a una calculadora de precio fijo. El formulario de contacto es la decisión correcta, no un hueco. |
| 6 | Portafolio muestra Música como un solo embed de Spotify sin casos, vs. 15 clientes reales de contenido | IA/Reposicionamiento | Medio | Medio | 🟡 Ajuste fino | ✅ Aplicado |
| 7 | `Seo` no setea `og:image`/`og:type`/`twitter:*` por página | SEO | Medio | Medio | 🟡 Ajuste fino | ✅ Aplicado |
| 8 | Videos loop (6 en total) cargan con `autoPlay` sin gating por scroll ni `preload` | Performance | Medio | Medio | 🟡 Ajuste fino | ✅ Aplicado |
| 9 | `public/sitemap.xml` committeado desincronizado (faltan 10 posts) | SEO | Bajo | Trivial | 🟢 Menor | ✅ Aplicado |
| 10 | Fuente `Helvetica CE` solo en `.otf`, sin woff2 — **y el `.otf` original resultó estar corrupto, rechazado por todo navegador Chromium/Firefox** | Performance | **Alto** (se revisó al aplicar #10) | Bajo | 🔴 Se volvió urgente al investigar | ✅ Aplicado |
| 11 | GA/Clarity se inician en el primer commit de React, compitiendo por banda ancha con el LCP | Performance | Bajo | Bajo | 🟢 Menor | ✅ Aplicado |
| 12 | Carpetas vacías huérfanas `src/pages/Artistas/`, `src/pages/Escuela/` | SEO (higiene) | Ninguno | Trivial | 🟢 Menor | ❌ Bloqueado — permiso denegado para borrar directorios |
| 13 | *(descubierto al implementar #2)* El script de prerender horneaba el `<title>`/canonical/`og:image` de **Home** en el HTML de cada ruta prerenderizada excepto `/` (Servicios, Reservar, Cotizador y ahora Portafolio) | SEO | Alto | Bajo | 🔴 Urgente | ✅ Aplicado |

---

## Frente 1: SEO técnico y de contenido

### 🔴 Urgente

**1. Título SEO de Home sin keywords — ✅ Aplicado**
`HOME_SEO.seoTitle` (`src/content/copy.js:110`) era literalmente `'Estudio Teburu'` — igual al `<title>` genérico de fallback en `index.html:9`. Era el único título de todas las páginas que no seguía el patrón `"{frase específica} — Estudio Teburu"` que sí usan Servicios, Estudio, Reservar, FAQ y Cotizador.
- **Cambio aplicado:** `HOME_SEO.seoTitle` ahora es `"Estudio de grabación, podcast y contenido en Santiago — Estudio Teburu"`, alineado con el reposicionamiento a "estudio creativo" (ver Frente 2).

**2. Rutas sin prerender: previews sociales y crawlers sin JS ven el contenido equivocado — ✅ Aplicado (parcial)**
`scripts/prerender.mjs` dejaba `/nosotros`, `/estudio`, `/contacto`, `/portafolio` en `STATIC_ROUTES` (pura SPA). Como `/` está prerenderizada y también sirve de shell de fallback de GitHub Pages, un bot que no ejecuta JS y visita directamente `/portafolio` recibía el HTML de **Home** hasta que React monta y corrige el DOM. Esto afecta link previews de WhatsApp/Facebook/LinkedIn y cualquier crawler que no ejecute JS.
- **Cambio aplicado:** `/portafolio` se movió a `PRERENDERED_TOP_ROUTES` (`scripts/prerender.mjs:31`) — es la página más "vendedora" y compartible, y no tenía embeds de polling continuo que complicaran el prerender. `/nosotros`, `/estudio`, `/contacto` quedan **pendientes de evaluar** (menor prioridad de compartición, pero mismo mecanismo aplicaría).
- **Bug adicional descubierto y corregido al implementar esto:** el script de prerender reutiliza un único `page` de Puppeteer y navega ruta por ruta en orden; su servidor estático local (`startServer()`) cae al `dist/index.html` más reciente cuando el archivo de la ruta pedida todavía no existe (para imitar el fallback de GitHub Pages). Como cada ruta se escribe recién al final de su propia iteración, **toda ruta prerenderizada después de `/` cargaba inicialmente el HTML ya capturado de la ruta anterior** — y como ese HTML ya traía un `<link rel="canonical">` válido (aunque de la página equivocada), el `waitForSelector('link[rel="canonical"]')` original se resolvía de inmediato sin esperar a que React realmente reemplazara el contenido. Resultado: **Servicios, Reservar y Cotizador llevaban meses sirviendo el `<title>`/canonical/`og:image` de Home** en su HTML estático, no los propios — el bug no tenía relación con mi cambio, ya afectaba a las 3 rutas prerenderizadas que existían antes. Se corrigió cambiando la espera a `page.waitForFunction` verificando que el `href` del canonical coincida con la URL absoluta de esa ruta específica (`scripts/prerender.mjs`, ver comentario ahí y en `scripts/CLAUDE.md`). Verificado con `grep` sobre el `dist/` generado: las 7 rutas prerenderizadas (`/`, `/servicios`, `/reservar`, `/cotizador`, `/portafolio`, `/faq`, `/blog`) ahora tienen cada una su propio `<title>`, canonical y `og:image` correctos.

### 🟡 Ajuste fino

**3. `Seo` no controla `og:image`/`og:type`/Twitter Card por página — ✅ Aplicado**
`src/components/Seo/index.jsx` solo seteaba `title`, `description`, `robots`, `og:title`, `og:description`, `og:url` y `canonical`. Nunca tocaba `og:image`, `og:type` ni `twitter:*` — quedaban fijos en `index.html` con un solo `og-image.png` para todo el sitio.
- **Cambio aplicado:** `Seo` ahora acepta `image` (URL relativa de un asset, resuelta a absoluta igual que `path`) y `type` (para `og:type`), y setea también `twitter:title`/`twitter:description`/`twitter:image`. Se pasó `image` con el hero/fondo ya existente de cada página en Servicios, Nosotros, Estudio, Contacto, Cotizador, FAQ y Portafolio; y `type="article"` en BlogPost. Home y Reservar quedan con la imagen genérica por defecto (Home porque `og-image.png` ya la representa bien; Reservar porque no tiene una imagen de fondo propia). Documentado en `src/components/Seo/CLAUDE.md`.

**4. Cobertura de keywords/blog ya es sólida pero no sostiene aún el reposicionamiento — ⏳ Disponible, no aplicado todavía**
El blog tiene 21 posts con buena cobertura de intención de búsqueda real de música y de podcast/contenido. Lo que falta es contenido que hable directamente del ángulo "estudio creativo integrado".
- **Ya no está bloqueado** (el Frente 2 se implementó — ver más abajo), pero no se escribió porque no se pidió explícitamente. Es la tarea de contenido más concreta que queda; ver "¿Qué sigue?" al final del documento.

**5. `LocalBusiness` JSON-LD ya implementado y razonablemente completo — sin acción**
Ya cubre la pregunta del brief sobre schema local — no es un hueco, no se tocó.

**6. Estructura de páginas: FAQ y Blog están bien resueltos — sin acción**
Son el estándar a replicar si se agrega JSON-LD a Portafolio en una futura iteración; no requerían cambios.

### 🟢 Menor / higiene

**7. `public/sitemap.xml` committeado estaba desincronizado — ✅ Aplicado**
Faltaban 10 de los 21 posts del blog.
- **Cambio aplicado:** se corrió `npm run build && npm run prerender` y se copió el `dist/sitemap.xml` regenerado (las 9 rutas top-level + `/faq` + `/blog` + los 21 posts) a `public/sitemap.xml`.

**8. Carpetas vacías huérfanas — ❌ Bloqueado**
`src/pages/Artistas/` y `src/pages/Escuela/` existen vacías, sin ruta en `src/routes.jsx` — residuo del commit `9c8ccff`.
- **No aplicado:** el comando para borrarlas (`rmdir`) fue bloqueado por permisos del entorno. Sin impacto funcional ni de SEO — pendiente de que alguien las borre manualmente cuando tenga acceso.

### Hallazgos de performance aplicados (parte del Frente 1, ver brief punto 1 "SEO técnico y de contenido" → CWV)

**9. Imagen de 1.29MB sin comprimir como poster de video en Home — ✅ Aplicado**
`src/assets/img/podcast/Imagen Podcast 1.jpg` era una foto de celular a resolución completa (3024×4032, 1.29MB) usada como `poster` del video "Podcast" en Home — el optimizador de build la saltaba porque su propio re-encode salía más pesado que el original.
- **Cambio aplicado:** redimensionada a 1080px de lado largo (calidad 80) con `sips`, quedando en ~240KB de origen (~116KB tras el optimizador de build) — mismo contenido visual, sin pérdida perceptible para su uso como poster de una card.

**10. Videos loop (6 en total) cargaban con `autoPlay` sin gating por scroll ni `preload` — ✅ Aplicado**
Los videos de las cards "Servicios Disponibles" (Home) y "Audiovisual" (Portafolio) usaban `autoPlay` sin `preload` ni ningún mecanismo de carga diferida — a diferencia de `<img loading="lazy">`, `<video autoPlay>` no tiene equivalente nativo, así que descargaban de inmediato al montar el componente sin importar si estaban en el viewport.
- **Cambio aplicado:** nuevo componente `src/components/LazyVideo/index.jsx` (mismo patrón de `IntersectionObserver` que ya usa `Reveal` para fondos) que solo asigna `src` (con `preload="none"` antes de eso) cuando el video entra en viewport (con 200px de margen de anticipación). Reemplazado en `Home/sections/Services` y `Portafolio` en los 6 videos loop.

**11. Fuente `Helvetica CE` solo en `.otf`, sin woff2 — ✅ Aplicado, y se descubrió algo más grave**
Las 4 variantes de `Helvetica CE` solo tenían `.otf` (20-22KB c/u), sin fallback moderno, a diferencia de `Schabo Condensed` que ya tenía woff2/woff/otf.
- **Cambio aplicado:** convertidas a `.woff2` con `fonttools`.
- **Hallazgo adicional, más serio, encontrado al probar el cambio en un navegador real (no solo con `npm run build`)**: el `.otf` original — presente desde el primer commit del repo, sin relación con nada tocado en esta auditoría — está internamente corrupto: contiene bytecode de *charstrings* CFF que el sanitizador de fuentes de Chrome/Chromium (OTS, el mismo mecanismo que usa Firefox) rechaza con `OTS parsing error: CFF: Failed to parse Top DICT Data`. La metadata interna del archivo (`Copyright (c) 1985... Adobe Systems Incorporated`, familia `Helvetica`) indica que es una fuente PostScript Type 1 de Adobe de los 90 convertida a OpenType por alguna herramienta antigua con bugs — probablemente nunca destinada a usarse como web font. **Efecto práctico: es muy probable que el sitio en producción jamás haya mostrado realmente "Helvetica CE"** — todo navegador basado en Chromium o Firefox descartaba silenciosamente el archivo y caía al fallback `system-ui, sans-serif` de `$font-body` (`src/styles/_variables.scss:22`), sin error visible para nadie.
  - **Arreglo aplicado**: usando `fontTools`, forcé la decompilación completa de cada *charstring* (glifo) del `.otf` original y lo recompilé desde cero — esto regenera bytecode limpio y evita lo que sea que el conversor original haya hecho mal. Verificado en un Chrome real (`document.fonts.check`) que las 4 variantes (regular/bold/italic/bold-italic) cargan correctamente tanto en `.otf` como en el `.woff2` resultante, sin errores de OTS — antes fallaban las 4. Se reemplazaron los 4 `.otf` en el repo por la versión reparada (mismo contenido visual, msimo archivo, bytecode regenerado) y se regeneraron los `.woff2` a partir de esa versión ya reparada.
  - **Nota aparte, no técnica**: independiente del bug ahora arreglado, el archivo sigue siendo — según su propia metadata interna — una copia de la fuente comercial "Helvetica" de Adobe con el nombre cambiado a "Helvetica CE", no una fuente con licencia propia del estudio. Repararla técnicamente no resuelve una eventual pregunta de licencia para uso web; eso queda fuera de lo que puedo evaluar yo y es una decisión del equipo.

**12. GA/Clarity se inician en el primer commit de React — ✅ Aplicado**
`Analytics` llamaba `initAnalytics()` en un `useEffect` sin dependencias, disparando los fetches de script de GA4/Clarity en el primer render, compitiendo por banda ancha con los recursos del LCP.
- **Cambio aplicado:** `initAnalytics()` ahora se agenda con `requestIdleCallback` (fallback `setTimeout` para navegadores sin soporte). Para no perder el primer pageview de la sesión (que se dispara antes de que `initAnalytics` corra), `trackPageview` en `src/lib/analytics.js` ahora encola los pageviews previos a la inicialización y los vacía apenas `initAnalytics` corre.

---

## Frente 2: Arquitectura de información y reposicionamiento a "estudio creativo"

*La sección "Estado actual (evidencia)" y "Opciones evaluadas" describen el diagnóstico original, al momento de la auditoría — se mantienen tal cual como registro del razonamiento. Para lo que efectivamente se cambió, ver "Progreso de implementación" más abajo.*

### Estado actual (evidencia) — diagnóstico original

- **Navegación**: `NAV_ITEMS_ES`/`NAV_ITEMS_JP` (`copy.js:11-33`) tienen un único link "Servicios" — Música/Podcast/Audiovisual **no son departamentos visibles en la nav**, solo existen como anclas internas (`#musica`, `#podcast`, `#audiovisual`) dentro de una sola página `/servicios`.
- **Página Servicios**: `src/pages/Servicios/index.jsx:19-28` arma `SERVICE_CATEGORIES` iterando `STUDIO_SERVICES`/`PODCAST_SERVICES`/`AUDIOVISUAL_SERVICES` como 3 secciones apiladas en scroll (no tabs, no sub-rutas) — la separación es de contenido/copy, no de navegación dura.
- **Asimetría de conversión real** (esto sí es arquitectura, no solo copy):
  - Música → `Reservar`: calendario de reserva por hora (Google Calendar Appointment Schedule embebido).
  - Podcast → `Cotizador`: calculadora de precio en vivo con descuento por volumen, sin calendario.
  - Audiovisual → solo formulario de contacto genérico (`/contacto`), sin calculadora ni calendario propio.
  Esta asimetría **sí refleja diferencias reales del negocio** (ver brief: música se vende por bloque de horas suelto, podcast ya vende por paquete/temporada) — no es puramente arbitraria. **Actualización tras confirmar con el equipo**: la lectura inicial de este hallazgo (que Audiovisual era la oferta "menos madura" y necesitaba un cotizador propio como Podcast) quedó descartada — tanto Cobertura de eventos como Redes sociales varían demasiado proyecto a proyecto para una calculadora de precio fijo, a diferencia de Podcast (locación × mics, tipo × cámaras, capítulos son variables pocas y ortogonales). El formulario de contacto para Audiovisual es la decisión correcta, no un hueco a cerrar.
- **Nosotros — 100% enmarcado como estudio de música**: `NOSOTROS_PHILOSOPHY` (`copy.js:343-350`) es la narrativa de origen de la marca y repite "hacer música" como mantra central, sin mencionar podcast/audiovisual una sola vez. `NOSOTROS_INTRO` (`copy.js:352-360`) dice "somos un estudio de grabación... con trayectoria en la industria musical nacional". Esta es la página que más debería reflejar la identidad de "estudio creativo integrado" (es el "por qué existimos") y hoy es la más músico-céntrica de todo el sitio.
- **Home también lidera con música**: `HOME_INTRO` (título "Tu música, en buenas manos") y `HOME_WELCOME` (3 features todos sobre gear/equipo/ritmo de sesión musical) aparecen **antes** de la sección `SERVICES`, que es el único lugar donde los 3 rubros se presentan como iguales.
- **Portafolio — vitrinas desbalanceadas, no una narrativa integrada**: `PORTAFOLIO_MUSIC` (`copy.js:490-494`) es solo un embed de playlist de Spotify, sin un solo caso de cliente. `PORTAFOLIO_AUDIOVISUAL` son 3 tarjetas de categoría genéricas. `PORTAFOLIO_TRABAJOS` son 15 tarjetas de clientes reales (Misfitzpower, El Delorean, Carrete de Verano, AndeStories, Andes Touring) — todas de contenido/reels, sin campo `category` que distinga música de audiovisual. El mensaje implícito para un visitante: "tenemos muchísimos casos de contenido, y de música solo una playlist".

### Opciones evaluadas — diagnóstico original

**Opción A — Fusión total por necesidad del cliente.** Reestructurar Servicios/Portafolio/nav completamente alrededor de "qué necesita el cliente" (ej. "Graba tu música", "Cuenta tu historia en audio/video", "Paquetes integrados") en vez de por medio técnico, con una nueva categoría de paquetes cruzados música+contenido como ciudadano de primera clase.
- *A favor*: la más fiel al mandato "no son líneas de negocio independientes"; máxima señal de reposicionamiento.
- *En contra*: mayor esfuerzo (reescribe copy, nav, y probablemente la lógica de cotización); arriesga romper una UX de compra que hoy funciona razonablemente bien por medio (calendario vs. calculadora responden a modelos de venta genuinamente distintos, no solo a la costumbre).

**Opción B — Reestructuración media (recomendada).** Mantener las 3 secciones de Servicios como están (siguen siendo un buen modelo mental de compra — alguien que quiere grabar un disco y alguien que quiere un podcast buscan cosas distintas), pero:
1. Reescribir `NOSOTROS_PHILOSOPHY`/`NOSOTROS_INTRO` y `HOME_INTRO`/`HOME_WELCOME` para que la identidad de marca lidere con "estudio creativo" antes de mencionar música específicamente.
2. Unificar Portafolio en una sola narrativa con casos de ambos mundos entrelazados (dejar de aislar Música como un embed aparte sin casos), agregando al menos 1-2 casos de música con el mismo tratamiento visual que los de contenido.
3. Agregar una sección/CTA de "paquetes integrados" (música + contenido) en Servicios, como primer paso concreto de venta cruzada, sin desarmar las 3 categorías existentes.
4. ~~Como follow-up (no bloqueante): dar a Audiovisual un cotizador propio~~ — **descartado tras confirmar con el equipo** (ver "Asimetría de conversión real" arriba): las variables de Audiovisual no se prestan a una calculadora fija.
- *A favor*: cambio real de arquitectura de información (no solo copy superficial, cumple lo que pide el brief), pero de esfuerzo acotado y bajo riesgo — reutiliza patrones y componentes que ya existen (`Cotizador`, `PORTAFOLIO_TRABAJOS`).
- *En contra*: no es la transformación más radical; si el objetivo de negocio es específicamente dejar de vender "por hora de música" vs "por paquete de contenido" como categorías, esto no lo resuelve — solo mejora la narrativa y el cross-sell.

**Opción C — Cambio mínimo, solo copy.** Reescribir Nosotros/Home sin tocar Servicios/Portafolio/Reservar/Cotizador.
- *A favor*: esfuerzo mínimo.
- *En contra*: el propio brief advierte explícitamente contra esto ("esto debe reflejarse en la arquitectura de información del sitio, no solo en el copy superficial") — no cumple el encargo.

### Recomendación — diagnóstico original

**Opción B.** Es la que balancea cumplir el mandato real del brief (cambio de arquitectura de información, no solo mensaje) con el riesgo/esfuerzo — y respeta que la asimetría Reservar/Cotizador/Contacto no es un accidente de diseño sino un reflejo de modelos de venta genuinamente distintos (confirmado con el equipo: Audiovisual varía demasiado proyecto a proyecto para una calculadora, así que esa asimetría se mantiene tal cual, no se "cierra"). El orden de prioridad práctico dentro de la Opción B: primero Nosotros (es la página de identidad de marca, y hoy es la más contradictoria con el reposicionamiento), luego Portafolio (evidencia social, alto tráfico probable de referidos), luego Home intro/welcome, y por último la sección de paquetes cruzados en Servicios (requiere definir oferta/precio, no es solo copy).

### Progreso de implementación

- ✅ **Nosotros** (`NOSOTROS_PHILOSOPHY`, `NOSOTROS_INTRO`) — reescrito. El mantra "hacer música" se reemplazó por "crear con sentido" (usado 2 veces, apertura y cierre, para no sonar repetitivo — el párrafo del medio usa "hacer las cosas con intención" en su lugar); "estudio de grabación... industria musical nacional" pasó a "estudio creativo... industria musical y audiovisual nacional". De paso se ajustó `CONTACT_INFO.subtitle` ("¡Te esperamos para hacer música juntos!" → "¡Te esperamos para crear juntos!"), mismo sesgo música-primero detectado de pasada en Contacto.
- ✅ **Home** (`HOME_INTRO`/`HOME_WELCOME`) — reescrito. Título "Tu música, en buenas manos" → "Tu proyecto, en buenas manos"; "grabamos, producimos y mezclamos" → "...y editamos" (broadea más allá de mezcla de audio); las 3 features de bienvenida ahora mencionan cámaras/video y trayectoria "musical y audiovisual" en vez de solo "escena musical chilena".
- ✅ **Portafolio** (unificar narrativa música + contenido) — la sección "Música" ya no es solo el embed de Spotify sin evidencia: se agregó una grilla con las 12 carátulas reales de `albumCovers` (las mismas que ya se usaban en Home/Artistas, reutilizadas sin fotos nuevas) antes del embed, con el mismo tratamiento visual de grid que usan Audiovisual y Trabajos. No se le puso nombre de cliente a cada carátula (los archivos solo tienen el título de la canción, no el artista) para no inventar atribución — es una galería de evidencia, no un grid de casos con cliente como Trabajos. Pendiente a futuro si quieren casos de música con nombre de cliente: se necesitarían fotos de sesión reales, no solo carátulas.
- ❌ **Cotizador propio para Audiovisual** — descartado (no pendiente): confirmado con el equipo que Cobertura de eventos y Redes sociales varían demasiado proyecto a proyecto, a diferencia de Podcast. El formulario de contacto actual es correcto tal cual.
- ✅ **Paquetes integrados en Servicios** — implementado como mensaje + CTA (`SERVICIOS_PAQUETES` en `copy.js`), sin precio fijo, cotizando a medida por Contacto — decisión tomada tras confirmar que la venta cruzada música+contenido "rara vez o nunca" pasa hoy en la práctica (no hay demanda probada para justificar un precio de combo formal) y que, igual que con Audiovisual, la combinación de horas de sala + producción audiovisual no se reduce a una tarifa fija. Nueva sección entre el catálogo de 3 categorías y el comparador A/B en `src/pages/Servicios/index.jsx`. De paso se corrigió el CTA de cierre de la página ("¿Listo/a para hacer tu música?" → "¿Listo/a para tu próximo proyecto?"), mismo sesgo música-primero encontrado en Contacto y Home.

---

## Tabla de priorización final

| Prioridad | Hallazgo | Frente | Esfuerzo | Estado | Por qué va aquí |
|---|---|---|---|---|---|
| 1 | Reescribir `HOME_SEO.seoTitle` | SEO | Trivial | ✅ Aplicado | Impacto alto, una línea |
| 2 | Comprimir manualmente `Imagen Podcast 1.jpg` (poster 1.29MB en Home) | Performance | Trivial | ✅ Aplicado | Asset pesado cerca del fold, el optimizador automático lo saltó |
| 3 | Mover `/portafolio` a rutas prerenderizadas | SEO | Bajo | ✅ Aplicado | Arregla previews sociales de la página más compartida |
| 3b | *(bonus)* Corregir el `waitForSelector` del prerender que horneaba el `<head>` de Home en toda ruta prerenderizada después de `/` | SEO | Bajo | ✅ Aplicado | Descubierto al implementar #3; sin esto, prerenderizar más rutas no serviría de nada |
| 4 | Reescribir `NOSOTROS_PHILOSOPHY`/`NOSOTROS_INTRO` hacia "estudio creativo" | IA/Reposicionamiento | Bajo-Medio | ✅ Aplicado | Página de identidad de marca, hoy contradice el reposicionamiento ya decidido |
| 5 | Reescribir `HOME_INTRO`/`HOME_WELCOME` | IA/Reposicionamiento | Bajo | ✅ Aplicado | Misma lógica que #4, en la página de mayor tráfico |
| 6 | Unificar narrativa de Portafolio (casos de música + contenido entrelazados) | IA/Reposicionamiento | Medio | ✅ Aplicado (con carátulas existentes) | Requiere contenido/casos nuevos de música, no solo copy |
| 7 | `og:image`/`og:type`/Twitter Card por página en `Seo` | SEO | Medio | ✅ Aplicado | Mejora calidad de previews, no bloqueante |
| 8 | Gating por scroll + `preload` en los 6 videos loop | Performance | Medio | ✅ Aplicado | Ahorro de banda ancha en móvil, no crítico hoy (4.1MB totales en build) |
| 9 | ~~Cotizador propio para Audiovisual~~ | IA/Reposicionamiento | — | ❌ Descartado | Confirmado con el equipo: Cobertura de eventos y Redes sociales varían demasiado proyecto a proyecto para una calculadora fija — el formulario de contacto actual es correcto |
| 10 | Sección de "paquetes integrados" música+contenido en Servicios | IA/Reposicionamiento | Bajo (mensaje + CTA, sin precio) | ✅ Aplicado | Confirmado con el equipo: sin demanda probada de venta cruzada aún y sin tarifa formulable — se implementó como mensaje que cotiza a medida por Contacto, no como calculadora |
| 11 | Regenerar `public/sitemap.xml` | SEO | Trivial | ✅ Aplicado | Bajo riesgo real, solo higiene |
| 12 | Convertir fuente `Helvetica CE` a woff2 — y reparar el `.otf` original, que estaba corrupto y rechazado por Chrome/Firefox | Performance | Bajo | ✅ Aplicado | No era solo ahorro de peso: el sitio probablemente nunca mostró esta fuente en ningún navegador |
| 13 | Diferir carga de GA/Clarity (idle/interacción en vez de primer commit) | Performance | Bajo | ✅ Aplicado | No bloquea render, pero compite por banda ancha en LCP |
| 14 | Borrar `src/pages/Artistas/`, `src/pages/Escuela/` (vacías) | SEO (higiene) | Trivial | ❌ Bloqueado | Permiso denegado para borrar directorios en este entorno |
| 15 | Posts de blog sobre "estudio creativo integrado" | SEO | Bajo (técnico), redacción aparte | ⏳ Disponible, no aplicado | Ya no depende de nada — el mensaje del Frente 2 quedó definido; solo falta escribirlos |
| 16 | Evaluar prerenderizar `/nosotros`, `/estudio`, `/contacto` | SEO | Bajo | ⏳ Pendiente | Mismo mecanismo que #3, menor prioridad de compartición |

---

## ¿Qué sigue?

Todo lo que dependía de decisiones ya tomadas está aplicado (Frente 1 completo, Frente 2 completo). Lo que queda es exactamente esto, de mayor a menor relevancia práctica:

1. **Revisar en el navegador antes de subir nada** — `npm run dev` y mirar Home, Nosotros, Servicios y Portafolio. Nada se commiteó todavía en esta sesión.
2. **Commit + push + deploy** — una vez revisado, es el paso natural para que todo esto (SEO, performance, copy nuevo) llegue a producción.
3. **Posts de blog sobre "estudio creativo integrado"** (#15) — ya no está bloqueado por nada técnico, solo falta que alguien los escriba (o me pidan redactarlos). Es la única pieza de contenido nueva que el reposicionamiento sugiere y que no se ha hecho.
4. **Borrar `src/pages/Artistas/`, `src/pages/Escuela/`** (#14) — el comando me lo bloqueó el entorno; se puede borrar a mano en 5 segundos.
5. **Evaluar prerenderizar `/nosotros`, `/estudio`, `/contacto`** (#16) — quedó como "menor prioridad" porque se comparten menos que Portafolio, no porque no valga la pena. Se puede retomar cuando quieran, mismo mecanismo ya corregido en `scripts/prerender.mjs`.
6. **Decisión de licencia de la fuente "Helvetica CE"** (no técnica) — el archivo ya quedó técnicamente arreglado (carga sin errores en Chrome/Firefox), pero su metadata interna indica que es una copia de la fuente comercial "Helvetica" de Adobe, no algo con licencia propia del estudio para uso web. Vale la pena que alguien del equipo confirme si tienen derecho a usarla así, o si conviene reemplazarla por una alternativa con licencia clara (ej. algo de Google Fonts visualmente similar) — esto no es algo que yo pueda decidir ni verificar por ustedes.

No queda ningún punto bloqueado por precio/oferta sin definir — los dos que lo estaban (cotizador Audiovisual, paquetes integrados) se resolvieron con la conversación de recién, no quedaron pendientes de negocio.
