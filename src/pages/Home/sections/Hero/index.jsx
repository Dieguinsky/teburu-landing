import { useState, useEffect } from 'react'
import { homeImages } from '../../../../assets/homeImages'
import { BRAND_SHORT, HERO_TAGLINE, BRAND_SHORT_JP, HERO_TAGLINE_JP } from '../../../../content/copy'
import './Hero.scss'

export default function Hero() {
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="hero" style={{ backgroundImage: `url(${homeImages.hero})` }}>
      <div className="hero__overlay" />
      <div className="hero__content">
        <div className="hero__text-container">
          <h1 className={`hero__title hero__title--japanese ${isTransitioning ? 'hero__title--fade-out' : ''}`}>
            {BRAND_SHORT_JP}
          </h1>
          <h1 className={`hero__title hero__title--spanish ${isTransitioning ? 'hero__title--fade-in' : ''}`}>
            {BRAND_SHORT}
          </h1>
        </div>
        <div className="hero__rule" />
        <div className="hero__text-container">
          <p className={`hero__tagline hero__tagline--japanese ${isTransitioning ? 'hero__tagline--fade-out' : ''}`}>
            {HERO_TAGLINE_JP}
          </p>
          <p className={`hero__tagline hero__tagline--spanish ${isTransitioning ? 'hero__tagline--fade-in' : ''}`}>
            {HERO_TAGLINE}
          </p>
        </div>
      </div>
      <span className="hero__scroll" aria-hidden="true">
        ⌄
      </span>
    </section>
  )
}
