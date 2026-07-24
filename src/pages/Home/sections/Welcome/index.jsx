import Reveal from '../../../../components/Reveal'
import { homeImages } from '../../../../assets/homeImages'
import { BRAND, HOME_WELCOME } from '../../../../content/copy'
import './Welcome.scss'

export default function Welcome() {
  return (
    <Reveal as="section" className="welcome" bg={homeImages.welcomeBg}>
      <div className="welcome__overlay" />
      <div className="welcome__inner">
        <h2 className="section-title welcome__title">
          {HOME_WELCOME.titleBefore} {BRAND}
        </h2>
        <div className="welcome__grid">
          {HOME_WELCOME.features.map(({ title, text, icon }, index) => (
            <Reveal as="article" key={title} className="welcome__item" delay={index * 100}>
              <span className="welcome__icon" aria-hidden="true">
                {icon}
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Reveal>
  )
}
