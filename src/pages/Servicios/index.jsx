import { Link } from 'react-router-dom'
import { serviciosImages } from '../../assets/serviciosImages'
import { BRAND, SERVICIOS_INTRO, STUDIO_SERVICES, PODCAST_SERVICES } from '../../content/copy'
import ABMasterComparator from '../../components/ABMasterComparator'
import './Servicios.scss'

function ServiceCard({ title, description, image }) {
  return (
    <article
      className="servicios-card"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="servicios-card__overlay" />
      <div className="servicios-card__content">
        <h3 className="servicios-card__title">{title}</h3>
        <span className="servicios-card__rule" aria-hidden="true" />
        <p className="servicios-card__desc">{description}</p>
      </div>
    </article>
  )
}

export default function Servicios() {
  return (
    <main className="servicios-page">
      <section
        className="servicios-hero"
        style={{ backgroundImage: `url(${serviciosImages.hero})` }}
      >
        <div className="servicios-hero__overlay" />
        <h1 className="servicios-hero__title">Servicios</h1>
      </section>

      <section className="servicios-intro">
        <div className="servicios-intro__inner">
          <h2 className="section-title servicios-intro__title">
            {SERVICIOS_INTRO.title}
          </h2>
          {SERVICIOS_INTRO.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="servicios-intro__text">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="servicios-catalog">
        <div className="servicios-catalog__inner">
          <h2 className="section-title servicios-catalog__heading">Sesión de estudio</h2>

          <div className="servicios-grid">
            {STUDIO_SERVICES.map(({ id, title, description, imageKey }) => (
              <ServiceCard
                key={id}
                title={title}
                description={description}
                image={serviciosImages[imageKey]}
              />
            ))}
          </div>

          <hr className="servicios-divider" />

          <h2 className="section-title servicios-catalog__heading">Podcast</h2>

          <div className="servicios-grid">
            {PODCAST_SERVICES.map(({ id, title, description, imageKey }) => (
              <ServiceCard
                key={id}
                title={title}
                description={description}
                image={serviciosImages[imageKey]}
              />
            ))}
          </div>
        </div>
      </section>

      <ABMasterComparator />

      <section className="servicios-cta">
        <div className="servicios-cta__inner">
          <h2 className="servicios-cta__title">¿Listo/a para hacer tu música?</h2>
          <p className="servicios-cta__email">contacto@estudioteburu.cl</p>
          <Link to="/contacto" className="button button--accent">
            Formulario de contacto
          </Link>
        </div>
      </section>

      <footer className="servicios-footer">
        <p>Copyright © {new Date().getFullYear()} {BRAND}</p>
      </footer>
    </main>
  )
}
