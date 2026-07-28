import { marked } from 'marked'

const postModules = import.meta.glob('../content/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

// Minimal frontmatter parser for our fixed post format (single-line
// `key: "value"` pairs). Full YAML libs (e.g. gray-matter -> js-yaml) pull in
// Node's Buffer, which doesn't exist in the browser bundle.
function parseFrontmatter(raw) {
  const match = raw.match(FRONTMATTER_RE)
  if (!match) return { data: {}, content: raw }

  const [, frontmatter, content] = match
  const data = {}
  for (const line of frontmatter.split(/\r?\n/)) {
    const lineMatch = line.match(/^(\w+):\s*(.*)$/)
    if (!lineMatch) continue
    const [, key, rawValue] = lineMatch
    data[key] = rawValue.trim().replace(/^["']|["']$/g, '')
  }
  return { data, content }
}

function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '')
}

export const BLOG_POSTS = Object.entries(postModules)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw)
    return {
      slug: slugFromPath(path),
      title: data.title,
      description: data.description,
      date: data.date,
      author: data.author,
      html: marked.parse(content),
    }
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date))

export function getPostBySlug(slug) {
  return BLOG_POSTS.find((post) => post.slug === slug)
}
