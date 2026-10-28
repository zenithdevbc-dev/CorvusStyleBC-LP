// Contador de orçamentos enviados pelo WhatsApp (função em api/vendas.js)
const ENDPOINT = '/api/vendas'

// sendBeacon sobrevive à abertura do WhatsApp; falha no contador nunca atrapalha o envio
export function registerSale() {
  try {
    if (!navigator.sendBeacon?.(ENDPOINT)) fetch(ENDPOINT, { method: 'POST', keepalive: true }).catch(() => {})
  } catch {}
}

export async function fetchSalesTotal() {
  try {
    const response = await fetch(ENDPOINT)
    if (!response.ok) return null
    const { total } = await response.json()
    return Number.isFinite(total) ? total : null
  } catch {
    return null
  }
}
