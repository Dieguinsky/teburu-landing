import Reveal from '../../components/Reveal'
import Seo from '../../components/Seo'
import { pageImages } from '../../assets/pageImages'
import {
  BRAND,
  PORTAFOLIO_SEO,
  PORTAFOLIO_MUSIC,
  PORTAFOLIO_AUDIOVISUAL,
  PORTAFOLIO_TRABAJOS,
} from '../../content/copy'
import './Portafolio.scss'

export default function Portafolio() {
  return (
    <main className="portafolio-page">
      <Seo
        title={PORTAFOLIO_SEO.seoTitle}
        description={PORTAFOLIO_SEO.seoDescription}
        path="/portafolio"
      />
      <section
        className="portafolio-hero"
        style={{ backgroundImage: `url(${pageImages.portafolioHero})` }}
      >
        <div className="portafolio-hero__overlay" />
        <h1 className="portafolio-hero__title">Portafolio</h1>
      </section>

      <section className="portafolio-music">
        <Reveal as="div" className="portafolio-music__inner">
          <h2 className="section-title portafolio-music__title">
            {PORTAFOLIO_MUSIC.title}
          </h2>
          <p className="portafolio-music__desc">{PORTAFOLIO_MUSIC.description}</p>
          <div className="portafolio-spotify">
            <iframe
              title="Playlist Teburu"
              src={PORTAFOLIO_MUSIC.spotifyPlaylistUrl}
              width="100%"
              height="380"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </Reveal>
      </section>

      <section className="portafolio-av">
        <div className="portafolio-av__inner">
          <Reveal as="h2" className="section-title portafolio-av__title">
            {PORTAFOLIO_AUDIOVISUAL.title}
          </Reveal>
          <p className="portafolio-av__desc">{PORTAFOLIO_AUDIOVISUAL.description}</p>
          <div className="portafolio-av__grid">
            {PORTAFOLIO_AUDIOVISUAL.items.map(({ id, title, text, imageKey }, index) => {
              const loopSrc = pageImages.audiovisualVideo[imageKey]
              return (
                <Reveal as="article" key={id} className="portafolio-av__card" delay={index * 90}>
                  {loopSrc ? (
                    <video
                      className="portafolio-av__card-media"
                      src={loopSrc}
                      poster={pageImages.audiovisual[imageKey]}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      className="portafolio-av__card-media"
                      src={pageImages.audiovisual[imageKey]}
                      alt={title}
                      loading="lazy"
                    />
                  )}
                  <div className="portafolio-av__card-overlay" />
                  <div className="portafolio-av__card-content">
                    <h3>{title}</h3>
                    <span className="portafolio-av__rule" aria-hidden="true" />
                    <p>{text}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="portafolio-trabajos">
        <div className="portafolio-trabajos__inner">
          <Reveal as="h2" className="section-title portafolio-trabajos__title">
            {PORTAFOLIO_TRABAJOS.title}
          </Reveal>
          <p className="portafolio-trabajos__desc">{PORTAFOLIO_TRABAJOS.description}</p>
          <div className="portafolio-trabajos__grid">
            {PORTAFOLIO_TRABAJOS.items.map(({ id, client, text, imageKey, url }, index) => (
              <Reveal
                as="a"
                key={id}
                className="portafolio-trabajos__card"
                delay={(index % 6) * 70}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver en Instagram: ${client}`}
              >
                <img
                  className="portafolio-trabajos__card-media"
                  src={pageImages.reels[imageKey]}
                  alt={`${client} — ${text}`}
                  loading="lazy"
                />
                <div className="portafolio-trabajos__card-overlay" />
                <span className="portafolio-trabajos__card-badge">IG</span>
                <div className="portafolio-trabajos__card-content">
                  <h3>{client}</h3>
                  <span className="portafolio-trabajos__rule" aria-hidden="true" />
                  <p>{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <footer className="portafolio-footer">
        <p>Copyright © {new Date().getFullYear()} {BRAND}</p>
      </footer>
    </main>
  )
}
