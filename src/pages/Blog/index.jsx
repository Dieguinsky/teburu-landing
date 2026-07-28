import { Link } from 'react-router-dom'
import Reveal from '../../components/Reveal'
import Seo from '../../components/Seo'
import { pageImages } from '../../assets/pageImages'
import { BLOG_INFO } from '../../content/copy'
import { BLOG_POSTS } from '../../lib/blog'
import './Blog.scss'

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function Blog() {
  return (
    <main className="blog-page">
      <Seo title={BLOG_INFO.seoTitle} description={BLOG_INFO.seoDescription} path="/blog" />

      <section
        className="blog-hero"
        style={{ backgroundImage: `url(${pageImages.portafolioHero})` }}
      >
        <div className="blog-hero__overlay" />
        <h1 className="blog-hero__title">{BLOG_INFO.title}</h1>
        <p className="blog-hero__subtitle">{BLOG_INFO.subtitle}</p>
      </section>

      <section className="blog-list">
        <div className="blog-list__inner">
          {BLOG_POSTS.map((post, index) => (
            <Reveal as="article" key={post.slug} className="blog-card" delay={index * 60}>
              <Link to={`/blog/${post.slug}`} className="blog-card__link">
                <time className="blog-card__date" dateTime={post.date}>
                  {formatDate(post.date)}
                  {post.author ? ` · Por ${post.author}` : ''}
                </time>
                <h2 className="blog-card__title">{post.title}</h2>
                <p className="blog-card__excerpt">{post.description}</p>
                <span className="blog-card__cta">Leer más →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  )
}
