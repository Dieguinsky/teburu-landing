import { useEffect, useRef, useState } from 'react'

// Autoplaying background-loop <video> that only starts fetching once it's
// near the viewport — plain <video autoPlay> has no lazy-loading equivalent
// (unlike <img loading="lazy">), so every loop on a page was downloading
// immediately on mount regardless of scroll position before this existed.
export default function LazyVideo({ src, poster, className }) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '200px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      className={className}
      src={isVisible ? src : undefined}
      poster={poster}
      preload="none"
      autoPlay={isVisible}
      muted
      loop
      playsInline
    />
  )
}
