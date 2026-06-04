import { homeImages } from '../../../../assets/homeImages'
import { BRAND_SHORT, LOREM_SHORT } from '../../../../content/copy'
import './Hero.scss'

export default function Hero() {
  return (
    <section className="hero" style={{ backgroundImage: `url(${homeImages.hero})` }}>
      <div className="hero__overlay" />
      <div className="hero__content">
        <h1 className="hero__title">{BRAND_SHORT}</h1>
        <div className="hero__rule" />
        <p className="hero__tagline">{LOREM_SHORT}</p>
      </div>
      <span className="hero__scroll" aria-hidden="true">
        ⌄
      </span>
    </section>
  )
}
