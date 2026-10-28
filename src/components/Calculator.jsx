import { useState } from 'react'
import { ArrowRight, Car, Check, Info } from 'lucide-react'
import { ADDONS, PACKAGES, VEHICLES, buildWhatsAppLink, calcTotal, discountValue, findCoupon, formatBRL, toggleAddon } from '../pricing.js'
import { registerSale } from '../salesCounter.js'

// Cupons já usados ficam no navegador do cliente; sem localStorage (aba anônima bloqueada) o controle só dura a visita
const USED_KEY = 'corvus:cupons-usados'
function readUsed() {
  try {
    return JSON.parse(localStorage.getItem(USED_KEY)) ?? []
  } catch {
    return []
  }
}
function saveUsed(list) {
  try {
    localStorage.setItem(USED_KEY, JSON.stringify(list))
  } catch {}
}

// Radio/checkbox nativos escondidos: teclado e leitor de tela funcionam sem código extra
const optionClass =
  'flex cursor-pointer items-center gap-4 rounded-xl border border-line bg-surface px-5 py-4 shadow-sm transition-all duration-200 ease-in-out hover:border-wine/30 hover:shadow-md active:scale-[0.99] has-checked:border-wine has-checked:bg-wine-soft has-checked:ring-1 has-checked:ring-wine has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-wine'

function Step({ n, title, children }) {
  return (
    <fieldset>
      <legend className="mb-4 flex items-center gap-3 font-semibold">
        <span className="flex size-7 items-center justify-center rounded-full bg-ink text-xs text-white">{n}</span>
        {title}
      </legend>
      {children}
    </fieldset>
  )
}

