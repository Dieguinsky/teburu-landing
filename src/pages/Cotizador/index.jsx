import { useState } from 'react'
import {
  BRAND,
  COTIZADOR_INFO,
  CONTACT_INFO,
  COTIZADOR_SERVICES,
  COTIZADOR_EPISODIOS_OPCIONES,
  COTIZADOR_CLIPS_OPCIONES,
} from '../../content/copy'
import { pageImages } from '../../assets/pageImages'
import Seo from '../../components/Seo'
import { trackEvent } from '../../lib/analytics'
import './Cotizador.scss'

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

  async function handleSubmit(event) {
    event.preventDefault()
    setSending(true)
    setError('')

    try {
      const serviceLabels = COTIZADOR_SERVICES.filter((s) => form.services.includes(s.id)).map(
        (s) => s.title,
      )

      const formData = new FormData()
      formData.append('access_key', import.meta.env.VITE_WEB3FORMS_ACCESS_KEY)
      formData.append('subject', `Nueva cotización de podcast: ${form.name}`)
      formData.append('from_name', form.name)
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'services') return
        formData.append(key, value)
      })
      formData.append('servicios_interes', serviceLabels.join(', ') || 'Sin especificar')

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
          style={{ backgroundImage: `url(${pageImages.audiovisual.podcast})` }}
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
                      {service.title}
                    </option>
                  ))}
                </select>

                <div className="cotizador-chips">
                  {form.services.length === 0 && (
                    <p className="cotizador-chips__empty">Aún no agregas servicios.</p>
                  )}
                  {form.services.map((id) => {
                    const service = COTIZADOR_SERVICES.find((s) => s.id === id)
                    if (!service) return null
                    return (
                      <div className="cotizador-chip" key={id}>
                        <span>{service.title}</span>
                        <button
                          type="button"
                          className="cotizador-chip__remove"
                          onClick={() => handleServiceRemove(id)}
                          aria-label={`Quitar ${service.title}`}
                        >
                          ✕
                        </button>
                      </div>
                    )
                  })}
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
