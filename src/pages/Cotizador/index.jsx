import { useState } from 'react'
import {
  BRAND,
  COTIZADOR_INFO,
  CONTACT_INFO,
  COTIZADOR_LOCACIONES,
  COTIZADOR_MICROFONOS_OPCIONES,
  COTIZADOR_TIPOS_SERVICIO,
  COTIZADOR_CAMARAS_OPCIONES,
  COTIZADOR_DESCUENTO_TRAMOS,
  COTIZADOR_SERVICES,
  COTIZADOR_EPISODIOS_OPCIONES,
  COTIZADOR_CLIPS_OPCIONES,
} from '../../content/copy'
import { pageImages } from '../../assets/pageImages'
import Seo from '../../components/Seo'
import { trackEvent } from '../../lib/analytics'
import { formatPrice } from '../../components/BookingFlow/useBookingFlow'
import './Cotizador.scss'

const IVA_RATE = 0.19

const initialForm = {
  name: '',
  email: '',
  phone: '',
  episodes: '',
  clips: '',
  locacion: COTIZADOR_LOCACIONES[0].id,
  microfonos: String(COTIZADOR_MICROFONOS_OPCIONES[0]),
  tipoServicio: COTIZADOR_TIPOS_SERVICIO[0].id,
  camaras: String(COTIZADOR_CAMARAS_OPCIONES[0].value),
  about: '',
  details: '',
  services: [],
}

