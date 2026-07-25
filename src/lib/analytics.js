const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID
const CLARITY_ID = import.meta.env.VITE_CLARITY_PROJECT_ID

let initialized = false

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
}

export function trackPageview(path) {
  if (GA_ID && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    })
  }
}
