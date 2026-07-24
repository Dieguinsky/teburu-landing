import { Link } from 'react-router-dom'
import Reveal from '../../../../components/Reveal'
import { homeImages } from '../../../../assets/homeImages'
import { BRAND, HOME_STUDIO } from '../../../../content/copy'
import './Studio.scss'

export default function Studio() {
  return (
    <section className="studio">
      <Reveal as="div" className="studio__header">
        <h2 className="section-title studio__title">{HOME_STUDIO.title}</h2>
        <p className="studio__text">{HOME_STUDIO.text}</p>
      </Reveal>
      <div className="studio__gallery">
        {homeImages.studioGallery.map((src, index) => (
          <Reveal as="figure" key={src} className="studio__figure" delay={index * 90}>
            <img src={src} alt={`${BRAND} - estudio ${index + 1}`} loading="lazy" />
          </Reveal>
        ))}
      </div>
      <div className="studio__cta">
        <Link to="/estudio" className="button">
          {HOME_STUDIO.cta}
        </Link>
      </div>
    </section>
  )
}
