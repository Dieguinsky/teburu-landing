import { HashRouter } from 'react-router-dom'
import AppRoutes from './routes'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <AppRoutes />
    </HashRouter>
  )
}

export default App
