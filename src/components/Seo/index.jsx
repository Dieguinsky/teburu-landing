import { useEffect } from 'react'

export const SITE_URL = 'https://estudioteburu.cl'

function setMetaTag(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

// Writes per-page <title>/meta straight into <head> on mount. The prerender
// script (scripts/prerender.mjs) captures the DOM after this runs, so these
// tags end up baked into the static HTML for crawlers — this isn't just a
// client-side nicety.
export default function Seo({ title, description, path, noindex }) {
  useEffect(() => {
    if (title) document.title = title

    setMetaTag('name', 'description', description)
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : null)
    setMetaTag('property', 'og:title', title)
    setMetaTag('property', 'og:description', description)

    if (path) {
      const url = `${SITE_URL}${path}`
      setMetaTag('property', 'og:url', url)
      setCanonical(url)
    }
  }, [title, description, path, noindex])

  return null
}

// Injects a JSON-LD <script> into <head> so the prerender capture gets it
// there (search engines expect structured data in <head> or <body>, but
// <head> is the conventional, safest place) instead of inline mid-page.
export function JsonLd({ id, schema }) {
  useEffect(() => {
    let el = document.head.querySelector(`script[data-jsonld="${id}"]`)
    if (!el) {
      el = document.createElement('script')
      el.type = 'application/ld+json'
      el.setAttribute('data-jsonld', id)
      document.head.appendChild(el)
    }
    el.textContent = JSON.stringify(schema)

    return () => {
      el?.remove()
    }
  }, [id, schema])

  return null
}
