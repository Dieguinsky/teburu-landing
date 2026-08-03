import { marked } from 'marked'

// Excludes CLAUDE.md (repo documentation for this content folder, not a post)
// so it never gets picked up as a blog entry.
const postModules = import.meta.glob(['../content/blog/*.md', '!../content/blog/CLAUDE.md'], {
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
  // Number posts by original publish order (oldest = 1) before re-sorting
  // newest-first for display.
  .sort((a, b) => new Date(a.date) - new Date(b.date))
  .map((post, index) => ({ ...post, number: index + 1 }))
  .sort((a, b) => new Date(b.date) - new Date(a.date))

export function getPostBySlug(slug) {
  return BLOG_POSTS.find((post) => post.slug === slug)
}