export default function Cotizador() {
  const [form, setForm] = useState(initialForm)
  const [serviceToAdd, setServiceToAdd] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  function handleChange({ target: { name, value } }) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleServiceSelect({ target: { value: id } }) {
    if (!id) return
    setForm((prev) =>
      prev.services.includes(id) ? prev : { ...prev, services: [...prev.services, id] },
    )
    setServiceToAdd('')
  }

  function handleServiceRemove(id) {
    setForm((prev) => ({ ...prev, services: prev.services.filter((s) => s !== id) }))
  }

  // "15+ capítulos" -> 15; sin selección -> 1, para no anular precios por defecto.
  const episodeCount = Math.max(1, parseInt(form.episodes, 10) || 1)

  const locacion = COTIZADOR_LOCACIONES.find((l) => l.id === form.locacion)
  const tipoServicio = COTIZADOR_TIPOS_SERVICIO.find((t) => t.id === form.tipoServicio)
  const microfonos = Number(form.microfonos)
  const camaras = Number(form.camaras)

  const locacionPrice = locacion.pricesByMic[microfonos]
  const servicioPrice = tipoServicio.pricesByCamara[camaras]
  const coreSubtotalBeforeDiscount = (locacionPrice + servicioPrice) * episodeCount

  const tramo = COTIZADOR_DESCUENTO_TRAMOS.find((t) => episodeCount <= t.max)
  const discountAmount = Math.round(coreSubtotalBeforeDiscount * tramo.pct)
  const streamingExtra = tipoServicio.extraFee ?? 0

  const coreRows = [
    {
      id: 'locacion',
      title: `Locación: ${locacion.title} — ${microfonos} micrófono${microfonos > 1 ? 's' : ''}`,
      qtyLabel: `${episodeCount} cap.`,
      price: locacionPrice,
      subtotal: locacionPrice * episodeCount,
    },
    {
      id: 'servicio',
      title: `Servicio: ${tipoServicio.title} — ${camaras} cámara${camaras !== 1 ? 's' : ''}`,
      qtyLabel: `${episodeCount} cap.`,
      price: servicioPrice,
      subtotal: servicioPrice * episodeCount,
    },
  ]

  const extraFeeRows =
    streamingExtra > 0
      ? [
          {
            id: 'streaming-extra',
            title: 'Streaming — cargo fijo único',
            qtyLabel: '1',
            price: streamingExtra,
            subtotal: streamingExtra,
          },
        ]
      : []

  const discountRows =
    discountAmount > 0
      ? [
          {
            id: 'descuento',
            title: `Descuento por volumen (${tramo.label})`,
            qtyLabel: '',
            price: null,
            subtotal: -discountAmount,
          },
        ]
      : []

  const serviceRows = form.services
    .map((id) => COTIZADOR_SERVICES.find((s) => s.id === id))
    .filter(Boolean)
    .map((service) => {
      const qty = service.perEpisode ? episodeCount : 1
      return {
        ...service,
        qtyLabel: service.perEpisode ? `${qty} cap.` : qty,
        subtotal: service.price * qty,
        removable: true,
      }
    })

  const allRows = [...coreRows, ...extraFeeRows, ...discountRows, ...serviceRows]
  const subtotal = allRows.reduce((sum, row) => sum + row.subtotal, 0)
  const subtotalBruto = subtotal + discountAmount
  const iva = Math.round(subtotal * IVA_RATE)
  const total = subtotal + iva

  async function handleSubmit(event) {
    event.preventDefault()
    setSending(true)
    setError('')

    try {
      const lineItemsSummary = allRows
        .map((row) => `${row.title} x${row.qtyLabel || 1} — ${formatPrice(row.subtotal)}`)
        .join('\n')

      const formData = new FormData()
      formData.append('access_key', import.meta.env.VITE_WEB3FORMS_ACCESS_KEY)
      formData.append('subject', `Nueva cotización de podcast: ${form.name}`)
      formData.append('from_name', form.name)
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'services') return
        formData.append(key, value)
      })
      formData.append('servicios_cotizados', lineItemsSummary)
      formData.append('subtotal_estimado', formatPrice(subtotal))
      formData.append('iva_estimado', formatPrice(iva))
      formData.append('total_estimado', formatPrice(total))

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      if (!result.success) throw new Error('request-failed')

      trackEvent('cotizador_form_submit')
      setSubmitted(true)
    } catch {
      setError(
        'No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos directamente a ' +
          `${CONTACT_INFO.email}.`,
      )
    } finally {
      setSending(false)
    }
  }

  const availableServices = COTIZADOR_SERVICES.filter((s) => !form.services.includes(s.id))

  return (
    <main className="cotizador-page">
      <Seo
        title={COTIZADOR_INFO.seoTitle}
        description={COTIZADOR_INFO.seoDescription}
        path="/cotizador"
      />
      <div className="cotizador-layout">
        <aside
          className="cotizador-info"
          style={{
            backgroundImage: `url(${pageImages.cotizadorPodcast})`,
            // La foto original es panorámica (1920x1080) y este panel es angosto/alto,
            // así que "cover" con posición centrada recortaba solo el sillón vacío entre
            // los dos entrevistados. Este offset deja a la persona con el micrófono en cuadro.
            backgroundPosition: '18% 42%',
          }}
        >
          <div className="cotizador-info__panel">
            <div className="cotizador-info__brand">
              <span className="cotizador-info__logo" aria-hidden="true">
                ◈
              </span>
              <span className="cotizador-info__name">{BRAND}</span>
            </div>
            <h1 className="cotizador-info__title">{COTIZADOR_INFO.title}</h1>
            <span className="cotizador-info__rule" aria-hidden="true" />
            <p className="cotizador-info__subtitle">{COTIZADOR_INFO.subtitle}</p>
            <p className="cotizador-info__desc">{COTIZADOR_INFO.description}</p>
            <a href={`mailto:${CONTACT_INFO.email}`} className="cotizador-info__email">
              ✉ {CONTACT_INFO.email}
            </a>
          </div>
        </aside>

        <section className="cotizador-form-section">
          {submitted ? (
            <div className="cotizador-success">
              <h2>¡Solicitud enviada!</h2>
              <p>Te enviaremos tu cotización a {form.email}.</p>
            </div>
          ) : (
            <form className="cotizador-form" onSubmit={handleSubmit}>
              <div className="cotizador-form__row">
                <label className="cotizador-field">
                  <span>Nombre y apellido *</span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="cotizador-field">
                  <span>Teléfono *</span>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <div className="cotizador-form__row">
                <label className="cotizador-field">
                  <span>Correo *</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="cotizador-field">
                  <span>¿Cuántos capítulos estimas?</span>
                  <select name="episodes" value={form.episodes} onChange={handleChange}>
                    <option value="">Selecciona una opción</option>
                    {COTIZADOR_EPISODIOS_OPCIONES.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="cotizador-form__row">
                <label className="cotizador-field">
                  <span>Locación</span>
                  <select name="locacion" value={form.locacion} onChange={handleChange}>
                    {COTIZADOR_LOCACIONES.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="cotizador-field">
                  <span>Cantidad de micrófonos</span>
                  <select name="microfonos" value={form.microfonos} onChange={handleChange}>
                    {COTIZADOR_MICROFONOS_OPCIONES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="cotizador-form__row">
                <label className="cotizador-field">
                  <span>Tipo de servicio</span>
                  <select name="tipoServicio" value={form.tipoServicio} onChange={handleChange}>
                    {COTIZADOR_TIPOS_SERVICIO.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="cotizador-field">
                  <span>Cantidad de cámaras</span>
                  <select name="camaras" value={form.camaras} onChange={handleChange}>
                    {COTIZADOR_CAMARAS_OPCIONES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="cotizador-field">
                <span>¿Cuántos clips/reels te interesan?</span>
                <select name="clips" value={form.clips} onChange={handleChange}>
                  <option value="">Selecciona una opción</option>
                  {COTIZADOR_CLIPS_OPCIONES.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>

              <div className="cotizador-field">
                <span>¿Qué servicios adicionales te interesan?</span>
                <select value={serviceToAdd} onChange={handleServiceSelect}>
                  <option value="">Selecciona un servicio para agregar</option>
                  {availableServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title} — {formatPrice(service.price)}
                      {service.perEpisode ? ' / capítulo' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="cotizador-summary-wrap">
                <ul className="cotizador-resumen">
                  <li>
                    {locacion.title} — {microfonos} micrófono{microfonos > 1 ? 's' : ''}
                  </li>
                  <li>
                    {tipoServicio.title} — {camaras} cámara{camaras !== 1 ? 's' : ''}
                  </li>
                  <li>
                    {episodeCount} capítulo{episodeCount > 1 ? 's' : ''}
                  </li>
                  {streamingExtra > 0 && <li>Cargo fijo de streaming incluido</li>}
                  {serviceRows.length === 0 && (
                    <li className="cotizador-resumen__empty">
                      Aún no agregas servicios adicionales.
                    </li>
                  )}
                  {serviceRows.map((row) => (
                    <li key={row.id} className="cotizador-resumen__extra">
                      <span>
                        {row.title}
                        {row.perEpisode ? ` (${episodeCount} cap.)` : ''}
                      </span>
                      <button
                        type="button"
                        className="cotizador-resumen__remove"
                        onClick={() => handleServiceRemove(row.id)}
                        aria-label={`Quitar ${row.title}`}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="cotizador-summary">
                  <div className="cotizador-summary__line">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotalBruto)}</span>
                  </div>
                  <div className="cotizador-summary__line cotizador-summary__line--discount">
                    <span>Descuentos aplicados{discountAmount > 0 ? ` (${tramo.label})` : ''}</span>
                    <span>{formatPrice(discountAmount > 0 ? -discountAmount : 0)}</span>
                  </div>
                  <div className="cotizador-summary__line">
                    <span>IVA (19%)</span>
                    <span>{formatPrice(iva)}</span>
                  </div>
                  <div className="cotizador-summary__total">
                    <span>Total estimado</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <label className="cotizador-field">
                <span>Cuéntanos sobre tu proyecto *</span>
                <textarea
                  name="about"
                  rows={4}
                  value={form.about}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="cotizador-field">
                <span>Detalles que necesites contarnos</span>
                <textarea name="details" rows={4} value={form.details} onChange={handleChange} />
              </label>

              {error && <p className="cotizador-form__error">{error}</p>}

              <button
                type="submit"
                className="button button--accent cotizador-form__submit"
                disabled={sending}
              >
                {sending ? 'Enviando…' : 'Enviar →'}
              </button>
            </form>
          )}
        </section>
      </div>

      <footer className="cotizador-footer">
        <p>
          Copyright © {new Date().getFullYear()} {BRAND}
        </p>
      </footer>
    </main>
  )
}
