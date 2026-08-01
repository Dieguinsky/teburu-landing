import { useState } from 'react'
import Seo from '../../components/Seo'
import { pageImages } from '../../assets/pageImages'
import { BRAND, CONTACT_INFO } from '../../content/copy'
import { trackEvent } from '../../lib/analytics'
import './Contacto.scss'

const initialForm = {
  name: '',
  project: '',
  phone: '',
  email: '',
  about: '',
  details: '',
}

export default function Contacto() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  function handleChange({ target: { name, value } }) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSending(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('access_key', import.meta.env.VITE_WEB3FORMS_ACCESS_KEY)
      formData.append('subject', `Nuevo contacto: ${form.name}`)
      formData.append('from_name', form.name)
      Object.entries(form).forEach(([key, value]) => formData.append(key, value))

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      if (!result.success) throw new Error('request-failed')

      trackEvent('contact_form_submit')
      setSubmitted(true)
    } catch {
      setError(
        'No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos directamente a ' +
          `${CONTACT_INFO.email}.`,
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="contacto-page">
      <Seo
        title={CONTACT_INFO.seoTitle}
        description={CONTACT_INFO.seoDescription}
        path="/contacto"
      />
      <div className="contacto-layout">
        <aside
          className="contacto-info"
          style={{ backgroundImage: `url(${pageImages.contactoBg})` }}
        >
          <div className="contacto-info__panel">
            <h1 className="contacto-info__title">{CONTACT_INFO.title}</h1>
            <span className="contacto-info__rule" aria-hidden="true" />
            <p className="contacto-info__subtitle">{CONTACT_INFO.subtitle}</p>
            <p className="contacto-info__desc">{CONTACT_INFO.description}</p>
            <a href={`mailto:${CONTACT_INFO.email}`} className="contacto-info__email">
              ✉ {CONTACT_INFO.email}
            </a>
            <span className="contacto-info__rule" aria-hidden="true" />
            <p className="contacto-info__social-label">{CONTACT_INFO.socialLabel}</p>
            <a
              href={CONTACT_INFO.instagram}
              target="_blank"
              rel="noreferrer"
              className="contacto-info__social"
              aria-label="Instagram"
            >
              Instagram
            </a>
          </div>
        </aside>

        <section className="contacto-form-section">
          {submitted ? (
            <div className="contacto-success">
              <h2>¡Mensaje enviado!</h2>
              <p>Te contactaremos pronto a {form.email}.</p>
            </div>
          ) : (
            <form className="contacto-form" onSubmit={handleSubmit}>
              <div className="contacto-form__row">
                <label className="contacto-field">
                  <span>Nombre y apellido *</span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="contacto-field">
                  <span>Proyecto/Empresa</span>
                  <input
                    type="text"
                    name="project"
                    value={form.project}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className="contacto-form__row">
                <label className="contacto-field">
                  <span>Teléfono *</span>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="contacto-field">
                  <span>Correo *</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <label className="contacto-field">
                <span>Cuéntanos sobre tu proyecto *</span>
                <textarea
                  name="about"
                  rows={4}
                  value={form.about}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="contacto-field">
                <span>Detalles que necesites contarnos</span>
                <textarea
                  name="details"
                  rows={4}
                  value={form.details}
                  onChange={handleChange}
                />
              </label>

              {error && <p className="contacto-form__error">{error}</p>}

              <button
                type="submit"
                className="button button--accent contacto-form__submit"
                disabled={sending}
              >
                {sending ? 'Enviando…' : 'Enviar →'}
              </button>
            </form>
          )}
        </section>
      </div>

      <footer className="contacto-footer">
        <p>Copyright © {new Date().getFullYear()} {BRAND}</p>
      </footer>
    </main>
  )
}
