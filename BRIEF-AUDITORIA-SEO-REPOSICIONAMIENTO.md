# Brief de auditoría: SEO + reposicionamiento a "estudio creativo" — Estudio Teburu

Este documento es el encargo completo para auditar este sitio. Léelo entero antes de tocar código — trae el contexto de negocio que normalmente no está en el repo.

## Contexto de negocio (por qué existe este encargo)

Estudio Teburu es un estudio de grabación y producción de contenido en Santiago, Chile (Av. Libertador Bernardo O'Higgins 351), con 1.5 años operando. Fundadores: Diego Novoa (ingeniero de sonido / productor musical, a cargo de la producción técnica), José Tomás Musalem (edición de video, fotografía, RR.SS.) y Pablo Silva "Quevdor" (artista, marca propia EKIWON).

Datos reales del negocio (no son supuestos, salen del tarifario y portafolio actuales del sitio):

- El primer año tuvo un pico de demanda de música impulsado en gran parte por la red de contactos propia de los fundadores (8 años de trayectoria de Diego, +150 shows en vivo; la base de fans de Pablo/EKIWON). Ese pico se ha ido apagando desde entonces — es un canal de adquisición no renovable, no una caída de mercado.
- El área de podcast/contenido audiovisual (reels, video podcast) rinde mejor que música hoy. Estructuralmente, ya vende por paquete/temporada con descuento por volumen (5%-20% según cantidad de capítulos contratados, ver `COTIZADOR_DESCUENTO_TRAMOS` en `copy.js`), mientras música se vende por bloque de horas de sala suelto ($50.000 la hora express hasta $300.000 la jornada de 9h; mezcla y masterización se cotizan aparte, $150.000 y $80.000 respectivamente — ver `BOOKING_SERVICES`/`BOOKING_EXTRAS`).
- El portafolio público refleja esa asimetría: los clientes de contenido tienen múltiples piezas recurrentes (AndeStories, Carrete de Verano, El Delorean, Andes Touring en `PORTAFOLIO_TRABAJOS`), mientras música solo nombra un cliente propio (Misfitzpower) además de una playlist agregada de Spotify.

## Decisión de negocio ya tomada (punto de partida, no está en discusión)

Los socios decidieron reposicionar la marca: de "estudio de producción y grabación" organizado en departamentos separados (Música / Podcast / Audiovisual, cada uno con su propia página, servicios y lógica de cotización) hacia un **estudio creativo integrado**, donde música, podcast y contenido para redes son capacidades de una misma oferta creativa, no líneas de negocio independientes. Esto debe reflejarse en la arquitectura de información del sitio, no solo en el copy superficial.

## Qué vas a encontrar en el repo (para orientarte rápido)

- Stack: React 19 + Vite + React Router 7, Sass (clases globales, sin CSS modules). El `CLAUDE.md` de la raíz tiene comandos y arquitectura completa — léelo también.
- Rutas en `src/routes.jsx`; cada página en `src/pages/<Page>/index.jsx` + `.scss` co-ubicado.
- Todo el copy vive centralizado en `src/content/copy.js` como constantes exportadas — ahí están, literalmente en código, los "departamentos" actuales: `SERVICES` (resumen de 3 categorías en home), `STUDIO_SERVICES` (tiers de música), `PODCAST_SERVICES`, `AUDIOVISUAL_SERVICES`, cada uno con sus propios CTA (`SERVICIOS_MUSICA_CTAS`, `SERVICIOS_PODCAST_CTAS`, `SERVICIOS_AUDIOVISUAL_CTAS`).
- Cotización/reserva: `BOOKING_SERVICES` + `BOOKING_EXTRAS` alimentan el flujo de reserva de música (`src/pages/Reservar`, ver su `CLAUDE.md`). El `Cotizador` (`src/pages/Cotizador`) es una calculadora de precios en vivo, pero **solo existe para podcast** (`COTIZADOR_LOCACIONES`, `COTIZADOR_TIPOS_SERVICIO`, `COTIZADOR_DESCUENTO_TRAMOS`, `COTIZADOR_SERVICES`) — música no tiene cotizador propio, solo reserva de horas + formulario de contacto para lo demás.
- SEO: cada página debería renderizar `<Seo title description path noindex />` con copy de su propio `*_INFO`/`*_INTRO`/`*_SEO` en `copy.js` (ver `src/components/Seo/CLAUDE.md`). El script `npm run prerender` **solo genera HTML estático real para `/faq` y `/blog*`** — Home, Servicios, Estudio, Nosotros, Contacto, Reservar y Portafolio son 100% client-side rendered. Ver `scripts/CLAUDE.md` para cómo funciona el prerender y la generación del sitemap.
- Deploy: GitHub Pages vía `gh-pages`, sin CI — deploys manuales (`npm run deploy`). Cloudflare solo sostiene el DNS del dominio (sin proxy); no tiene relación con el Worker de validación de cupones (`worker/`, uso aparte).

## Qué necesitamos de esta auditoría

Esto es una **auditoría con recomendaciones priorizadas — no implementación todavía**. La implementación se hará en una sesión aparte, después de que el equipo revise tus hallazgos.

### 1. SEO técnico y de contenido

- Evalúa el impacto real de que solo `/faq` y `/blog*` estén prerenderizados hoy. Cuantifica el riesgo/costo (Google indexa JS razonablemente bien, pero no es gratis) y qué rutas priorizarías para prerenderizar o migrar a otra estrategia de renderizado, y por qué esas.
- Revisa metadata (componente `Seo`) y datos estructurados (`JsonLd`) existentes, y dónde faltan — en particular, si conviene un schema `LocalBusiness`/`ProfessionalService` con la dirección física, para SEO local en Santiago.
- Revisa el sitemap y su generación (parte de `npm run prerender`).
- Propón una estrategia de keywords/contenido alineada a intención real de búsqueda en Chile (ej. "estudio de grabación Santiago", "estudio de podcast Santiago", "producción de contenido para marcas Santiago"), y qué rol puede cumplir el Blog (`src/content/blog/*.md`) sosteniéndola.
- Revisa performance como factor de SEO/Core Web Vitals (tamaño de bundle, carga de imágenes — están organizadas por shoot en `src/assets/img/`).

### 2. Arquitectura de información y reposicionamiento a "estudio creativo"

- Propón cómo reestructurar `SERVICES` / `STUDIO_SERVICES` / `PODCAST_SERVICES` / `AUDIOVISUAL_SERVICES` y la navegación (`NAV_ITEMS_ES`) para que la oferta se lea como una identidad creativa integrada, no tres departamentos paralelos. No asumas una única solución correcta — hay más de un camino válido (agrupar por necesidad del cliente en vez de por medio, ofrecer paquetes cruzados música+contenido, fusionar páginas, etc.). Evalúa opciones y recomienda una, con su razonamiento.
- Evalúa si el Portafolio (`src/pages/Portafolio`, con `PORTAFOLIO_MUSIC`, `PORTAFOLIO_AUDIOVISUAL`, `PORTAFOLIO_TRABAJOS`) debería mezclar casos de música y contenido en una sola narrativa en vez de vitrinas separadas.
- Evalúa si conviene un cotizador único (extendiendo la lógica ya construida para podcast en `Cotizador`) en vez de mantener música con reserva por hora + contacto manual por separado.
- Revisa el copy de "Nosotros" (`NOSOTROS_PHILOSOPHY`, `NOSOTROS_INTRO`) y de Home (`HOME_INTRO`, `HOME_WELCOME`) — hoy hablan primero de música. Evalúa si el nuevo posicionamiento cambia qué mensaje va primero y con qué énfasis.

### 3. Entregable esperado

Un informe con hallazgos priorizados (urgente vs. ajuste fino) para cada uno de los dos frentes de arriba, con impacto y esfuerzo estimado por hallazgo. No hace falta escribir código todavía — el objetivo es tener claridad antes de tocar el sitio en producción.
