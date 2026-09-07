# Insumo: modelo de precios de Música + taxonomía para un cotizador único

Este documento responde puntualmente a dos cosas que quedaron pendientes en `INFORME-AUDITORIA-SEO-REPOSICIONAMIENTO.md`:

- **Hallazgo #9** (Cotizador propio para Audiovisual): quedó bloqueado en "depende de definir precios/tiers primero".
- **Hallazgo #10** (paquetes integrados música+contenido en Servicios): quedó bloqueado en "requiere decisión de negocio (oferta y precio) antes de tocar código".

Ambos bloqueos ya se resolvieron del lado de negocio, después del commit que usó esa auditoría como referencia (`be9f1a4`). Este documento trae esa decisión en forma implementable.

## 1. El departamento de Música cambió de forma

Se eliminó la batería del estudio (ruido, espacio, costo, casi sin retorno) — ese espacio pasa a ser una sala de podcast tipo panel. Música queda redefinida como:

- Producción, mezcla, masterización
- Dubs / overdubs
- Locuciones
- Composición
- Instrumentación: piano/teclados, guitarra, bajo (**sin batería**)
- Ensamble pequeño
- Sesiones en vivo (audio + multicámara) — se mantiene como oferta, pero reposicionada: precio a costo real (sin descuento por presupuesto de banda), plazo mínimo de aviso, y depósito no reembolsable al confirmar. Ya no se vende como producto de volumen para bandas — el objetivo es que quien la pida pague lo que realmente cuesta producirla.

Esto hace obsoleto cualquier supuesto de `STUDIO_SERVICES` (`copy.js`) que asuma una tarifa uniforme de "hora de sala" para todo música — hay que revisar esa estructura junto con lo de abajo.

## 2. Por qué el modelo de precio actual no alcanza

Hoy el sitio tiene, en esencia, dos formas de cobrar:
- `BOOKING_SERVICES`: precio fijo por bloque de horas (música).
- El motor de `Cotizador`: tabla paramétrica (locación × micrófonos, tipo de servicio × cámaras) + descuento por volumen (podcast).

Ninguna de las dos formas le sirve bien a todo el catálogo nuevo de Música: componer una canción no se parece a alquilar la sala por hora, y una hora de ensamble pequeño no cuesta lo mismo de producir que una hora de dubs en solitario, aunque hoy ambas se cotizarían igual si se tratan como "hora de sala".

## 3. Taxonomía de modos de precio

Para resolver esto sin inventar un motor nuevo desde cero, cada servicio del catálogo debería declarar un `pricingMode`, y la UI del cotizador pregunta distinto según cuál sea:

| `pricingMode` | Qué pregunta la UI | Ejemplo en el catálogo nuevo |
|---|---|---|
| `hourly_tiered` | Cantidad de horas (tarifa varía por nivel de complejidad/manos requeridas) | Dubs (tier baja) vs. Ensamble pequeño (tier alta) |
| `flat_project` | Selector de alcance/scope, no horas | Composición ("letra" / "letra + melodía" / "arreglo completo") |
| `per_deliverable` | Cantidad de unidades entregadas, con descuento por volumen si aplica | Mezcla y Masterización, por canción |
| `per_duration_output` | Minutos de audio final entregado, no horas de sesión | Locuciones |
| `custom_quote` | Calculadora paramétrica propia (igual mecanismo que ya existe para podcast) | Sesiones en Vivo: núm. músicos × núm. cámaras × horas de edición estimadas |

La pieza clave para `hourly_tiered` es reutilizar el mismo mecanismo que ya funciona en `COTIZADOR_LOCACIONES.pricesByMic` (más micrófonos simultáneos = más caro) — acá sería "más músicos/inputs simultáneos = tarifa por hora más alta", no una tabla nueva conceptualmente distinta.

## 4. Forma de datos propuesta (mismo patrón que ya usa `copy.js`)

