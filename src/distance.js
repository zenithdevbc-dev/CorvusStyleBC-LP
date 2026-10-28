// Distância de carro da base até o cliente, só com serviços gratuitos e sem chave:
// ViaCEP (CEP → endereço), Nominatim/OpenStreetMap (endereço → coordenadas) e OSRM (rota).
// shortcut: Nominatim e OSRM públicos limitam o uso (~1 req/s) e não têm garantia; trocar por Google/Mapbox com chave se o volume crescer
export const BASE = { lat: -20.5817, lon: -47.3403 }

const CEP = /^\d{5}-?\d{3}$/

async function getJson(fetchImpl, url) {
  const response = await fetchImpl(url)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}

async function geocode(fetchImpl, params) {
  const query = new URLSearchParams({ format: 'jsonv2', limit: '1', countrycodes: 'br', 'accept-language': 'pt-BR', ...params })
  const [place] = await getJson(fetchImpl, `https://nominatim.openstreetmap.org/search?${query}`)
  return place ? { lat: Number(place.lat), lon: Number(place.lon) } : null
}

export async function findPlace(input, fetchImpl = fetch) {
  const text = input.trim()
  if (CEP.test(text)) {
    const cep = await getJson(fetchImpl, `https://viacep.com.br/ws/${text.replace('-', '')}/json/`)
    if (cep.erro) return null
    const city = { city: cep.localidade, state: cep.uf, country: 'Brasil' }
    // CEP de cidade pequena não tem rua: cai para o centro da cidade
    const point = (cep.logradouro && (await geocode(fetchImpl, { street: cep.logradouro, ...city }))) || (await geocode(fetchImpl, city))
    return point && { ...point, label: [cep.logradouro, cep.bairro, `${cep.localidade}-${cep.uf}`].filter(Boolean).join(', ') }
  }
  // viewbox prioriza resultados perto da base quando o cliente escreve só "Rua X, 123"
  const viewbox = [BASE.lon - 0.5, BASE.lat + 0.5, BASE.lon + 0.5, BASE.lat - 0.5].join(',')
  const point = await geocode(fetchImpl, { q: text, viewbox })
  return point && { ...point, label: text }
}

export async function drivingKm(to, fetchImpl = fetch) {
  const url = `https://router.project-osrm.org/route/v1/driving/${BASE.lon},${BASE.lat};${to.lon},${to.lat}?overview=false`
  const { code, routes } = await getJson(fetchImpl, url)
  if (code !== 'Ok' || !routes?.length) return null
  return Math.round(routes[0].distance / 100) / 10
}

// null = endereço não encontrado ou sem rota; erro de rede é lançado
export async function travelFrom(input, fetchImpl = fetch) {
  const place = await findPlace(input, fetchImpl)
  if (!place) return null
  const km = await drivingKm(place, fetchImpl)
  return km === null ? null : { label: place.label, km }
}
