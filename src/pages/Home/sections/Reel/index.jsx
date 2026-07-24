import { useEffect } from 'react'
import Reveal from '../../../../components/Reveal'
import { CONTACT_INFO, HOME_REEL } from '../../../../content/copy'
import './Reel.scss'

const EMBED_SCRIPT_ID = 'instagram-embed-script'
const EMBED_SCRIPT_SRC = 'https://www.instagram.com/embed.js'

export default function Reel() {
  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process()
      return
    }

    if (document.getElementById(EMBED_SCRIPT_ID)) return

    const script = document.createElement('script')
    script.id = EMBED_SCRIPT_ID
    script.src = EMBED_SCRIPT_SRC
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <section className="reel">
      <div className="reel__layout">
        <Reveal as="div" className="reel__copy">
          <h2 className="section-title reel__title">{HOME_REEL.title}</h2>
          <p className="reel__text">{HOME_REEL.text}</p>
          <a
            href={CONTACT_INFO.instagram}
            target="_blank"
            rel="noreferrer"
            className="button button--accent"
          >
            {HOME_REEL.cta}
          </a>
        </Reveal>
        <Reveal as="div" className="reel__embed" delay={120}>
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={HOME_REEL.url}
            data-instgrm-version="14"
          />
        </Reveal>
      </div>
    </section>
  )
}
