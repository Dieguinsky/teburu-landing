import { Link } from 'react-router-dom'
import Reveal from '../../../../components/Reveal'
import { homeImages } from '../../../../assets/homeImages'
import { SERVICES } from '../../../../content/copy'
import './Services.scss'

const services = homeImages.services.map((image, index) => ({
  ...SERVICES[index],
  image,
  video: homeImages.servicesVideo[index],
}))

export default function Services() {
  return (
    <section className="services">
      <div className="services__inner">
        <Reveal as="h2" className="section-title services__title">
          Servicios Disponibles
        </Reveal>
        <div className="services__grid">
          {services.map(({ title, text, image, video, anchor }, index) => (
            <Reveal
              as="article"
              key={title}
              className="services__card"
              delay={index * 90}
            >
              <video
                className="services__card-media"
                src={video}
                poster={image}
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="services__card-overlay" />
              <div className="services__card-body">
                <h3>{title}</h3>
                <p>{text}</p>
                <Link to={`/servicios#${anchor}`} className="button">
                  mas información
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
