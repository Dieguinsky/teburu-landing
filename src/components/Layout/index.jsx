import { NavLink, Outlet } from 'react-router-dom'
import logo from '../../assets/img/logos/plano/blanco.png'
import './Layout.scss'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/servicios', label: 'Servicios' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/estudio', label: 'Estudio' },
  { to: '/artistas', label: 'Artistas' },
  { to: '/escuela', label: 'Escuela' },
  { to: '/contacto', label: 'Contacto' },
  { to: '/reservar', label: 'Reservar' },
  { to: '/portafolio', label: 'Portafolio' },
]

export default function Layout() {
  return (
    <>
      <div className="nav-container">
        <img src={logo} alt="Studio Teburu" className="logo" />

        <nav className="nav">
          {navItems.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="spacer" />
      </div>

      <Outlet />
    </>
  )
}
