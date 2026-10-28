import { test } from 'node:test'
import assert from 'node:assert/strict'
import { countSale, readTotal, redisFromEnv, visitorId } from './vendas.js'

// Redis em memória com os comandos usados (SET NX EX, INCR, GET); o tempo é controlado pelo teste
function fakeRedis() {
  const data = new Map()
  const redis = async (command, key, value, ...options) => {
    const expired = (entry) => entry && entry.until !== null && entry.until <= redis.now
    if (expired(data.get(key))) data.delete(key)
    if (command === 'GET') return data.get(key)?.value ?? null
    if (command === 'INCR') {
      const next = String(Number(data.get(key)?.value ?? 0) + 1)
      data.set(key, { value: next, until: null })
      return Number(next)
    }
    if (command === 'SET') {
      if (options.includes('NX') && data.has(key)) return null
      const seconds = options.includes('EX') ? Number(options[options.indexOf('EX') + 1]) : null
      data.set(key, { value, until: seconds === null ? null : redis.now + seconds })
      return 'OK'
    }
    throw new Error(`comando não suportado: ${command}`)
  }
  redis.now = 0
  return redis
}

test('conta um envio por visitante a cada minuto', async () => {
  const redis = fakeRedis()
  assert.equal(await readTotal(redis), 0)
  assert.equal(await countSale(redis, 'ana'), 1)
  assert.equal(await countSale(redis, 'ana'), 1) // clique repetido no mesmo minuto
  assert.equal(await countSale(redis, 'bruno'), 2)
  redis.now = 61
  assert.equal(await countSale(redis, 'ana'), 3)
  assert.equal(await readTotal(redis), 3)
})

test('usa as variáveis da integração Upstash da Vercel e fala a API REST', async () => {
  assert.equal(redisFromEnv({}), null)
  const calls = []
  const fakeFetch = async (url, init) => {
    calls.push({ url, auth: init.headers.Authorization, body: JSON.parse(init.body) })
    return Response.json({ result: 7 })
  }
  const redis = redisFromEnv({ KV_REST_API_URL: 'https://x.upstash.io', KV_REST_API_TOKEN: 'segredo' }, fakeFetch)
  assert.equal(await redis('INCR', 'corvus:vendas'), 7)
  assert.deepEqual(calls, [{ url: 'https://x.upstash.io', auth: 'Bearer segredo', body: ['INCR', 'corvus:vendas'] }])
  assert.ok(redisFromEnv({ UPSTASH_REDIS_REST_URL: 'u', UPSTASH_REDIS_REST_TOKEN: 't' }, fakeFetch))
})

test('visitante identificado por hash do IP, nunca pelo IP em si', async () => {
  const request = (headers) => new Request('https://site/api/vendas', { method: 'POST', headers })
  const id = await visitorId(request({ 'x-forwarded-for': '200.1.2.3, 10.0.0.1' }))
  assert.match(id, /^[0-9a-f]{16}$/)
  assert.equal(await visitorId(request({ 'x-real-ip': '200.1.2.3' })), id)
  assert.notEqual(await visitorId(request({ 'x-real-ip': '200.1.2.4' })), id)
})
