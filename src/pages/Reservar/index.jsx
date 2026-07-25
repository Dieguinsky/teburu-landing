import { BRAND, BOOKING_STEPS, CONTACT_INFO } from '../../content/copy'
import BookingFlow from '../../components/BookingFlow'
import useBookingFlow from '../../components/BookingFlow/useBookingFlow'
import './Reservar.scss'

export default function Reservar() {
  const flow = useBookingFlow()

  return (
    <main className="reservar-page">
      <div className="reservar-layout">
        <aside className="reservar-sidebar">
          <div className="reservar-sidebar__brand">
            <span className="reservar-sidebar__logo" aria-hidden="true">
              ◈
            </span>
            <span className="reservar-sidebar__name">{BRAND}</span>
          </div>

          <ol className="reservar-steps">
            {BOOKING_STEPS.map(({ id, label }, index) => {
              const isDone = index < flow.step
              const isActive = index === flow.step
              return (
                <li
                  key={id}
                  className={[
                    'reservar-step',
                    isDone && 'reservar-step--done',
                    isActive && 'reservar-step--active',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span className="reservar-step__indicator">
                    {isDone ? '✓' : index + 1}
                  </span>
                  {label}
                </li>
              )
            })}
          </ol>

          <p className="reservar-sidebar__help">
            ¿Tienes alguna pregunta?
            <br />
            <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
          </p>
        </aside>

        <section className="reservar-main">
          <BookingFlow flow={flow} />
        </section>
      </div>
    </main>
  )
}
