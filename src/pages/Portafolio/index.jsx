import { pageImages } from '../../assets/pageImages'
import {
  BRAND,
  PORTAFOLIO_MUSIC,
  PORTAFOLIO_AUDIOVISUAL,
} from '../../content/copy'
import './Portafolio.scss'

export default function Portafolio() {
  return (
    <main className="portafolio-page">
      <section
        className="portafolio-hero"
        style={{ backgroundImage: `url(${pageImages.portafolioHero})` }}
      >
        <div className="portafolio-hero__overlay" />
        <h1 className="portafolio-hero__title">Portafolio</h1>
      </section>

      <section className="portafolio-music">
        <div className="portafolio-music__inner">
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
        </div>
      </section>

      <section className="portafolio-av">
        <div className="portafolio-av__inner">
          <h2 className="section-title portafolio-av__title">
            {PORTAFOLIO_AUDIOVISUAL.title}
          </h2>
          <p className="portafolio-av__desc">{PORTAFOLIO_AUDIOVISUAL.description}</p>
          <div className="portafolio-av__grid">
            {PORTAFOLIO_AUDIOVISUAL.items.map(({ id, title, text, imageKey }) => (
              <article
                key={id}
                className="portafolio-av__card"
                style={{
                  backgroundImage: `url(${pageImages.audiovisual[imageKey]})`,
                }}
              >
                <div className="portafolio-av__card-overlay" />
                <div className="portafolio-av__card-content">
                  <h3>{title}</h3>
                  <span className="portafolio-av__rule" aria-hidden="true" />
                  <p>{text}</p>
                </div>
              </article>
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
