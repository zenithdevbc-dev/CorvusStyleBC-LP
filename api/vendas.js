// Contador público de orçamentos enviados pelo WhatsApp (Vercel Function + Upstash Redis).
// GET devolve o total; POST conta um envio. Credenciais vêm da integração Upstash no painel da Vercel.

const KEY = 'corvus:vendas'
const COOLDOWN_SECONDS = 60

export function redisFromEnv(env = process.env, fetchImpl = fetch) {
  const url = env.KV_REST_API_URL ?? env.UPSTASH_REDIS_REST_URL
  const token = env.KV_REST_API_TOKEN ?? env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return async (...command) => {
    const response = await fetchImpl(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(command),
    })
    if (!response.ok) throw new Error(`Upstash respondeu ${response.status}`)
    return (await response.json()).result
  }
}

export const readTotal = async (redis) => Number((await redis('GET', KEY)) ?? 0)

// No máximo um envio por visitante a cada minuto: cliques repetidos ou um script não inflam o número público
export async function countSale(redis, visitor) {
  const first = await redis('SET', `${KEY}:visitante:${visitor}`, '1', 'NX', 'EX', COOLDOWN_SECONDS)
  return first === 'OK' ? Number(await redis('INCR', KEY)) : readTotal(redis)
}

// IP vira um hash curto: dá para limitar repetição sem guardar o endereço
export async function visitorId(request) {
  const ip =
    request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'desconhecido'
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip)))
  return Array.from(digest.slice(0, 8), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

const json = (body, status, cache = 'no-store') => Response.json(body, { status, headers: { 'Cache-Control': cache } })

async function respond(work) {
  const redis = redisFromEnv()
  if (!redis) return json({ error: 'Contador não configurado.' }, 503)
  try {
    return await work(redis)
  } catch (error) {
    console.error(error)
    return json({ error: 'Contador indisponível.' }, 502)
  }
}

export function GET() {
  // Cache de 1 minuto na CDN: a página pública não consulta o Redis a cada visita
  return respond(async (redis) => json({ total: await readTotal(redis) }, 200, 's-maxage=60, stale-while-revalidate=300'))
}

export function POST(request) {
  return respond(async (redis) => json({ total: await countSale(redis, await visitorId(request)) }, 200))
}
