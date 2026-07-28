import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import logo from '../../assets/img/logos/plano/blanco.png'
import WhatsAppButton from '../WhatsAppButton'
import CursorGlow from '../CursorGlow'
import { JsonLd, SITE_URL } from '../Seo'
import { BRAND, CONTACT_INFO, HOME_LOCATION, NAV_ITEMS_ES, NAV_ITEMS_JP } from '../../content/copy'
import './Layout.scss'

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      <JsonLd id="local-business-schema" schema={localBusinessSchema} />

      <div className="nav-container">
        <Link to="/" className="logo-link">
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

      <Outlet />

      {/* Rendered after Outlet on purpose: many sections have a decorative
          position:absolute overlay div with no explicit z-index (Hero, FAQ
          hero, Artists, etc). Those tie with CursorGlow's z-index: 0, and
          ties are won by DOM order — being last makes the glow paint above
          those overlays instead of getting hidden under them, while it still
          stays below any real z-index: 1+ content (titles, buttons). */}
      <CursorGlow />
      <WhatsAppButton />
    </>
  )
}
