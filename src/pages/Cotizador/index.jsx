import { useState } from 'react'
import {
  BRAND,
  COTIZADOR_INFO,
  CONTACT_INFO,
  COTIZADOR_SERVICES,
  COTIZADOR_QUANTITY_ITEMS,
  COTIZADOR_EPISODIOS_OPCIONES,
  COTIZADOR_CLIPS_OPCIONES,
} from '../../content/copy'
import { pageImages } from '../../assets/pageImages'
import Seo from '../../components/Seo'
import { trackEvent } from '../../lib/analytics'
import { formatPrice } from '../../components/BookingFlow/useBookingFlow'
import './Cotizador.scss'

const IVA_RATE = 0.19

const initialQuantities = Object.fromEntries(
  COTIZADOR_QUANTITY_ITEMS.map((item) => [item.id, item.defaultQty]),
)

const initialForm = {
  name: '',
  email: '',
  phone: '',
  episodes: '',
  clips: '',
  about: '',
  details: '',
  services: [],
}

export default function Cotizador() {
  const [form, setForm] = useState(initialForm)
  const [quantities, setQuantities] = useState(initialQuantities)
  const [serviceToAdd, setServiceToAdd] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  function handleChange({ target: { name, value } }) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleQuantityChange(id, delta) {
    const item = COTIZADOR_QUANTITY_ITEMS.find((i) => i.id === id)
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.min(item.max, Math.max(item.min, prev[id] + delta)),
    }))
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

  const quantityRows = COTIZADOR_QUANTITY_ITEMS.map((item) => ({
    ...item,
    qty: quantities[item.id],
    subtotal: item.price * quantities[item.id],
  }))

  const serviceRows = form.services
    .map((id) => COTIZADOR_SERVICES.find((s) => s.id === id))
    .filter(Boolean)
    .map((service) => {
      const qty = service.perEpisode ? episodeCount : 1
      return { ...service, qty, subtotal: service.price * qty }
    })

  const allRows = [...quantityRows, ...serviceRows]
  const subtotal = allRows.reduce((sum, row) => sum + row.subtotal, 0)
  const iva = Math.round(subtotal * IVA_RATE)
  const total = subtotal + iva

  async function handleSubmit(event) {
    event.preventDefault()
    setSending(true)
    setError('')

    try {
      const lineItemsSummary = allRows
        .filter((row) => row.qty > 0)
        .map((row) => `${row.title} x${row.qty} — ${formatPrice(row.subtotal)}`)
        .join('\n')

      const formData = new FormData()
      formData.append('access_key', import.meta.env.VITE_WEB3FORMS_ACCESS_KEY)
      formData.append('subject', `Nueva cotización de podcast: ${form.name}`)
      formData.append('from_name', form.name)
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'services') return
        formData.append(key, value)
      })
      formData.append('servicios_cotizados', lineItemsSummary || 'Sin servicios agregados')
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
                <span>¿Qué servicios te interesan?</span>
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

              <div className="cotizador-table-wrap">
                <div className="cotizador-table-scroll">
                  <table className="cotizador-table">
                    <thead>
                      <tr>
                        <th>Servicio</th>
                        <th>Cantidad</th>
                        <th>Precio unit.</th>
                        <th>Subtotal</th>
                        <th aria-hidden="true" />
                      </tr>
                    </thead>
                    <tbody>
                      {quantityRows.map((row) => (
                        <tr key={row.id}>
                          <td>{row.title}</td>
                          <td>
                            <div className="cotizador-stepper">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(row.id, -1)}
                                disabled={row.qty <= row.min}
                                aria-label={`Restar ${row.title}`}
                              >
                                −
                              </button>
                              <span>{row.qty}</span>
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(row.id, 1)}
                                disabled={row.qty >= row.max}
                                aria-label={`Sumar ${row.title}`}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td>{formatPrice(row.price)}</td>
                          <td>{formatPrice(row.subtotal)}</td>
                          <td />
                        </tr>
                      ))}
                      {serviceRows.length === 0 && (
                        <tr className="cotizador-table__empty-row">
                          <td colSpan={5}>Aún no agregas servicios adicionales.</td>
                        </tr>
                      )}
                      {serviceRows.map((row) => (
                        <tr key={row.id}>
                          <td>{row.title}</td>
                          <td>
                            {row.qty}
                            {row.perEpisode ? ' cap.' : ''}
                          </td>
                          <td>{formatPrice(row.price)}</td>
                          <td>{formatPrice(row.subtotal)}</td>
                          <td>
                            <button
                              type="button"
                              className="cotizador-table__remove"
                              onClick={() => handleServiceRemove(row.id)}
                              aria-label={`Quitar ${row.title}`}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="cotizador-summary">
                  <div className="cotizador-summary__line">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="cotizador-summary__line">
                    <span>IVA (19%)</span>
                    <span>{formatPrice(iva)}</span>
                  </div>
                  <div className="cotizador-summary__total">
                    <span>Total estimado</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <p className="cotizador-summary__hint">
                    Estimación referencial. Los servicios marcados "cap." se multiplican por la
                    cantidad de capítulos que elijas arriba. La cotización final puede variar
                    según tu proyecto.
                  </p>
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
