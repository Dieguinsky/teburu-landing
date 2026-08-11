import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import logo from '../../assets/img/logos/plano/blanco.png'
import WhatsAppButton from '../WhatsAppButton'
import CursorGlow from '../CursorGlow'
import RetroMode from '../RetroMode'
import { JsonLd, SITE_URL } from '../Seo'
import {
  BRAND,
  CONTACT_INFO,
  HERO_TAGLINE,
  HERO_TAGLINE_JP,
  HOME_LOCATION,
  NAV_ITEMS_ES,
  NAV_ITEMS_JP,
} from '../../content/copy'
import './Layout.scss'

// Easter egg: 5 clicks on the logo within RETRO_CLICK_WINDOW_MS toggles a
// full 90s-web reskin (see styles/_retro.scss + components/RetroMode).
// Purely cosmetic — no structure/content changes, click count resets if the
// gap between clicks is too long so accidental double-clicks don't trigger it.
const RETRO_CLICKS_REQUIRED = 5
const RETRO_CLICK_WINDOW_MS = 1200
const RETRO_TICKER_TEXT = `★ ようこそ ${BRAND} へ ★ ${HERO_TAGLINE} ★ ${HERO_TAGLINE_JP} ★`
const RETRO_TITLE_BLINK_MS = 900
const RETRO_TAB_TITLES = ['★ Teburu ★', '☆ ようこそ ☆']
const RETRO_WEBRING_ITEMS = ['★ TEBURU ★', '🖥 NETSCAPE 4.0', '📐 800×600', '✎ HTML A MANO']

// Sitewide LocalBusiness schema — mounted once here (not per-page) since it
// describes the studio itself, not any single page. Helps local-intent
// queries ("estudio de grabación Santiago") and Google's local pack/Maps
// matching.
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: BRAND,
  image: `${SITE_URL}/og-image.png`,
  url: SITE_URL,
  telephone: CONTACT_INFO.whatsapp,
  email: CONTACT_INFO.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: HOME_LOCATION.address,
    addressCountry: 'CL',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -33.44038744902859,
    longitude: -70.64153560018185,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:30',
      closes: '19:30',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:30',
      closes: '16:00',
    },
  ],
  sameAs: [CONTACT_INFO.instagram],
}

export default function Layout() {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // Intentionally not persisted (no localStorage) — leaving the page
  // (reload, close tab, navigate away from the SPA entirely) should always
  // drop back to the normal look rather than sticking a visitor in retro
  // mode indefinitely.
  const [isRetro, setIsRetro] = useState(false)
  const logoClicksRef = useRef({ count: 0, lastClickAt: 0 })
  const { pathname } = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('retro-mode', isRetro)
    return () => document.body.classList.remove('retro-mode')
  }, [isRetro])

  // Classic blinking-tab-title trick. Re-captures the "real" title (Seo sets
  // it per-route) whenever retro mode toggles on or the route changes, so
  // exiting — or navigating away while still in retro mode — always restores
  // the actual page title instead of a stale one from a different route.
  useEffect(() => {
    if (!isRetro) return undefined

    const originalTitle = document.title
    let index = 0
    const interval = setInterval(() => {
      document.title = RETRO_TAB_TITLES[index % RETRO_TAB_TITLES.length]
      index += 1
    }, RETRO_TITLE_BLINK_MS)

    return () => {
      clearInterval(interval)
      document.title = originalTitle
    }
  }, [isRetro, pathname])

  const closeMenu = () => setIsMenuOpen(false)

  const handleLogoClick = () => {
    const now = Date.now()
    const clicks = logoClicksRef.current
    clicks.count = now - clicks.lastClickAt > RETRO_CLICK_WINDOW_MS ? 1 : clicks.count + 1
    clicks.lastClickAt = now

    if (clicks.count >= RETRO_CLICKS_REQUIRED) {
      clicks.count = 0
      setIsRetro((current) => !current)
    }
  }

  return (
    <>
      <JsonLd id="local-business-schema" schema={localBusinessSchema} />

      <div className="nav-container">
        <Link to="/" className="logo-link" onClick={handleLogoClick}>
          <img src={logo} alt="Studio Teburu" className="logo" />
        </Link>

        <nav className={`nav ${isMenuOpen ? 'nav--open' : ''}`}>
          {NAV_ITEMS_JP.map(({ to, label, end }, index) => {
            const esItem = NAV_ITEMS_ES[index]
            return (
              <div key={to} className="nav-item">
                <NavLink
                  to={to}
                  end={end}
                  onClick={closeMenu}
                  className={`nav-link nav-link--jp ${isTransitioning ? 'nav-link--fade-out' : 'nav-link--fade-in'}`}
                >
                  {label}
                </NavLink>
                <NavLink
                  to={esItem.to}
                  end={esItem.end}
                  onClick={closeMenu}
                  className={`nav-link nav-link--es ${isTransitioning ? 'nav-link--fade-in' : 'nav-link--fade-out'}`}
                >
                  {esItem.label}
                </NavLink>
              </div>
            )
          })}
        </nav>

        <div className="nav-actions">
          <a
            href={CONTACT_INFO.instagram}
            target="_blank"
            rel="noreferrer"
            className="instagram-link"
            aria-label="Síguenos en Instagram"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
              <circle cx="12" cy="12" r="4.5" />
              <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>

          <button
            type="button"
            className={`nav-toggle ${isMenuOpen ? 'nav-toggle--open' : ''}`}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {isRetro && (
        <div className="retro-marquee" aria-hidden="true">
          <div className="retro-marquee__track">
            <span className="retro-marquee__item">{RETRO_TICKER_TEXT}</span>
            <span className="retro-marquee__item">{RETRO_TICKER_TEXT}</span>
          </div>
        </div>
      )}

      <Outlet />

      {isRetro && (
        <div className="retro-webring" aria-hidden="true">
          {RETRO_WEBRING_ITEMS.map((item) => (
            <span key={item} className="retro-webring__button">
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Rendered after Outlet on purpose: many sections have a decorative
          position:absolute overlay div with no explicit z-index (Hero, FAQ
          hero, Artists, etc). Those tie with CursorGlow's z-index: 0, and
          ties are won by DOM order — being last makes the glow paint above
          those overlays instead of getting hidden under them, while it still
          stays below any real z-index: 1+ content (titles, buttons). */}
      <CursorGlow />
      <WhatsAppButton />
      {isRetro && <RetroMode onExit={() => setIsRetro(false)} />}
    </>
  )
}
