import { useEffect, useRef } from 'react'
import './CursorGlow.scss'

// A soft light halo that follows the cursor, meant to read as an intermediate
// layer between the page background and the actual content. It sits at
// z-index: 0 so it stays below every hero/title overlay in the site (they
// all use z-index: 1+, see FAQ/Servicios/Blog/Hero .scss), and mix-blend-mode
// keeps it visible on flat backgrounds while staying subtle over photos/text.
export default function CursorGlow() {
  const glowRef = useRef(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches
    if (prefersReducedMotion || isCoarsePointer) return

    const glow = glowRef.current
    let frame = null
    let x = 0
    let y = 0

    const applyPosition = () => {
      frame = null
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    const handleMove = (event) => {
      x = event.clientX
      y = event.clientY
      glow.classList.add('cursor-glow--visible')
      if (frame === null) {
        frame = requestAnimationFrame(applyPosition)
      }
    }

    const handleLeave = () => {
      glow.classList.remove('cursor-glow--visible')
    }

    window.addEventListener('pointermove', handleMove)
    document.addEventListener('pointerleave', handleLeave)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerleave', handleLeave)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [])

  return <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
}
