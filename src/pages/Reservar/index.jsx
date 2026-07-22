import { useState } from 'react'
import {
  BRAND,
  BOOKING_STEPS,
  BOOKING_SERVICES,
  BOOKING_EXTRAS,
  BOOKING_CALENDAR_URL,
  BOOKING_TRANSFER,
} from '../../content/copy'
import './Reservar.scss'

const STEP_IDS = BOOKING_STEPS.map((s) => s.id)

function formatPrice(amount) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function Reservar() {
  const [step, setStep] = useState(0)
  const [booking, setBooking] = useState({
    serviceId: null,
    extras: [],
  })

  const selectedService = BOOKING_SERVICES.find((s) => s.id === booking.serviceId)
  const selectedExtras = BOOKING_EXTRAS.filter((e) => booking.extras.includes(e.id))

  const servicePrice = selectedService?.price ?? 0
  const extrasPrice = selectedExtras.reduce((sum, e) => sum + e.price, 0)
  const subtotal = servicePrice + extrasPrice
  const iva = Math.round(subtotal * 0.19)
  const total = subtotal + iva

  function goNext() {
    if (step < STEP_IDS.length - 1) setStep((s) => s + 1)
  }

  function goBack() {
    if (step > 0) setStep((s) => s - 1)
  }

  function toggleExtra(id) {
    setBooking((prev) => ({
      ...prev,
      extras: prev.extras.includes(id) ? [] : [id],
    }))
  }

  function canProceed() {
    const id = STEP_IDS[step]
    if (id === 'servicios') return !!booking.serviceId
    return true
  }

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
              const isDone = index < step
              const isActive = index === step
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
            <a href="mailto:contacto@estudioteburu.cl">contacto@estudioteburu.cl</a>
          </p>
        </aside>

        <section className="reservar-main">
          {STEP_IDS[step] === 'servicios' && (
            <div className="reservar-panel">
              <h2 className="reservar-panel__title">Seleccionar servicio</h2>
              <p className="reservar-panel__label">Estudio de grabación</p>
              <ul className="reservar-cards">
                {BOOKING_SERVICES.map((service) => (
                  <li key={service.id}>
                    <button
                      type="button"
                      className={[
                        'reservar-card',
                        booking.serviceId === service.id && 'reservar-card--selected',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() =>
                        setBooking((prev) => ({ ...prev, serviceId: service.id }))
                      }
                    >
                      <div className="reservar-card__info">
                        <h3>
                          {service.title}
                          <span className="reservar-card__badge">{service.duration}</span>
                        </h3>
                        <p>{service.description}</p>
                      </div>
                      <span className="reservar-card__price">
                        {formatPrice(service.price)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {STEP_IDS[step] === 'extras' && (
            <div className="reservar-panel">
              <h2 className="reservar-panel__title">Seleccionar extras del servicio</h2>
              {selectedService && (
                <p className="reservar-panel__label">{selectedService.title}</p>
              )}
              <ul className="reservar-cards">
                {BOOKING_EXTRAS.map((extra) => (
                  <li key={extra.id}>
                    <button
                      type="button"
                      className={[
                        'reservar-card',
                        booking.extras.includes(extra.id) && 'reservar-card--selected',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => toggleExtra(extra.id)}
                    >
                      <div className="reservar-card__info">
                        <h3>{extra.label}</h3>
                      </div>
                      <span className="reservar-card__price">
                        {formatPrice(extra.price)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {STEP_IDS[step] === 'agenda' && (
            <div className="reservar-panel">
              <h2 className="reservar-panel__title">Selecciona la fecha y hora</h2>
              <p className="reservar-agenda__note">
                Elige el día y horario disponible y completa tus datos en el
                calendario. Al confirmar, tu reserva queda agendada y recibirás la
                confirmación por correo.
              </p>
              <div className="reservar-agenda">
                <iframe
                  src={BOOKING_CALENDAR_URL}
                  title="Agenda de Estudio Teburu"
                  className="reservar-agenda__embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          )}

          {STEP_IDS[step] === 'pago' && (
            <div className="reservar-panel">
              <h2 className="reservar-panel__title">Pago por transferencia</h2>
              <div className="reservar-summary">
                <div className="reservar-summary__booking">
                  <p>
                    <strong>Servicio:</strong>{' '}
                    {selectedService?.title ?? 'Sin seleccionar'}
                  </p>
                  <p>
                    <strong>Ubicación:</strong> Estudio Teburu
                  </p>
                </div>

                <div className="reservar-summary__details">
                  <div className="reservar-summary__lines">
                    {selectedService && (
                      <div className="reservar-summary__line">
                        <span>{selectedService.title}</span>
                        <span>{formatPrice(selectedService.price)}</span>
                      </div>
                    )}
                    {selectedExtras.map((extra) => (
                      <div key={extra.id} className="reservar-summary__line">
                        <span>{extra.label} [x1]</span>
                        <span>{formatPrice(extra.price)}</span>
                      </div>
                    ))}
                    <div className="reservar-summary__line">
                      <span>IVA</span>
                      <span>{formatPrice(iva)}</span>
                    </div>
                    <div className="reservar-summary__total">
                      <span>Precio total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <div className="reservar-transfer">
                    <h3 className="reservar-transfer__title">Datos de transferencia</h3>
                    <dl className="reservar-transfer__list">
                      <div className="reservar-transfer__row">
                        <dt>Titular</dt>
                        <dd>{BOOKING_TRANSFER.holder}</dd>
                      </div>
                      <div className="reservar-transfer__row">
                        <dt>RUT</dt>
                        <dd>{BOOKING_TRANSFER.rut}</dd>
                      </div>
                      <div className="reservar-transfer__row">
                        <dt>Banco</dt>
                        <dd>{BOOKING_TRANSFER.bank}</dd>
                      </div>
                      <div className="reservar-transfer__row">
                        <dt>Tipo de cuenta</dt>
                        <dd>{BOOKING_TRANSFER.accountType}</dd>
                      </div>
                      <div className="reservar-transfer__row">
                        <dt>N° de cuenta</dt>
                        <dd>{BOOKING_TRANSFER.accountNumber}</dd>
                      </div>
                      <div className="reservar-transfer__row">
                        <dt>Correo</dt>
                        <dd>{BOOKING_TRANSFER.email}</dd>
                      </div>
                    </dl>
                    <p className="reservar-transfer__hint">
                      Realiza la transferencia por el total y envía el comprobante a{' '}
                      <a href={`mailto:${BOOKING_TRANSFER.email}`}>
                        {BOOKING_TRANSFER.email}
                      </a>{' '}
                      indicando la fecha y hora de tu reserva.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="reservar-nav">
            {step > 0 ? (
              <button type="button" className="reservar-nav__back" onClick={goBack}>
                Atrás
              </button>
            ) : (
              <span />
            )}
            {step < STEP_IDS.length - 1 && (
              <button
                type="button"
                className="reservar-nav__next"
                onClick={goNext}
                disabled={!canProceed()}
              >
                Siguiente
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
