import { Link } from 'react-router-dom'
import { albumCovers, homeImages } from '../../../../assets/homeImages'
import { ARTISTS_SECTION } from '../../../../content/copy'
import './Artists.scss'

export default function Artists() {
  return (
    <section
      className="artists"
      style={{ backgroundImage: `url(${homeImages.artistsBg})` }}
    >
      <div className="artists__overlay" />
      <div className="artists__layout">
        <div className="artists__copy">
          <h2 className="section-title artists__title">{ARTISTS_SECTION.title}</h2>
          <p className="artists__text">{ARTISTS_SECTION.text}</p>
          <Link to="/portafolio" className="button button--accent">
            {ARTISTS_SECTION.cta}
          </Link>
        </div>
        <div className="artists__grid">
          {albumCovers.map(({ key, title, src }) => (
            <img key={key} src={src} alt={title} className="artists__cover" />
          ))}
        </div>
      </div>
    </section>
  )
}
