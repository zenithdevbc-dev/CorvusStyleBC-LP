// Tabela de preços e geração da mensagem do WhatsApp. Sem React: testável com `npm test`.

// Só dígitos: DDI 55 + DDD + número (o wa.me não funciona sem o DDI)
export const WHATSAPP_NUMBER = '5516994011355'

export const VEHICLES = [
  { id: 'hatch', label: 'Hatch / Sedan' },
  { id: 'suv', label: 'SUV' },
  { id: 'pickup', label: 'Camionete' },
]

export const PACKAGES = [
  {
    id: 'basico',
    label: 'Básico',
    description: 'Lavagem detalhada, aspiração interna e limpeza de painel e vidros.',
    prices: { hatch: 90, suv: 100, pickup: 120 },
  },
  {
    id: 'tecnico',
    label: 'Técnico',
    description: 'Limpeza técnica interna e proteção dos plásticos.',
    prices: { hatch: 130, suv: 150, pickup: 180 },
  },
]

export const ADDONS = [
  { id: 'motor', label: 'Detalhamento de motor', price: 90 },
  { id: 'descontaminacao', label: 'Descontaminação de Pintura', price: 75 },
  // Mesmo `group` = opções que se excluem (marcar uma desmarca a outra)
  { id: 'vidros-parabrisa', label: 'Cristalização de vidros (só para-brisa)', price: 40, group: 'vidros' },
  { id: 'vidros-todos', label: 'Cristalização de vidros (todos os vidros)', price: 120, group: 'vidros' },
]

export function toggleAddon(selected, id) {
  if (selected.includes(id)) return selected.filter((a) => a !== id)
  const group = byId(ADDONS, id)?.group
  const sameGroup = (a) => group && byId(ADDONS, a)?.group === group
  return [...selected.filter((a) => !sameGroup(a)), id]
}

// Cupons: ative ou desative trocando `active`. O código é comparado sem diferenciar maiúsculas.
// shortcut: os códigos ficam visíveis no JS do site e o "uso único" é só por navegador; trocar por backend se um cupom valer muito
export const COUPONS = [
  { code: 'BRILHO15', percent: 15, active: true },
  { code: 'ESPECIAL44', percent: 44, active: true },
]

export function findCoupon(code) {
  const coupon = COUPONS.find((c) => c.code === code.trim().toUpperCase())
  return coupon?.active ? coupon : null
}

export const discountValue = (total, coupon) => (coupon ? Math.round(total * coupon.percent) / 100 : 0)

// Deslocamento: distância de carro da base (src/distance.js); cobra só os km acima da franquia
export const TRAVEL_POLICY = 'A partir de 15 km rodados, adicional de R$ 1,85 por km adicional.'
const TRAVEL_FREE_KM = 15
const TRAVEL_PRICE_PER_KM = 1.85
export const travelFee = (km) => (km > TRAVEL_FREE_KM ? Math.round((km - TRAVEL_FREE_KM) * TRAVEL_PRICE_PER_KM * 100) / 100 : 0)

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
export const formatBRL = (value) => brl.format(value)

const byId = (list, id) => list.find((item) => item.id === id)

export function calcTotal(vehicleId, packageId, addonIds) {
  const pkg = byId(PACKAGES, packageId)
  if (!pkg || !(vehicleId in pkg.prices)) throw new Error(`Combinação inválida: ${vehicleId}/${packageId}`)
  return pkg.prices[vehicleId] + ADDONS.filter((a) => addonIds.includes(a.id)).reduce((sum, a) => sum + a.price, 0)
}

// travel = { label, km } do endereço calculado, ou null se o cliente não informou
export function buildWhatsAppLink(vehicleId, packageId, addonIds, coupon = null, travel = null, phone = WHATSAPP_NUMBER) {
  const vehicle = byId(VEHICLES, vehicleId)
  const pkg = byId(PACKAGES, packageId)
  const extras = ADDONS.filter((a) => addonIds.includes(a.id))
  const total = calcTotal(vehicleId, packageId, addonIds)
  // O cupom vale para os serviços, não para o deslocamento
  const discount = discountValue(total, coupon)
  const fee = travel ? travelFee(travel.km) : 0
  const kmText = travel && `${String(travel.km).replace('.', ',')} km`
  const lines = [
    'Olá, Corvus Style! Quero agendar:',
    `• Veículo: ${vehicle.label}`,
    `• Pacote: ${pkg.label} (${formatBRL(pkg.prices[vehicleId])})`,
    ...extras.map((a) => `• + ${a.label} (${formatBRL(a.price)})`),
    ...(coupon ? [`• Cupom ${coupon.code} (-${coupon.percent}%): -${formatBRL(discount)}`] : []),
    ...(travel
      ? [`• Endereço: ${travel.label}`, `• Deslocamento (${kmText}): ${fee ? formatBRL(fee) : 'sem custo'}`]
      : []),
    `Total estimado: ${formatBRL(total - discount + fee)}`,
    ...(travel ? [] : [`Deslocamento: ${TRAVEL_POLICY}`]),
    'Qual o melhor dia e horário?',
  ]
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`
}

export const genericWhatsAppLink = (phone = WHATSAPP_NUMBER) =>
  `https://wa.me/${phone}?text=${encodeURIComponent('Olá, Corvus Style! Quero agendar um horário.')}`

