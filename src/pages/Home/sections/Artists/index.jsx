import { Link } from 'react-router-dom'
import { homeImages } from '../../../../assets/homeImages'
import { LOREM_LONG, LOREM_SHORT } from '../../../../content/copy'
import './Artists.scss'

const portfolioLogos = Object.entries(
  import.meta.glob('../../../../assets/img/logos/plano/*.png', {
    eager: true,
    import: 'default',
  }),
).map(([path, src]) => ({ key: path, src }))

export default function Artists() {
  return (
    <section
      className="artists"
      style={{ backgroundImage: `url(${homeImages.artistsBg})` }}
    >
      <div className="artists__overlay" />
      <div className="artists__layout">
        <div className="artists__copy">
          <h2 className="section-title artists__title">{LOREM_SHORT}</h2>
          <p className="artists__text">{LOREM_LONG}</p>
          <Link to="/artistas" className="button button--accent">
            {LOREM_SHORT}
          </Link>
        </div>
        <div className="artists__grid">
          {portfolioLogos.map(({ key, src }) => (
            <img key={key} src={src} alt="" className="artists__logo" />
          ))}
        </div>
      </div>
    </section>
  )
}
