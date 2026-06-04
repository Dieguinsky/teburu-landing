import { homeImages } from '../../../../assets/homeImages'
import { LOREM_SHORT } from '../../../../content/copy'
import './Team.scss'

const team = homeImages.team.map((image) => ({
  name: LOREM_SHORT,
  role: LOREM_SHORT,
  image,
}))

export default function Team() {
  return (
    <section className="team">
      <div className="team__inner">
        <h2 className="section-title team__title">{LOREM_SHORT}</h2>
        <div className="team__grid">
          {team.map(({ name, role, image }, index) => (
            <article key={index} className="team__member">
              <img src={image} alt={name} className="team__photo" />
              <h3>{name}</h3>
              <p>{role}</p>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="team__social"
                aria-label={LOREM_SHORT}
              >
                {LOREM_SHORT}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
