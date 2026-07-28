import { useEffect } from 'react'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import AppRoutes from './routes'
import ScrollToTop from './components/ScrollToTop'
import Analytics from './components/Analytics'

// Old links shared before the HashRouter -> BrowserRouter switch look like
// /#/servicios. BrowserRouter ignores that fragment, so without this they'd
// silently land on Home instead of the intended page.
function LegacyHashRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    const { hash } = window.location
    if (hash.startsWith('#/')) {
      navigate(hash.slice(1) || '/', { replace: true })
    }
  }, [navigate])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <LegacyHashRedirect />
      <ScrollToTop />
      <Analytics />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
