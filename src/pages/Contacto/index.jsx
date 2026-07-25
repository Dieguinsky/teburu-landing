import { useState } from 'react'
import { pageImages } from '../../assets/pageImages'
import { BRAND, CONTACT_INFO } from '../../content/copy'
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

  function handleChange({ target: { name, value } }) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="contacto-page">
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
                  <span>Nombre & apellido *</span>
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

              <button type="submit" className="button button--accent contacto-form__submit">
                Enviar →
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
