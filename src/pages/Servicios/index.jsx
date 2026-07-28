import { Link } from 'react-router-dom'
import Reveal from '../../components/Reveal'
import Seo from '../../components/Seo'
import { serviciosImages } from '../../assets/serviciosImages'
import {
  BRAND,
  SERVICIOS_INTRO,
  STUDIO_SERVICES,
  SERVICIOS_MUSICA_CTAS,
  PODCAST_SERVICES,
  SERVICIOS_PODCAST_CTAS,
  AUDIOVISUAL_SERVICES,
  SERVICIOS_AUDIOVISUAL_CTAS,
  CONTACT_INFO,
} from '../../content/copy'
import ABMasterComparator from '../../components/ABMasterComparator'
import './Servicios.scss'

const SERVICE_CATEGORIES = [
  { id: 'musica', heading: 'Música', services: STUDIO_SERVICES, ctas: SERVICIOS_MUSICA_CTAS },
  { id: 'podcast', heading: 'Podcast', services: PODCAST_SERVICES, ctas: SERVICIOS_PODCAST_CTAS },
  {
    id: 'audiovisual',
    heading: 'Audiovisual',
    services: AUDIOVISUAL_SERVICES,
    ctas: SERVICIOS_AUDIOVISUAL_CTAS,
  },
]

function scrollToComparator() {
  document.getElementById('ab-comparator')?.scrollIntoView({ behavior: 'smooth' })
}

function ServiceCard({ title, description, image, delay }) {
  return (
    <Reveal as="article" className="servicios-card" bg={image} delay={delay}>
      <div className="servicios-card__overlay" />
      <div className="servicios-card__content">
        <h3 className="servicios-card__title">{title}</h3>
        <span className="servicios-card__rule" aria-hidden="true" />
        <p className="servicios-card__desc">{description}</p>
      </div>
    </Reveal>
  )
}

export default function Servicios() {
  return (
    <main className="servicios-page">
      <Seo
        title={SERVICIOS_INTRO.seoTitle}
        description={SERVICIOS_INTRO.seoDescription}
        path="/servicios"
      />
      <section
        className="servicios-hero"
        style={{ backgroundImage: `url(${serviciosImages.hero})` }}
      >
        <div className="servicios-hero__overlay" />
        <h1 className="servicios-hero__title">Servicios</h1>
        <button type="button" className="servicios-hero__subtitle" onClick={scrollToComparator}>
          Escucha cómo sonaría tu canción trabajada en Teburu
        </button>
      </section>

      <section className="servicios-intro">
        <Reveal as="div" className="servicios-intro__inner">
          <h2 className="section-title servicios-intro__title">
            {SERVICIOS_INTRO.title}
          </h2>
          {SERVICIOS_INTRO.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="servicios-intro__text">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </section>

      <section className="servicios-catalog">
        <div className="servicios-catalog__inner">
          {SERVICE_CATEGORIES.map(({ id, heading, services, ctas }) => (
            <div className="servicios-category" key={id}>
              <Reveal as="h2" id={id} className="section-title servicios-catalog__heading">
                {heading}
              </Reveal>

              <div
                className={`servicios-grid${services.length === 4 ? ' servicios-grid--four' : ''}`}
              >
                {services.map(({ id: serviceId, title, description, imageKey }, index) => (
                  <ServiceCard
                    key={serviceId}
                    title={title}
                    description={description}
                    image={serviciosImages[imageKey]}
                    delay={index * 90}
                  />
                ))}
              </div>

              <div className="servicios-catalog__cta">
                {ctas.map(({ label, to }) => (
                  <Link key={to} to={to} className="button button--accent">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <ABMasterComparator />

      <section className="servicios-cta">
        <Reveal as="div" className="servicios-cta__inner">
          <h2 className="servicios-cta__title">¿Listo/a para hacer tu música?</h2>
          <p className="servicios-cta__email">{CONTACT_INFO.email}</p>
          <Link to="/contacto" className="button button--accent">
            Formulario de contacto
          </Link>
        </Reveal>
      </section>

      <footer className="servicios-footer">
        <p>Copyright © {new Date().getFullYear()} {BRAND}</p>
      </footer>
    </main>
  )
}
