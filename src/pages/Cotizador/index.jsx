import { BRAND, COTIZADOR_INFO, CONTACT_INFO } from '../../content/copy'
import Seo from '../../components/Seo'
import { trackEvent } from '../../lib/analytics'
import './Cotizador.scss'

export default function Cotizador() {
  return (
    <main className="cotizador-page">
      <Seo
        title={COTIZADOR_INFO.seoTitle}
        description={COTIZADOR_INFO.seoDescription}
        path="/cotizador"
      />
      <div className="cotizador-layout">
        <aside className="cotizador-sidebar">
          <div className="cotizador-sidebar__brand">
            <span className="cotizador-sidebar__logo" aria-hidden="true">
              ◈
            </span>
            <span className="cotizador-sidebar__name">{BRAND}</span>
          </div>

          <p className="cotizador-sidebar__help">
            ¿Tienes alguna pregunta?
            <br />
            <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
          </p>
        </aside>

        <section className="cotizador-main">
          <h1 className="cotizador-main__title">{COTIZADOR_INFO.title}</h1>
          <span className="cotizador-main__rule" aria-hidden="true" />
          <h2 className="cotizador-main__subtitle">{COTIZADOR_INFO.subtitle}</h2>
          <p className="cotizador-main__desc">{COTIZADOR_INFO.description}</p>

          <div className="cotizador-main__actions">
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="button button--accent"
              onClick={() => trackEvent('quote_request_click')}
            >
              Escríbenos por correo
            </a>
          </div>
        </section>
      </div>

      <footer className="cotizador-footer">
        <p>Copyright © {new Date().getFullYear()} {BRAND}</p>
      </footer>
    </main>
  )
}
