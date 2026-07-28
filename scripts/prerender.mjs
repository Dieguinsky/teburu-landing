// Generates real static HTML for the SEO-critical routes (FAQ + blog) after
// `vite build`, so search engines and link-preview crawlers (Reddit, etc.)
// get fully-rendered content instead of an empty <div id="root">.
//
// Every other route keeps working exactly as before: pure client-rendered
// SPA served from dist/index.html. Run with `npm run prerender` (already
// wired into `predeploy`, so `npm run deploy` covers this automatically).
import { createServer } from 'node:http'
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer'

const DIST_DIR = path.resolve('dist')
const BLOG_CONTENT_DIR = path.resolve('src/content/blog')
const SITE_URL = 'https://estudioteburu.cl'

// Routes that stay pure client-side SPA (not prerendered) — listed here only
// so the sitemap reflects the full site.
const STATIC_ROUTES = ['/nosotros', '/estudio', '/contacto', '/portafolio']

// Top-level routes prerendered to real static HTML (in addition to /faq and
// every /blog* route below). Kept short on purpose: /nosotros, /estudio,
// /contacto and /portafolio stay pure SPA for now. Note that '/' is special —
// its output file (dist/index.html) is also the SPA fallback shell that
// public/404.html redirects every non-prerendered route to, so prerendering
// it means a hard-reload/deep-link to one of those routes briefly shows
// Home's markup before React mounts and swaps in the right page. Accepted as
// a minor, standard SPA+prerender tradeoff — the alternative (leaving '/'
// as an empty shell) is worse for crawlers hitting the homepage itself.
const PRERENDERED_TOP_ROUTES = ['/', '/servicios', '/reservar', '/cotizador']

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
}

// Mirrors the public/404.html + index.html GitHub Pages fallback: any path
// without its own file falls back to the SPA shell.
function startServer() {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent(req.url.split('?')[0])
      let filePath = path.join(DIST_DIR, urlPath)

      if (urlPath.endsWith('/')) {
        filePath = path.join(filePath, 'index.html')
      }

      if (!existsSync(filePath)) {
        filePath = path.join(DIST_DIR, 'index.html')
      }

      const body = await readFile(filePath)
      const ext = path.extname(filePath)
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' })
      res.end(body)
    } catch (err) {
      res.writeHead(500)
      res.end(String(err))
    }
  })

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server))
  })
}

async function getBlogSlugs() {
  const files = await readdir(BLOG_CONTENT_DIR)
  // CLAUDE.md documents this content folder for Claude Code — it's not a post.
  return files
    .filter((file) => file.endsWith('.md') && file !== 'CLAUDE.md')
    .map((file) => file.replace(/\.md$/, ''))
}

function outputPathFor(route) {
  return path.join(DIST_DIR, route === '/' ? '' : route, 'index.html')
}

async function prerenderRoute(page, baseUrl, route) {
  // domcontentloaded, not networkidle0: some routes embed third-party iframes
  // that poll continuously (Google Calendar on /reservar, Google Maps and the
  // Instagram embed script on /) and would never let the network go idle,
  // hanging the build. The explicit canonical-link wait below is the actual
  // "React has rendered" signal, independent of background network chatter.
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded' })
  // The Seo component writes a <link rel="canonical"> on mount — waiting for
  // it confirms React actually rendered before we capture the DOM.
  await page.waitForSelector('link[rel="canonical"]', { timeout: 8000 })

  const html = await page.content()
  const outPath = outputPathFor(route)
  await mkdir(path.dirname(outPath), { recursive: true })
  await writeFile(outPath, html)
  console.log(`  prerendered ${route} -> ${path.relative(DIST_DIR, outPath)}`)
}

async function writeSitemap(routes) {
  const urls = routes.map((route) => `  <url><loc>${SITE_URL}${route}</loc></url>`).join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  await writeFile(path.join(DIST_DIR, 'sitemap.xml'), xml)
}

async function main() {
  if (!existsSync(DIST_DIR)) {
    throw new Error('dist/ not found — run `npm run build` before `npm run prerender`.')
  }

  const blogSlugs = await getBlogSlugs()
  const blogRoutes = ['/blog', ...blogSlugs.map((slug) => `/blog/${slug}`)]
  const routesToPrerender = [...PRERENDERED_TOP_ROUTES, '/faq', ...blogRoutes]

  const server = await startServer()
  const { port } = server.address()
  const baseUrl = `http://127.0.0.1:${port}`

  const browser = await puppeteer.launch({ headless: true })
  try {
    const page = await browser.newPage()
    console.log(`Prerendering ${routesToPrerender.length} route(s)...`)
    for (const route of routesToPrerender) {
      await prerenderRoute(page, baseUrl, route)
    }
  } finally {
    await browser.close()
    server.close()
  }

  await writeSitemap([...STATIC_ROUTES, ...routesToPrerender])
  console.log('dist/sitemap.xml regenerated.')
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
