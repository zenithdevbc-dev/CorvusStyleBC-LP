import { test } from 'node:test'
import assert from 'node:assert/strict'
import { BASE, travelFrom } from './distance.js'

// fetch falso que responde por trecho da URL e guarda as URLs chamadas
function fakeFetch(routes) {
  const calls = []
  const fetchImpl = async (url) => {
    calls.push(url)
    const match = Object.keys(routes).find((part) => url.includes(part))
    return Response.json(match ? routes[match] : [])
  }
  return { fetchImpl, calls }
}

const route = { code: 'Ok', routes: [{ distance: 12226.5 }] }

test('CEP: busca no ViaCEP, geocodifica a rua e mede a rota a partir da base', async () => {
  const { fetchImpl, calls } = fakeFetch({
    'viacep.com.br/ws/14401150': { logradouro: 'Rua Frederico Moura', bairro: 'Cidade Nova', localidade: 'Franca', uf: 'SP' },
    'street=Rua+Frederico+Moura': [{ lat: '-20.54', lon: '-47.40' }],
    'router.project-osrm.org': route,
  })
  assert.deepEqual(await travelFrom(' 14401-150 ', fetchImpl), { label: 'Rua Frederico Moura, Cidade Nova, Franca-SP', km: 12.2 })
  assert.ok(calls.at(-1).includes(`${BASE.lon},${BASE.lat};-47.4,-20.54`))
})

test('CEP sem rua cai para a cidade; CEP inexistente devolve null', async () => {
  const { fetchImpl, calls } = fakeFetch({
    'viacep.com.br/ws/14400000': { logradouro: '', bairro: '', localidade: 'Franca', uf: 'SP' },
    'city=Franca': [{ lat: '-20.53', lon: '-47.39' }],
    'router.project-osrm.org': route,
  })
  assert.deepEqual(await travelFrom('14400000', fetchImpl), { label: 'Franca-SP', km: 12.2 })
  assert.ok(!calls.some((url) => url.includes('street=')))
  assert.equal(await travelFrom('99999-999', fakeFetch({ viacep: { erro: 'true' } }).fetchImpl), null)
})

test('endereço escrito vai direto ao Nominatim, perto da base; sem resultado devolve null', async () => {
  const { fetchImpl, calls } = fakeFetch({ 'nominatim': [{ lat: '-20.54', lon: '-47.40' }], 'router.project-osrm.org': route })
  assert.deepEqual(await travelFrom('Av. Champagnat, 100', fetchImpl), { label: 'Av. Champagnat, 100', km: 12.2 })
  assert.match(calls[0], /q=Av\.\+Champagnat/)
  assert.match(calls[0], /viewbox=/)
  assert.equal(await travelFrom('lugar que não existe', fakeFetch({}).fetchImpl), null)
})

test('erro HTTP é lançado para a tela mostrar "tente de novo"', async () => {
  const failing = async () => new Response('', { status: 503 })
  await assert.rejects(travelFrom('Rua X', failing))
})
