const ALLOWED_ORIGINS = [
  'https://estudioteburu.cl',
  'https://www.estudioteburu.cl',
  'https://dieguinsky.github.io',
  'http://localhost:5173',
]

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const headers = corsHeaders(origin)

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers })
    }

    let body
    try {
      body = await request.json()
    } catch {
      body = null
    }

    const key = typeof body?.code === 'string' ? body.code.trim().toLowerCase() : ''
    const coupons = JSON.parse(env.COUPONS || '{}')
    const coupon = key ? coupons[key] : null

    const result = coupon ? { valid: true, discount: coupon.discount, label: coupon.code } : { valid: false }

    return new Response(JSON.stringify(result), {
      headers: { ...headers, 'Content-Type': 'application/json' },
    })
  },
}
