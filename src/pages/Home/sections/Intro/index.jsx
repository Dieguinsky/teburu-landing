import { Link } from 'react-router-dom'
import Reveal from '../../../../components/Reveal'
import { BRAND, HOME_INTRO } from '../../../../content/copy'
import './Intro.scss'

export default function Intro() {
  return (
    <section className="intro">
      <Reveal as="div" className="intro__inner">
        <h2 className="section-title intro__title">{HOME_INTRO.title}</h2>
        <p className="intro__text">
          {HOME_INTRO.textBefore} <strong>{BRAND}</strong> {HOME_INTRO.textAfter}
        </p>
        <p className="intro__welcome">{HOME_INTRO.welcome}</p>
        <Link to="/nosotros" className="button">
          {HOME_INTRO.cta}
        </Link>
      </Reveal>
    </section>
  )
}
