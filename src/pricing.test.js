import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calcTotal, buildWhatsAppLink, genericWhatsAppLink, findCoupon, discountValue, COUPONS, toggleAddon, travelFee } from './pricing.js'

test('preço base por veículo e pacote', () => {
  assert.equal(calcTotal('hatch', 'basico', []), 90)
  assert.equal(calcTotal('suv', 'basico', []), 100)
  assert.equal(calcTotal('pickup', 'basico', []), 120)
  assert.equal(calcTotal('pickup', 'tecnico', []), 180)
})

test('soma adicionais e ignora ids desconhecidos', () => {
  assert.equal(calcTotal('hatch', 'tecnico', ['motor', 'vidros-parabrisa']), 130 + 90 + 40)
  assert.equal(calcTotal('suv', 'basico', ['vidros-todos', 'xyz']), 100 + 120)
})

test('cristalização: para-brisa e todos os vidros se excluem', () => {
  assert.deepEqual(toggleAddon(['motor', 'vidros-parabrisa'], 'vidros-todos'), ['motor', 'vidros-todos'])
  assert.deepEqual(toggleAddon(['vidros-todos'], 'vidros-todos'), [])
  assert.deepEqual(toggleAddon(['vidros-todos'], 'motor'), ['vidros-todos', 'motor'])
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
  const url = buildWhatsAppLink('suv', 'tecnico', ['motor'], null, null, '5547999999999')
  assert.ok(url.startsWith('https://wa.me/5547999999999?text='))
  const text = decodeURIComponent(url.split('text=')[1])
  assert.match(text, /Veículo: SUV/)
  assert.match(text, /Pacote: Técnico/)
  assert.match(text, /Detalhamento de motor/)
  assert.match(text, /Total estimado: R\$\s240,00/)
  assert.doesNotMatch(text, /Cupom/)
})

test('cupom: busca ignora caixa e espaços, inativo não vale', () => {
  assert.equal(findCoupon(' brilho15 ').code, 'BRILHO15')
  assert.equal(findCoupon('NAOEXISTE'), null)
  COUPONS.push({ code: 'TESTE10', percent: 10, active: false })
  assert.equal(findCoupon('TESTE10'), null)
  COUPONS.pop()
})

test('cupom: desconto em centavos e aplicado no link', () => {
  const coupon = findCoupon('BRILHO15')
  assert.equal(discountValue(90, coupon), 13.5)
  assert.equal(discountValue(90, null), 0)
  const text = decodeURIComponent(buildWhatsAppLink('hatch', 'basico', [], coupon).split('text=')[1])
  assert.match(text, /Cupom BRILHO15 \(-15%\): -R\$\s13,50/)
  assert.match(text, /Total estimado: R\$\s76,50/)
})

test('cupom ESPECIAL44: 44% de desconto, arredondado em centavos', () => {
  const coupon = findCoupon('especial44')
  assert.equal(coupon.percent, 44)
  assert.equal(discountValue(130, coupon), 57.2)
  assert.equal(discountValue(250, coupon), 110)
  const text = decodeURIComponent(buildWhatsAppLink('suv', 'tecnico', ['motor'], coupon).split('text=')[1])
  assert.match(text, /Cupom ESPECIAL44 \(-44%\): -R\$\s105,60/)
  assert.match(text, /Total estimado: R\$\s134,40/)
  assert.match(text, /Deslocamento: A partir de 15 km rodados, adicional de R\$ 1,85 por km adicional\./)
})

test('deslocamento: até 15 km sem custo, acima cobra R$ 1,85 por km excedente', () => {
  assert.equal(travelFee(0), 0)
  assert.equal(travelFee(15), 0)
  assert.equal(travelFee(16), 1.85)
  assert.equal(travelFee(95.8), 149.48)
})

test('deslocamento entra no link e no total, fora do desconto do cupom', () => {
  const coupon = findCoupon('BRILHO15')
  const travel = { label: 'Ribeirão Preto, SP', km: 95.8 }
  const text = decodeURIComponent(buildWhatsAppLink('hatch', 'basico', [], coupon, travel).split('text=')[1])
  assert.match(text, /Endereço: Ribeirão Preto, SP/)
  assert.match(text, /Deslocamento \(95,8 km\): R\$\s149,48/)
  assert.match(text, /Total estimado: R\$\s225,98/) // 90 - 13,50 + 149,48
  assert.doesNotMatch(text, /A partir de 15 km/)
  const near = decodeURIComponent(buildWhatsAppLink('hatch', 'basico', [], null, { label: 'Centro', km: 12 }).split('text=')[1])
  assert.match(near, /Deslocamento \(12 km\): sem custo/)
  assert.match(near, /Total estimado: R\$\s90,00/)
})