```js
export const MUSICA_SERVICES = [
  {
    id: 'mezcla',
    title: 'Mezcla',
    pricingMode: 'per_deliverable',
    unit: 'canción',
    basePrice: 150000,
    // reutilizar el mismo shape que COTIZADOR_DESCUENTO_TRAMOS si aplica volumen (EP/álbum)
  },
  {
    id: 'masterizacion',
    title: 'Masterización',
    pricingMode: 'per_deliverable',
    unit: 'canción',
    basePrice: 80000,
  },
  {
    id: 'dubs',
    title: 'Dubs / Overdubs',
    pricingMode: 'hourly_tiered',
    tier: 'baja',
    pricePerHour: 20000,
  },
  {
    id: 'ensamble-pequeno',
    title: 'Ensamble pequeño',
    pricingMode: 'hourly_tiered',
    tier: 'alta',
    pricePerHour: 45000, // pendiente calibrar con costo real (crew + setup)
  },
  {
    id: 'composicion',
    title: 'Composición',
    pricingMode: 'flat_project',
    scopes: [
      { label: 'Letra', price: 80000 },
      { label: 'Letra + melodía', price: 150000 },
      { label: 'Arreglo completo', price: 300000 },
    ],
  },
  {
    id: 'locucion',
    title: 'Locución',
    pricingMode: 'per_duration_output',
    pricePerMinute: 25000,
    minimoMinutos: 2,
  },
  {
    id: 'instrumentacion',
    title: 'Instrumentación (piano/teclados, guitarra, bajo)',
    pricingMode: 'hourly_tiered', // o flat_project si es músico de sesión por tema — PENDIENTE definir (ver sección 5)
    tier: 'media',
    pricePerHour: 30000,
  },
  {
    id: 'sesiones-en-vivo',
    title: 'Sesión en vivo (audio + multicámara)',
    pricingMode: 'custom_quote',
    parametricInputs: ['numMusicos', 'numCamaras', 'horasEdicion'],
    condiciones: {
      plazoMinimoAvisoDias: 14, // valor sugerido, confirmar con el equipo
      depositoNoReembolsable: true,
    },
  },
];
```

## 5. Pendiente de definición antes de fijar precios finales

- **Instrumentación**: falta aclarar si es "músico de sesión tocando en la grabación del cliente" (se cotizaría más cerca de `flat_project` por tema, como un honorario artístico) o "instrumento disponible para que el cliente lo use" (más cerca de `hourly_tiered`, como acceso a equipo). Cambia tanto el `pricingMode` como el rango de precio razonable.
- **Tarifas por hora de cada tier** (`baja`/`media`/`alta`) deben calibrarse contra el costo real de producción (personas involucradas + tiempo de edición posterior), no heredar la tarifa vieja de "hora de sala" plana.
- **Plazo mínimo de aviso y monto del depósito** para Sesiones en Vivo quedaron como sugerencia de la conversación con los socios, no como cifra ya aprobada — confirmar antes de mostrarlo en el sitio.

## 6. Por qué esto también responde el Hallazgo #10 (paquetes integrados)

Con esta taxonomía, un "paquete integrado" música+contenido deja de requerir una lógica de precio nueva: es simplemente una combinación de ítems de `MUSICA_SERVICES` + `PODCAST_SERVICES`/`AUDIOVISUAL_SERVICES` con un descuento aplicado sobre el subtotal combinado — el mismo patrón que `COTIZADOR_DESCUENTO_TRAMOS` ya resuelve para volumen de episodios, aplicado ahora a "cruce de categorías" en vez de "cantidad de capítulos".

## 7. Alcance de este documento

Esto es un insumo de modelo de precios, no una decisión de arquitectura de información — no reabre lo ya resuelto en el informe (Opción B, estructura de Servicios/nav). Se limita a desbloquear los hallazgos #9 y #10, y a que la implementación de música no se construya sobre el supuesto viejo de "todo se cobra por hora de sala".
