import { useState } from 'react'
import { BOOKING_STEPS, BOOKING_SERVICES, BOOKING_EXTRAS } from '../../content/copy'

export const STEP_IDS = BOOKING_STEPS.map((s) => s.id)

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

  function setService(id) {
    setBooking((prev) => ({ ...prev, serviceId: id }))
  }

  return {
    step,
    booking,
    selectedService,
    selectedExtras,
    servicePrice,
    extrasPrice,
    subtotal,
    iva,
    total,
    goNext,
    goBack,
    toggleExtra,
    canProceed,
    setService,
  }
}
