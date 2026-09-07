import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initAnalytics, trackPageview } from '../../lib/analytics'

// requestIdleCallback isn't available in every browser (notably older
// Safari) — setTimeout is the standard fallback.
function scheduleIdle(callback) {
  if (typeof window.requestIdleCallback === 'function') {
    return window.requestIdleCallback(callback, { timeout: 3000 })
  }
  return window.setTimeout(callback, 200)
}

function cancelIdle(id) {
  if (typeof window.cancelIdleCallback === 'function') {
    window.cancelIdleCallback(id)
  } else {
    window.clearTimeout(id)
  }
}

export default function Analytics() {
  const location = useLocation()

  useEffect(() => {
    // Deferred off the first render commit so GA/Clarity's script fetches
    // don't compete with LCP-critical resources (hero image/video) for
    // bandwidth — trackPageview below still records pageviews fired before
    // this resolves, via the queue in lib/analytics.js.
    const id = scheduleIdle(initAnalytics)
    return () => cancelIdle(id)
  }, [])

  useEffect(() => {
    trackPageview(location.pathname + location.search)
  }, [location])

  return null
}
