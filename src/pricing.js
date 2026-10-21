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
    description: 'Descontaminação da pintura, limpeza técnica interna e proteção dos plásticos.',
    prices: { hatch: 130, suv: 150, pickup: 180 },
  },
]

export const ADDONS = [
  { id: 'ar', label: 'Higienização de ar-condicionado', price: 50 },
  { id: 'motor', label: 'Detalhamento de motor', price: 90 },
  { id: 'vidros', label: 'Cristalização de vidros', price: 40 },
]

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
export const formatBRL = (value) => brl.format(value)

const byId = (list, id) => list.find((item) => item.id === id)

export function calcTotal(vehicleId, packageId, addonIds) {
  const pkg = byId(PACKAGES, packageId)
  if (!pkg || !(vehicleId in pkg.prices)) throw new Error(`Combinação inválida: ${vehicleId}/${packageId}`)
  return pkg.prices[vehicleId] + ADDONS.filter((a) => addonIds.includes(a.id)).reduce((sum, a) => sum + a.price, 0)
}

export function buildWhatsAppLink(vehicleId, packageId, addonIds, phone = WHATSAPP_NUMBER) {
  const vehicle = byId(VEHICLES, vehicleId)
  const pkg = byId(PACKAGES, packageId)
  const extras = ADDONS.filter((a) => addonIds.includes(a.id))
  const lines = [
    'Olá, Corvus Style! Quero agendar:',
    `• Veículo: ${vehicle.label}`,
    `• Pacote: ${pkg.label} (${formatBRL(pkg.prices[vehicleId])})`,
    ...extras.map((a) => `• + ${a.label} (${formatBRL(a.price)})`),
    `Total estimado: ${formatBRL(calcTotal(vehicleId, packageId, addonIds))}`,
    'Qual o melhor dia e horário?',
  ]
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`
}

export const genericWhatsAppLink = (phone = WHATSAPP_NUMBER) =>
  `https://wa.me/${phone}?text=${encodeURIComponent('Olá, Corvus Style! Quero agendar um horário.')}`

