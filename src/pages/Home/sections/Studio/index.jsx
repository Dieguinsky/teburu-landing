import { Link } from 'react-router-dom'
import { homeImages } from '../../../../assets/homeImages'
import { LOREM_LONG, LOREM_SHORT } from '../../../../content/copy'
import './Studio.scss'

export default function Studio() {
  return (
    <section className="studio">
      <div className="studio__header">
        <h2 className="section-title studio__title">{LOREM_SHORT}</h2>
        <p className="studio__text">asdb7yabsduyadbaysudbasydbyuadb</p>
      </div>
      <div className="studio__gallery">
        {homeImages.studioGallery.map((src, index) => (
          <figure key={src} className="studio__figure">
            <img src={src} alt={`${LOREM_SHORT} ${index + 1}`} />
          </figure>
        ))}
      </div>
      <div className="studio__cta">
        <Link to="/estudio" className="button">
          {LOREM_SHORT}
        </Link>
      </div>
    </section>
  )
}
