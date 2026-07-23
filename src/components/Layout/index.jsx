import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import logo from '../../assets/img/logos/plano/blanco.png'
import WhatsAppButton from '../WhatsAppButton'
import { CONTACT_INFO, NAV_ITEMS_ES, NAV_ITEMS_JP } from '../../content/copy'
import './Layout.scss'

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
      <WhatsAppButton />
    </>
  )
}
