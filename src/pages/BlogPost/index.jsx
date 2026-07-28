import { Link, useParams } from 'react-router-dom'
import Seo, { JsonLd } from '../../components/Seo'
import { BRAND, CONTACT_INFO } from '../../content/copy'
import { getPostBySlug } from '../../lib/blog'
import './BlogPost.scss'

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <main className="blog-post blog-post--not-found">
        <h1>No encontramos ese artículo</h1>
        <Link to="/blog" className="button button--accent">
          Volver al blog
        </Link>
      </main>
    )
  }

  const postSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: BRAND,
    },
  }

  return (
    <main className="blog-post">
      <Seo title={`${post.title} — ${BRAND}`} description={post.description} path={`/blog/${post.slug}`} />
      <JsonLd id="blog-post-schema" schema={postSchema} />

      <article className="blog-post__article">
        <Link to="/blog" className="blog-post__back">
          ← Volver al blog
        </Link>
        <time className="blog-post__date" dateTime={post.date}>
          {formatDate(post.date)}
          {post.author ? ` · Por ${post.author}` : ''}
        </time>
        <h1 className="blog-post__title">{post.title}</h1>
        <div className="blog-post__body" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>

      <section className="blog-post-cta">
        <h2 className="blog-post-cta__title">¿Tienes un proyecto en mente?</h2>
        <p className="blog-post-cta__email">{CONTACT_INFO.email}</p>
        <Link to="/contacto" className="button button--accent">
          Formulario de contacto
        </Link>
      </section>
    </main>
  )
}
