import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Servicios from './pages/Servicios'
import Nosotros from './pages/Nosotros'
import Estudio from './pages/Estudio'
import Artistas from './pages/Artistas'
import Escuela from './pages/Escuela'
import Contacto from './pages/Contacto'
import Reservar from './pages/Reservar'
import Portafolio from './pages/Portafolio'
import Cotizador from './pages/Cotizador'
import FAQ from './pages/FAQ'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/estudio" element={<Estudio />} />
        <Route path="/artistas" element={<Artistas />} />
        <Route path="/escuela" element={<Escuela />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/reservar" element={<Reservar />} />
        <Route path="/portafolio" element={<Portafolio />} />
        <Route path="/cotizador" element={<Cotizador />} />
        <Route path="/faq" element={<FAQ />} />
      </Route>
    </Routes>
  )
}
