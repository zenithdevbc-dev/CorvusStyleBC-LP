import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calcTotal, buildWhatsAppLink, genericWhatsAppLink } from './pricing.js'

test('preço base por veículo e pacote', () => {
  assert.equal(calcTotal('hatch', 'basico', []), 90)
  assert.equal(calcTotal('suv', 'basico', []), 100)
  assert.equal(calcTotal('pickup', 'basico', []), 120)
  assert.equal(calcTotal('pickup', 'tecnico', []), 180)
})

test('soma adicionais e ignora ids desconhecidos', () => {
  assert.equal(calcTotal('hatch', 'tecnico', ['ar', 'motor', 'vidros']), 130 + 50 + 90 + 40)
  assert.equal(calcTotal('suv', 'basico', ['vidros', 'xyz']), 100 + 40)
})

test('combinação inválida lança erro', () => {
  assert.throws(() => calcTotal('moto', 'basico', []))
  assert.throws(() => calcTotal('hatch', 'premium', []))
})

test('links usam o número padrão com DDI', () => {
  assert.ok(buildWhatsAppLink('hatch', 'basico', []).startsWith('https://wa.me/5516994011355?text='))
  assert.ok(genericWhatsAppLink().startsWith('https://wa.me/5516994011355?text='))
})

test('link do WhatsApp contém itens e total, codificados', () => {
  const url = buildWhatsAppLink('suv', 'tecnico', ['ar'], '5547999999999')
  assert.ok(url.startsWith('https://wa.me/5547999999999?text='))
  const text = decodeURIComponent(url.split('text=')[1])
  assert.match(text, /Veículo: SUV/)
  assert.match(text, /Pacote: Técnico/)
  assert.match(text, /Higienização de ar-condicionado/)
  assert.match(text, /Total estimado: R\$\s200,00/)
})
