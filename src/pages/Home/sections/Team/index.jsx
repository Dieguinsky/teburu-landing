import { Link } from 'react-router-dom'
import Reveal from '../../../../components/Reveal'
import { pageImages } from '../../../../assets/pageImages'
import { TEAM_MEMBERS } from '../../../../content/copy'
import './Team.scss'

export default function Team() {
  return (
    <section className="team">
      <div className="team__inner">
        <Reveal as="h2" className="section-title team__title">
          El equipo
        </Reveal>
        <div className="team__grid">
          {TEAM_MEMBERS.map(({ id, name, alias, role, imageKey }, index) => (
            <Reveal as="article" key={id} className="team__member" delay={index * 100}>
              <img
                src={pageImages.team[imageKey]}
                alt={name}
                className="team__photo"
                loading="lazy"
              />
              <h3>
                {name}
                {alias && <span className="team__alias"> · {alias}</span>}
              </h3>
              <p>{role}</p>
              <Link to="/nosotros" className="team__social">
                Conócelos
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
