import { HashRouter } from 'react-router-dom'
import AppRoutes from './routes'
import ScrollToTop from './components/ScrollToTop'
import Analytics from './components/Analytics'

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Analytics />
      <AppRoutes />
    </HashRouter>
  )
}

export default App
