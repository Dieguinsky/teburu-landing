import { useEffect, useMemo, useRef, useState } from 'react'
import { BOOKING_STEPS, BOOKING_SERVICES, BOOKING_EXTRAS, BOOKING_COUPONS } from '../../content/copy'

export const STEP_IDS = BOOKING_STEPS.map((s) => s.id)

const AGENDA_ATTEMPTS_KEY = 'teburu_agenda_attempts'
const MAX_AGENDA_ATTEMPTS = 5
const AGENDA_ATTEMPTS_WINDOW_MS = 24 * 60 * 60 * 1000

function readAgendaAttempts() {
  try {
    const stored = JSON.parse(localStorage.getItem(AGENDA_ATTEMPTS_KEY) || '[]')
    if (!Array.isArray(stored)) return []
    const cutoff = Date.now() - AGENDA_ATTEMPTS_WINDOW_MS
    return stored.filter((timestamp) => typeof timestamp === 'number' && timestamp > cutoff)
  } catch {
    return []
  }
}

// Soft, per-browser deterrent only: the real booking happens in a third-party
// Google Calendar iframe this site can't see into, so there's no way to enforce
// a true per-IP limit without a backend. This just discourages repeat clicks
// from the same browser within a rolling 24h window.
function useAgendaAttemptLimit(active) {
  const countedRef = useRef(false)

  const blocked = useMemo(() => {
    if (!active) return false
    return readAgendaAttempts().length >= MAX_AGENDA_ATTEMPTS
  }, [active])

  useEffect(() => {
    if (!active || blocked || countedRef.current) return
    countedRef.current = true

    const attempts = readAgendaAttempts()
    attempts.push(Date.now())
    localStorage.setItem(AGENDA_ATTEMPTS_KEY, JSON.stringify(attempts))
  }, [active, blocked])

  return blocked
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function useBookingFlow() {
  const [step, setStep] = useState(0)
  const [booking, setBooking] = useState({
    serviceId: null,
    extras: [],
  })
  const [couponInput, setCouponInput] = useState('')
  const [coupon, setCoupon] = useState({ key: null, error: null })

  const selectedService = BOOKING_SERVICES.find((s) => s.id === booking.serviceId)
  const selectedExtras = BOOKING_EXTRAS.filter((e) => booking.extras.includes(e.id))

  const servicePrice = selectedService?.price ?? 0
  const extrasPrice = selectedExtras.reduce((sum, e) => sum + e.price, 0)
  const subtotal = servicePrice + extrasPrice

  const appliedCoupon = coupon.key ? BOOKING_COUPONS[coupon.key] : null
  const discount = appliedCoupon ? Math.round(subtotal * appliedCoupon.discount) : 0
  const iva = Math.round((subtotal - discount) * 0.19)
  const total = subtotal - discount + iva

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

  function setService(id) {
    setBooking((prev) => ({ ...prev, serviceId: id }))
  }

  function applyCoupon() {
    const key = couponInput.trim().toLowerCase()
    if (!key) return
    if (BOOKING_COUPONS[key]) {
      setCoupon({ key, error: null })
    } else {
      setCoupon({ key: null, error: 'Cupón no válido' })
    }
  }

  function removeCoupon() {
    setCoupon({ key: null, error: null })
    setCouponInput('')
  }

  const agendaBlocked = useAgendaAttemptLimit(STEP_IDS[step] === 'agenda')

  return {
    step,
    booking,
    selectedService,
    selectedExtras,
    servicePrice,
    extrasPrice,
    subtotal,
    discount,
    appliedCoupon,
    couponInput,
    couponError: coupon.error,
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
  }
}
