export async function GET(req: Request) {
  const url = new URL(req.url)
  const target = url.searchParams.get('url')

  if (!target) {
    return new Response('Missing url parameter', { status: 400 })
  }

  let parsed: URL
  try {
    parsed = new URL(target)
  } catch {
    return new Response('Invalid url', { status: 400 })
  }

  const allowedHosts = new Set(['images.unsplash.com', 'source.unsplash.com'])
  if (parsed.protocol !== 'https:' || !allowedHosts.has(parsed.hostname)) {
    return new Response('Forbidden host', { status: 403 })
  }

  const upstream = await fetch(parsed.toString(), {
    headers: {
      Accept: 'image/*',
      // Aide certains CDNs à délivrer correctement les images
      Referer: 'https://unsplash.com/',
      'User-Agent': 'EcoTP-Dashboard/1.0 (+https://localhost)'
    },
    cache: 'no-store'
  })

  if (!upstream.ok || !upstream.body) {
    return new Response(`Upstream error: ${upstream.status}`, { status: 502 })
  }

  const contentType = upstream.headers.get('content-type') ?? 'image/jpeg'

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'content-type': contentType,
      'cache-control': 'public, max-age=3600'
    }
  })
}