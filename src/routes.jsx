import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'

// Lazy-loaded: Home stays eager since it's the most common landing route and
// is already prerendered to static HTML, so splitting it out would only add
// a network round-trip for the page most visitors hit first. Every other
// route is fetched on demand, keeping the initial JS bundle smaller.
const Servicios = lazy(() => import('./pages/Servicios'))
const Nosotros = lazy(() => import('./pages/Nosotros'))
const Estudio = lazy(() => import('./pages/Estudio'))
const Contacto = lazy(() => import('./pages/Contacto'))
const Reservar = lazy(() => import('./pages/Reservar'))
const Portafolio = lazy(() => import('./pages/Portafolio'))
const Cotizador = lazy(() => import('./pages/Cotizador'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))

export default function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/estudio" element={<Estudio />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/reservar" element={<Reservar />} />
          <Route path="/portafolio" element={<Portafolio />} />
          <Route path="/cotizador" element={<Cotizador />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
