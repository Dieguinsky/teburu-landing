import { Link } from 'react-router-dom'
import Reveal from '../../components/Reveal'
import { pageImages } from '../../assets/pageImages'
import { BRAND, ESTUDIO_INTRO, ESTUDIO_GEAR, ESTUDIO_VIDEO_GEAR } from '../../content/copy'
import './Estudio.scss'

export default function Estudio() {
  return (
    <main className="estudio-page">
      <section
        className="estudio-hero"
        style={{ backgroundImage: `url(${pageImages.estudioHero})` }}
      >
        <div className="estudio-hero__overlay" />
        <h1 className="estudio-hero__title">Estudio</h1>
      </section>

      <section className="estudio-intro">
        <Reveal as="div" className="estudio-intro__inner">
          <h2 className="section-title estudio-intro__title">{ESTUDIO_INTRO.title}</h2>
          {ESTUDIO_INTRO.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="estudio-intro__text">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </section>

      <section className="estudio-gallery">
        <div className="estudio-gallery__grid">
          {pageImages.estudioGallery.map((src, index) => (
            <Reveal as="figure" key={src} className="estudio-gallery__figure" delay={index * 90}>
              <img src={src} alt={`${BRAND} - estudio ${index + 1}`} loading="lazy" />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="estudio-gear">
        <div className="estudio-gear__inner">
          <Reveal as="h2" className="section-title estudio-gear__heading">
            Equipamiento
          </Reveal>
          <div className="estudio-gear__grid">
            {ESTUDIO_GEAR.map(({ category, items }, index) => (
              <Reveal as="article" key={category} className="estudio-gear__card" delay={index * 90}>
                <h3 className="estudio-gear__category">{category}</h3>
                <ul className="estudio-gear__list">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="estudio-video">
        <Reveal as="div" className="estudio-video__inner">
          <h2 className="section-title estudio-video__heading">{ESTUDIO_VIDEO_GEAR.title}</h2>
          <p className="estudio-video__text">{ESTUDIO_VIDEO_GEAR.text}</p>
          <ul className="estudio-video__list">
            {ESTUDIO_VIDEO_GEAR.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="estudio-cta">
        <Reveal as="div" className="estudio-cta__inner">
          <h2 className="estudio-cta__title">¿Listo/a para grabar?</h2>
          <p className="estudio-cta__text">Reserva el estudio o cuéntanos tu proyecto y te ayudamos a planificarlo.</p>
          <div className="estudio-cta__actions">
            <Link to="/reservar" className="button button--accent">
              Reservar estudio
            </Link>
            <Link to="/contacto" className="button">
              Formulario de contacto
            </Link>
          </div>
        </Reveal>
      </section>

      <footer className="estudio-footer">
        <p>Copyright © {new Date().getFullYear()} {BRAND}</p>
      </footer>
    </main>
  )
}
