import { Link } from 'react-router-dom'
import { BRAND, LOREM_LONG, LOREM_SHORT } from '../../../../content/copy'
import './Intro.scss'

export default function Intro() {
  return (
    <section className="intro">
      <div className="intro__inner">
        <h2 className="section-title intro__title">{LOREM_SHORT}</h2>
        <p className="intro__text">
          {LOREM_LONG} <strong>{BRAND}</strong> {LOREM_LONG}
        </p>
        <p className="intro__welcome">{LOREM_SHORT}</p>
        <Link to="/nosotros" className="button">
          {LOREM_SHORT}
        </Link>
      </div>
    </section>
  )
}
