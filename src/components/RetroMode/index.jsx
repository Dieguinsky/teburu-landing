import { useEffect, useRef, useState } from 'react'
import { pageImages } from '../../assets/pageImages'
import './RetroMode.scss'

// Classic 90s "visitor counter" gag — increments once per activation and
// persists in localStorage so it keeps climbing like the real thing.
const VISITOR_COUNT_KEY = 'teburu-retro-visitor-count'
const VISITOR_COUNT_SEED = 10426

function nextVisitorCount() {
  try {
    const stored = Number(localStorage.getItem(VISITOR_COUNT_KEY))
    const next = (Number.isFinite(stored) && stored > 0 ? stored : VISITOR_COUNT_SEED) + 1
    localStorage.setItem(VISITOR_COUNT_KEY, String(next))
    return next
  } catch {
    return VISITOR_COUNT_SEED
  }
}

// Extra decoration layered on top of the page while retro-mode is on (see
// Layout, which toggles the `retro-mode` class that drives styles/_retro.scss).
// Everything here is fixed-position and pointer-events-safe: purely additive,
// never shifts existing layout, and unmounts cleanly when the user exits.
export default function RetroMode({ onExit }) {
  const [visitorCount, setVisitorCount] = useState(VISITOR_COUNT_SEED)
  // localStorage.setItem is a side effect, so it can't live in the useState
  // initializer above — React.StrictMode invokes that twice in dev and would
  // bump the counter by 2 per activation. The ref guards the effect itself
  // against StrictMode's double-invoke for the same reason.
  const hasIncrementedRef = useRef(false)

  useEffect(() => {
    if (hasIncrementedRef.current) return
    hasIncrementedRef.current = true
    setVisitorCount(nextVisitorCount())
  }, [])

  return (
    <>
      <div className="retro-stars" aria-hidden="true">
        {pageImages.retroStars.map((src, index) => (
          <img key={src} src={src} alt="" className={`retro-star retro-star--${index + 1}`} />
        ))}
      </div>

      <div className="retro-widget">
        <p className="retro-widget__counter">
          訪問者 VISITORS
          <br />
          <span>{String(visitorCount).padStart(6, '0')}</span>
        </p>
        <button type="button" className="retro-widget__exit" onClick={onExit}>
          ✦ 戻る ✦ Salir del modo retro
        </button>
      </div>
    </>
  )
}
