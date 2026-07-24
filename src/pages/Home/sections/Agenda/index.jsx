import { Link } from 'react-router-dom'
import Reveal from '../../../../components/Reveal'
import BookingFlow from '../../../../components/BookingFlow'
import useBookingFlow from '../../../../components/BookingFlow/useBookingFlow'
import { BOOKING_STEPS, HOME_AGENDA } from '../../../../content/copy'
import './Agenda.scss'

export default function Agenda() {
  const flow = useBookingFlow()

  return (
    <section className="agenda">
      <div className="agenda__layout">
        <Reveal as="div" className="agenda__preview">
          <ol className="agenda__steps">
            {BOOKING_STEPS.map(({ id, label }, index) => {
              const isDone = index < flow.step
              const isActive = index === flow.step
              return (
                <li
                  key={id}
                  className={[
                    'agenda__step',
                    isDone && 'agenda__step--done',
                    isActive && 'agenda__step--active',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span className="agenda__step-indicator">{isDone ? '✓' : index + 1}</span>
                  {label}
                </li>
              )
            })}
          </ol>
          <div className="agenda__flow">
            <BookingFlow flow={flow} />
          </div>
        </Reveal>
        <Reveal as="div" className="agenda__copy" delay={120}>
          <span className="agenda__eyebrow">{HOME_AGENDA.eyebrow}</span>
          <h2 className="section-title agenda__title">{HOME_AGENDA.title}</h2>
          <p className="agenda__text">{HOME_AGENDA.text}</p>
          <Link to="/reservar" className="button button--accent">
            {HOME_AGENDA.cta}
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
