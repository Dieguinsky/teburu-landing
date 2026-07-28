import { Link } from 'react-router-dom'
import Reveal from '../../components/Reveal'
import Seo, { JsonLd } from '../../components/Seo'
import { pageImages } from '../../assets/pageImages'
import { BRAND, FAQ_INFO, FAQ_ITEMS, CONTACT_INFO } from '../../content/copy'
import './FAQ.scss'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  })),
}

export default function FAQ() {
  return (
    <main className="faq-page">
      <Seo title={FAQ_INFO.seoTitle} description={FAQ_INFO.seoDescription} path="/faq" />
      <JsonLd id="faq-schema" schema={faqSchema} />

      <section
        className="faq-hero"
        style={{ backgroundImage: `url(${pageImages.portafolioHero})` }}
      >
        <div className="faq-hero__overlay" />
        <h1 className="faq-hero__title">{FAQ_INFO.title}</h1>
        <p className="faq-hero__subtitle">{FAQ_INFO.subtitle}</p>
      </section>

      <section className="faq-list">
        <div className="faq-list__inner">
          {FAQ_ITEMS.map(({ id, question, answer }, index) => (
            <Reveal as="details" key={id} className="faq-item" delay={index * 60}>
              <summary className="faq-item__question">{question}</summary>
              <p className="faq-item__answer">{answer}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="faq-cta">
        <Reveal as="div" className="faq-cta__inner">
          <h2 className="faq-cta__title">¿No encontraste tu respuesta?</h2>
          <p className="faq-cta__email">{CONTACT_INFO.email}</p>
          <Link to="/contacto" className="button button--accent">
            Formulario de contacto
          </Link>
        </Reveal>
      </section>

      <footer className="faq-footer">
        <p>Copyright © {new Date().getFullYear()} {BRAND}</p>
      </footer>
    </main>
  )
}
