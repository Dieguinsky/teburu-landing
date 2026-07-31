import {
  BOOKING_SERVICES,
  BOOKING_EXTRAS,
  BOOKING_CALENDAR_URL,
  BOOKING_TRANSFER,
  CONTACT_INFO,
} from '../../content/copy'
import { STEP_IDS, formatPrice } from './useBookingFlow'
import './BookingFlow.scss'

export default function BookingFlow({ flow }) {
  const {
    step,
    booking,
    selectedService,
    selectedExtras,
    discount,
    appliedCoupon,
    couponInput,
    couponError,
    couponChecking,
    setCouponInput,
    applyCoupon,
    removeCoupon,
    iva,
    total,
    goNext,
    goBack,
    toggleExtra,
    canProceed,
    setService,
    agendaBlocked,
  } = flow

  return (
    <>
      {STEP_IDS[step] === 'servicios' && (
        <div className="booking-flow__panel">
          <h3 className="booking-flow__panel-title">Seleccionar servicio</h3>
          <p className="booking-flow__panel-label">Estudio de grabación</p>
          <ul className="booking-flow__cards">
            {BOOKING_SERVICES.map((service) => (
              <li key={service.id}>
                <button
                  type="button"
                  className={[
                    'booking-flow__card',
                    booking.serviceId === service.id && 'booking-flow__card--selected',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setService(service.id)}
                >
                  <div className="booking-flow__card-info">
                    <h4>
                      {service.title}
                      <span className="booking-flow__card-badge">{service.duration}</span>
                    </h4>
                    <p>{service.description}</p>
                  </div>
                  <span className="booking-flow__card-price">
                    {formatPrice(service.price)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {STEP_IDS[step] === 'extras' && (
        <div className="booking-flow__panel">
          <h3 className="booking-flow__panel-title">Seleccionar extras del servicio</h3>
          {selectedService && (
            <p className="booking-flow__panel-label">{selectedService.title}</p>
          )}
          <ul className="booking-flow__cards">
            {BOOKING_EXTRAS.map((extra) => (
              <li key={extra.id}>
                <button
                  type="button"
                  className={[
                    'booking-flow__card',
                    booking.extras.includes(extra.id) && 'booking-flow__card--selected',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => toggleExtra(extra.id)}
                >
                  <div className="booking-flow__card-info">
                    <h4>{extra.label}</h4>
                  </div>
                  <span className="booking-flow__card-price">
                    {formatPrice(extra.price)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {STEP_IDS[step] === 'agenda' && (
        <div className="booking-flow__panel">
          <h3 className="booking-flow__panel-title">Selecciona la fecha y hora</h3>
          {agendaBlocked ? (
            <div className="booking-flow__agenda-blocked">
              <p>
                Alcanzaste el límite de intentos de agenda desde este
                navegador. Escríbenos directamente y coordinamos tu reserva a
                mano.
              </p>
              <div className="booking-flow__agenda-blocked-actions">
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="booking-flow__nav-next"
                >
                  Escribir por WhatsApp
                </a>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="booking-flow__nav-back"
                >
                  Escribir por correo
                </a>
              </div>
            </div>
          ) : (
            <>
              <p className="booking-flow__agenda-note">
                Elige el día y horario disponible y completa tus datos en el
                calendario. Al confirmar, tu reserva queda agendada y recibirás
                la confirmación por correo.
              </p>
              <div className="booking-flow__agenda">
                <iframe
                  src={BOOKING_CALENDAR_URL}
                  title="Agenda de Estudio Teburu"
                  className="booking-flow__agenda-embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </>
          )}
        </div>
      )}

      {STEP_IDS[step] === 'pago' && (
        <div className="booking-flow__panel">
          <h3 className="booking-flow__panel-title">Pago por transferencia</h3>
          <div className="booking-flow__summary">
            <div className="booking-flow__summary-booking">
              <p>
                <strong>Servicio:</strong> {selectedService?.title ?? 'Sin seleccionar'}
              </p>
              <p>
                <strong>Ubicación:</strong> Estudio Teburu
              </p>
            </div>

            <div className="booking-flow__summary-details">
              <div className="booking-flow__summary-lines">
                {selectedService && (
                  <div className="booking-flow__summary-line">
                    <span>{selectedService.title}</span>
                    <span>{formatPrice(selectedService.price)}</span>
                  </div>
                )}
                {selectedExtras.map((extra) => (
                  <div key={extra.id} className="booking-flow__summary-line">
                    <span>{extra.label} [x1]</span>
                    <span>{formatPrice(extra.price)}</span>
                  </div>
                ))}
                {appliedCoupon && (
                  <div className="booking-flow__summary-line booking-flow__summary-line--discount">
                    <span>Descuento ({appliedCoupon.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="booking-flow__summary-line">
                  <span>IVA</span>
                  <span>{formatPrice(iva)}</span>
                </div>
                <div className="booking-flow__summary-total">
                  <span>Precio total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <div className="booking-flow__coupon">
                  {appliedCoupon ? (
                    <p className="booking-flow__coupon-applied">
                      Cupón <strong>{appliedCoupon.code}</strong> aplicado
                      <button type="button" onClick={removeCoupon}>
                        Quitar
                      </button>
                    </p>
                  ) : (
                    <form
                      className="booking-flow__coupon-form"
                      onSubmit={(e) => {
                        e.preventDefault()
                        applyCoupon()
                      }}
                    >
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Código de descuento"
                        className="booking-flow__coupon-input"
                        disabled={couponChecking}
                      />
                      <button type="submit" className="booking-flow__coupon-submit" disabled={couponChecking}>
                        {couponChecking ? 'Verificando…' : 'Aplicar'}
                      </button>
                    </form>
                  )}
                  {couponError && <p className="booking-flow__coupon-error">{couponError}</p>}
                </div>
              </div>

              <div className="booking-flow__transfer">
                <h4 className="booking-flow__transfer-title">Datos de transferencia</h4>
                <dl className="booking-flow__transfer-list">
                  <div className="booking-flow__transfer-row">
                    <dt>Titular</dt>
                    <dd>{BOOKING_TRANSFER.holder}</dd>
                  </div>
                  <div className="booking-flow__transfer-row">
                    <dt>RUT</dt>
                    <dd>{BOOKING_TRANSFER.rut}</dd>
                  </div>
                  <div className="booking-flow__transfer-row">
                    <dt>Banco</dt>
                    <dd>{BOOKING_TRANSFER.bank}</dd>
                  </div>
                  <div className="booking-flow__transfer-row">
                    <dt>Tipo de cuenta</dt>
                    <dd>{BOOKING_TRANSFER.accountType}</dd>
                  </div>
                  <div className="booking-flow__transfer-row">
                    <dt>N° de cuenta</dt>
                    <dd>{BOOKING_TRANSFER.accountNumber}</dd>
                  </div>
                  <div className="booking-flow__transfer-row">
                    <dt>Correo</dt>
                    <dd>{BOOKING_TRANSFER.email}</dd>
                  </div>
                </dl>
                <p className="booking-flow__transfer-hint">
                  Realiza la transferencia por el total y envía el comprobante a{' '}
                  <a href={`mailto:${BOOKING_TRANSFER.email}`}>{BOOKING_TRANSFER.email}</a>{' '}
                  indicando la fecha y hora de tu reserva.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="booking-flow__nav">
        {step > 0 ? (
          <button type="button" className="booking-flow__nav-back" onClick={goBack}>
            Atrás
          </button>
        ) : (
          <span />
        )}
        {step < STEP_IDS.length - 1 && (
          <button
            type="button"
            className="booking-flow__nav-next"
            onClick={goNext}
            disabled={!canProceed()}
          >
            Siguiente
          </button>
        )}
      </div>
    </>
  )
}
