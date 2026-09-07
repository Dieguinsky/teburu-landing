const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID
const CLARITY_ID = import.meta.env.VITE_CLARITY_PROJECT_ID

let initialized = false
// Pageviews fired (via the route-change effect in Analytics/index.jsx)
// before initAnalytics has run — initAnalytics is deferred to idle time so it
// doesn't compete with LCP-critical resources, which means the very first
// pageview would otherwise arrive before window.gtag exists and get lost.
let pendingPageviews = []

export function initAnalytics() {
  if (initialized || !import.meta.env.PROD) return
  initialized = true

  if (GA_ID) {
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    script.async = true
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', GA_ID, { send_page_view: false })
  }

  if (CLARITY_ID) {
    window.clarity =
      window.clarity ||
      function () {
        ;(window.clarity.q = window.clarity.q || []).push(arguments)
      }
    const clarityScript = document.createElement('script')
    clarityScript.async = true
    clarityScript.src = `https://www.clarity.ms/tag/${CLARITY_ID}`
    document.head.appendChild(clarityScript)
  }

  pendingPageviews.forEach(sendPageview)
  pendingPageviews = []
}

function sendPageview(path) {
  if (GA_ID && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    })
  }
}

export function trackPageview(path) {
  if (!import.meta.env.PROD) return
  if (!initialized) {
    pendingPageviews.push(path)
    return
  }
  sendPageview(path)
}

// Conversion/interaction events — separate from pageviews so GA4 and Clarity
// can report on what actually drives business value (contact submissions,
// WhatsApp clicks, booking funnel progress), not just traffic.
export function trackEvent(name, params = {}) {
  if (GA_ID && typeof window.gtag === 'function') {
    window.gtag('event', name, params)
  }
  if (CLARITY_ID && typeof window.clarity === 'function') {
    window.clarity('event', name)
  }
}
