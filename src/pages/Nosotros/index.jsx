import { Link } from 'react-router-dom'
import Reveal from '../../components/Reveal'
import Seo from '../../components/Seo'
import { pageImages } from '../../assets/pageImages'
import {
  BRAND,
  NOSOTROS_PHILOSOPHY,
  NOSOTROS_INTRO,
  TEAM_MEMBERS,
  NOSOTROS_JOIN,
} from '../../content/copy'
import './Nosotros.scss'

const PHILOSOPHY_HIGHLIGHT = 'hacer música'

export default function Nosotros() {
  return (
    <main className="nosotros-page">
      <Seo
        title={NOSOTROS_INTRO.seoTitle}
        description={NOSOTROS_INTRO.seoDescription}
        path="/nosotros"
      />
      <section
        className="nosotros-hero"
        style={{ backgroundImage: `url(${pageImages.nosotrosHero})` }}
      >
        <div className="nosotros-hero__overlay" />
        <h1 className="nosotros-hero__title">Nosotros</h1>
      </section>

      <section className="nosotros-philosophy">
        <Reveal as="div" className="nosotros-philosophy__inner">
          <h2 className="section-title nosotros-philosophy__title">
            {NOSOTROS_PHILOSOPHY.title}
          </h2>
          {NOSOTROS_PHILOSOPHY.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 28)} className="nosotros-philosophy__text">
              {paragraph.split(PHILOSOPHY_HIGHLIGHT).reduce((acc, part, i) => (
                i === 0
                  ? [part]
                  : [...acc, <strong key={i}>{PHILOSOPHY_HIGHLIGHT}</strong>, part]
              ), [])}
            </p>
          ))}
        </Reveal>
      </section>

      <section className="nosotros-intro">
        <Reveal as="div" className="nosotros-intro__inner">
          {NOSOTROS_INTRO.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 28)} className="nosotros-intro__text">
              {paragraph}
            </p>
          ))}
          <Link to="/contacto" className="button">
            ¡Hablemos!
          </Link>
        </Reveal>
      </section>

      <section className="nosotros-team">
        <div className="nosotros-team__inner">
          <Reveal as="h2" className="section-title nosotros-team__title">
            El equipo
          </Reveal>
          <div className="nosotros-team__grid">
            {TEAM_MEMBERS.map(({ id, name, alias, role, bio, imageKey }, index) => (
              <Reveal as="article" key={id} className="nosotros-team__member" delay={index * 100}>
                <img
                  src={pageImages.team[imageKey]}
                  alt={name}
                  className="nosotros-team__photo"
                  loading="lazy"
                />
                <h3 className="nosotros-team__name">
                  {name}
                  {alias && <span className="nosotros-team__alias"> · {alias}</span>}
                </h3>
                <p className="nosotros-team__role">{role}</p>
                <p className="nosotros-team__bio">{bio}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Reveal as="section" className="nosotros-join" bg={pageImages.contactoBg}>
        <div className="nosotros-join__overlay" />
        <div className="nosotros-join__inner">
          <h2 className="section-title nosotros-join__title">{NOSOTROS_JOIN.title}</h2>
          <p className="nosotros-join__subtitle">{NOSOTROS_JOIN.subtitle}</p>
          <div className="nosotros-join__roles">
            {NOSOTROS_JOIN.roles.map((role) => (
              <article key={role} className="nosotros-join__role">
                <span className="nosotros-join__icon" aria-hidden="true">
                  ◆
                </span>
                <h3>{role}</h3>
              </article>
            ))}
          </div>
          <Link to="/contacto" className="button">
            Escríbenos
          </Link>
        </div>
      </Reveal>

      <footer className="nosotros-footer">
        <p>Copyright © {new Date().getFullYear()} {BRAND}</p>
      </footer>
    </main>
  )
}
