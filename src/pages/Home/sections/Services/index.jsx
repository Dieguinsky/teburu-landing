import { Link } from 'react-router-dom'
import { homeImages } from '../../../../assets/homeImages'
import { SERVICES } from '../../../../content/copy'
import './Services.scss'

const services = homeImages.services.map((image, index) => ({
  ...SERVICES[index],
  image,
}))

export default function Services() {
  return (
    <section className="services">
      <div className="services__inner">
        <h2 className="section-title services__title">Servicios Disponibles

        </h2>
        <div className="services__grid">
          {services.map(({ title, text, image }) => (
            <article
              key={title}
              className="services__card"
              style={{ backgroundImage: `url(${image})` }}
            >
              <div className="services__card-overlay" />
              <div className="services__card-body">
                <h3>{title}</h3>
                <p>{text}</p>
                <Link to="/servicios" className="button">
                  mas información
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