export default function Calculator() {
  const [vehicle, setVehicle] = useState('hatch')
  const [pkg, setPkg] = useState('basico')
  const [addons, setAddons] = useState([])

  const [couponInput, setCouponInput] = useState('')
  const [couponTouched, setCouponTouched] = useState(false)
  const [usedCoupons, setUsedCoupons] = useState(readUsed)

  const total = calcTotal(vehicle, pkg, addons)
  const selectedPkg = PACKAGES.find((p) => p.id === pkg)

  const found = findCoupon(couponInput)
  const alreadyUsed = Boolean(found && usedCoupons.includes(found.code))
  const coupon = found && !alreadyUsed ? found : null
  const discount = discountValue(total, coupon)
  const couponError = alreadyUsed
    ? 'Você já usou este cupom.'
    : couponTouched && couponInput.trim() && !found
      ? 'Cupom inválido ou expirado.'
      : ''

  // O uso é registrado quando o cliente envia o pedido com o cupom, não quando digita
  const markCouponUsed = () => {
    if (!coupon) return
    const next = [...usedCoupons, coupon.code]
    saveUsed(next)
    setUsedCoupons(next)
  }

  return (
    <section id="orcamento" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <div className="mb-12 max-w-2xl">
        <span className="eyebrow">Orçamento online</span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Monte seu orçamento em três passos</h2>
        <p className="mt-3 text-lg text-muted">O valor atualiza conforme você escolhe.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-10">
          <Step n="1" title="Tipo de veículo">
            <div className="grid gap-3 sm:grid-cols-3">
              {VEHICLES.map((v) => (
                <label key={v.id} className={optionClass}>
                  <input type="radio" name="vehicle" value={v.id} checked={vehicle === v.id} onChange={() => setVehicle(v.id)} className="sr-only" />
                  <Car className="size-5 text-muted" aria-hidden="true" />
                  <span className="font-medium">{v.label}</span>
                </label>
              ))}
            </div>
          </Step>

          <Step n="2" title="Pacote">
            <div className="grid gap-3 sm:grid-cols-2">
              {PACKAGES.map((p) => (
                <label key={p.id} className={`${optionClass} flex-col items-start`}>
                  <input type="radio" name="package" value={p.id} checked={pkg === p.id} onChange={() => setPkg(p.id)} className="sr-only" />
                  <span className="flex w-full items-baseline justify-between gap-4">
                    <span className="text-lg font-bold">{p.label}</span>
                    <span className="font-semibold tabular-nums text-wine">{formatBRL(p.prices[vehicle])}</span>
                  </span>
                  <span className="text-sm leading-relaxed text-muted">{p.description}</span>
                </label>
              ))}
            </div>
          </Step>

          <Step n="3" title="Adicionais (opcional)">
            <div className="grid gap-3">
              {ADDONS.map((a) => (
                <label key={a.id} className={optionClass}>
                  <input type="checkbox" checked={addons.includes(a.id)} onChange={() => setAddons((list) => toggleAddon(list, a.id))} className="peer sr-only" />
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-md border border-ink/20 bg-surface text-transparent transition-all duration-200 peer-checked:border-wine peer-checked:bg-wine peer-checked:text-white">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span className="flex-1 font-medium">{a.label}</span>
                  <span className="text-sm tabular-nums text-muted">+ {formatBRL(a.price)}</span>
                </label>
              ))}
            </div>
          </Step>
        </div>

        <aside className="card h-fit p-6 lg:sticky lg:top-24">
          <h3 className="font-bold">Resumo do pedido</h3>
          <dl className="mt-6 space-y-4 border-b border-line pb-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Veículo</dt>
              <dd className="font-medium">{VEHICLES.find((v) => v.id === vehicle).label}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Pacote {selectedPkg.label}</dt>
              <dd className="font-medium tabular-nums">{formatBRL(selectedPkg.prices[vehicle])}</dd>
            </div>
            {ADDONS.filter((a) => addons.includes(a.id)).map((a) => (
              <div key={a.id} className="flex justify-between gap-4 motion-safe:animate-pop">
                <dt className="text-muted">{a.label}</dt>
                <dd className="font-medium tabular-nums">{formatBRL(a.price)}</dd>
              </div>
            ))}
            {coupon && (
              <div className="flex justify-between gap-4 text-emerald-700 motion-safe:animate-pop">
                <dt>
                  Cupom {coupon.code} (-{coupon.percent}%)
                </dt>
                <dd className="font-medium tabular-nums">-{formatBRL(discount)}</dd>
              </div>
            )}
          </dl>
          <div className="mt-6 flex items-end justify-between gap-4" aria-live="polite">
            <span className="text-sm text-muted">Total estimado</span>
            <span className="text-right">
              {coupon && <s className="block text-sm tabular-nums text-muted">{formatBRL(total)}</s>}
              <span key={total - discount} className="text-3xl font-extrabold tabular-nums tracking-tight motion-safe:animate-pop">
                {formatBRL(total - discount)}
              </span>
            </span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <label htmlFor="cupom" className="sr-only">
              Cupom de desconto
            </label>
            <input
              id="cupom"
              value={couponInput}
              onChange={(e) => {
                setCouponInput(e.target.value)
                setCouponTouched(false)
              }}
              onBlur={() => setCouponTouched(true)}
              onKeyDown={(e) => e.key === 'Enter' && setCouponTouched(true)}
              placeholder="Cupom"
              autoComplete="off"
              spellCheck="false"
              aria-invalid={Boolean(couponError)}
              aria-describedby="cupom-msg"
              className={`min-w-28 flex-1 rounded-xl border bg-surface px-4 py-3.5 text-sm font-semibold uppercase tracking-wide transition-all duration-200 ease-in-out placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-muted ${
                coupon ? 'border-emerald-600' : couponError ? 'border-wine' : 'border-line hover:border-ink/20'
              }`}
            />
            <a
              href={buildWhatsAppLink(vehicle, pkg, addons, coupon)}
              onClick={() => {
                markCouponUsed()
                registerSale()
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary group flex-[2] whitespace-nowrap px-5"
            >
              Agendar este pacote
              <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </a>
          </div>
          <p id="cupom-msg" aria-live="polite" className={`mt-2 min-h-4 text-xs font-medium ${coupon ? 'text-emerald-700' : 'text-wine'}`}>
            {coupon ? `${coupon.percent}% de desconto aplicado.` : couponError}
          </p>
          <p className="mt-4 flex gap-2 text-xs leading-relaxed text-muted">
            <Info className="size-4 shrink-0" aria-hidden="true" />
            Valores de referência. O valor final é confirmado após avaliação do veículo.
          </p>
        </aside>
      </div>
    </section>
  )
}
