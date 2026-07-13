import { useState, useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import logo from '../../assets/img/logos/plano/blanco.png'
import { NAV_ITEMS_ES, NAV_ITEMS_JP } from '../../content/copy'
import './Layout.scss'

export default function Layout() {
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <div className="nav-container">
        <img src={logo} alt="Studio Teburu" className="logo" />

        <nav className="nav">
          {NAV_ITEMS_JP.map(({ to, label, end }, index) => {
            const esItem = NAV_ITEMS_ES[index]
            return (
              <div key={to} className="nav-item">
                <NavLink
                  to={to}
                  end={end}
                  className={`nav-link nav-link--jp ${isTransitioning ? 'nav-link--fade-out' : 'nav-link--fade-in'}`}
                >
                  {label}
                </NavLink>
                <NavLink
                  to={esItem.to}
                  end={esItem.end}
                  className={`nav-link nav-link--es ${isTransitioning ? 'nav-link--fade-in' : 'nav-link--fade-out'}`}
                >
                  {esItem.label}
                </NavLink>
              </div>
            )
          })}
        </nav>

        <div className="spacer" />
      </div>

      <Outlet />
    </>
  )
}
