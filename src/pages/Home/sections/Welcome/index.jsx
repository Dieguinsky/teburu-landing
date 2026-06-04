import { homeImages } from '../../../../assets/homeImages'
import { BRAND, LOREM_MEDIUM, LOREM_SHORT } from '../../../../content/copy'
import './Welcome.scss'

const features = [
  { title: LOREM_SHORT, text: LOREM_MEDIUM, icon: '◉' },
  { title: LOREM_SHORT, text: LOREM_MEDIUM, icon: '★' },
  { title: LOREM_SHORT, text: LOREM_MEDIUM, icon: '◎' },
]

export default function Welcome() {
  return (
    <section
      className="welcome"
      style={{ backgroundImage: `url(${homeImages.welcomeBg})` }}
    >
      <div className="welcome__overlay" />
      <div className="welcome__inner">
        <h2 className="section-title welcome__title">
          {LOREM_SHORT} {BRAND}
        </h2>
        <div className="welcome__grid">
          {features.map(({ title, text, icon }, index) => (
            <article key={index} className="welcome__item">
              <span className="welcome__icon" aria-hidden="true">
                {icon}
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
