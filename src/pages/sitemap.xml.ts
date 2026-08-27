import type { APIRoute } from 'astro'
import { supabase } from '../lib/supabase'

export const GET: APIRoute = async ({ site }) => {
  const base = site?.toString().replace(/\/$/, '') ?? 'https://divinetodo.com'

  const staticPages = ['', '/parole', '/actualites', '/ressources', '/confidentialite', '/conditions-utilisation']

  const { data: publications } = await supabase.from('publications').select('slug, type, updated_at').eq('is_published', true)
  const { data: resources } = await supabase.from('site_resources').select('slug, published_at').eq('is_published', true)

  const urls = [
    ...staticPages.map((p) => `${base}${p}`),
    ...(publications ?? []).map((p) => `${base}/${p.type === 'actualite' ? 'actualites' : 'parole'}/${p.slug}`),
    ...(resources ?? []).map((r) => `${base}/ressources/${r.slug}`),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } })
}