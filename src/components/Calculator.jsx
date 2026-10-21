import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { ADDONS, PACKAGES, VEHICLES, buildWhatsAppLink, calcTotal, formatBRL } from '../pricing.js'

// Radio/checkbox nativos escondidos: teclado e leitor de tela funcionam sem código extra
const optionClass =
  'flex cursor-pointer items-center justify-between gap-4 border border-line bg-surface px-5 py-4 transition-colors hover:border-gold-dim has-checked:border-gold has-focus-visible:outline-2 has-focus-visible:outline-gold'

function Step({ n, title, children }) {
  return (
    <fieldset>
      <legend className="mb-4 flex items-baseline gap-3">
        <span className="font-display text-xl text-gold">{n}</span>
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted">{title}</span>
      </legend>
      {children}
    </fieldset>
  )
}

export default function Calculator() {
  const [vehicle, setVehicle] = useState('hatch')
  const [pkg, setPkg] = useState('basico')
  const [addons, setAddons] = useState([])

  const toggleAddon = (id) => setAddons((list) => (list.includes(id) ? list.filter((a) => a !== id) : [...list, id]))
  const total = calcTotal(vehicle, pkg, addons)

  return (
    <section id="orcamento" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mb-14 max-w-2xl">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gold">Orçamento</p>
        <h2 className="font-display text-4xl leading-tight sm:text-6xl">Quanto custa? Você descobre agora.</h2>
        <p className="mt-4 text-muted">Escolha o veículo, o pacote e os adicionais. O valor atualiza na hora.</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-10">
          <Step n="01" title="Tipo de veículo">
            <div className="grid gap-3 sm:grid-cols-3">
              {VEHICLES.map((v) => (
                <label key={v.id} className={optionClass}>
                  <input type="radio" name="vehicle" value={v.id} checked={vehicle === v.id} onChange={() => setVehicle(v.id)} className="sr-only" />
                  <span>{v.label}</span>
                </label>
              ))}
            </div>
          </Step>

          <Step n="02" title="Pacote">
            <div className="grid gap-3 sm:grid-cols-2">
              {PACKAGES.map((p) => (
                <label key={p.id} className={`${optionClass} items-start`}>
                  <input type="radio" name="package" value={p.id} checked={pkg === p.id} onChange={() => setPkg(p.id)} className="sr-only" />
                  <span>
                    <span className="block font-display text-2xl">{p.label}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{p.description}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-gold">{formatBRL(p.prices[vehicle])}</span>
                </label>
              ))}
            </div>
          </Step>

          <Step n="03" title="Adicionais">
            <div className="grid gap-3">
              {ADDONS.map((a) => (
                <label key={a.id} className={`${optionClass} group`}>
                  <input type="checkbox" checked={addons.includes(a.id)} onChange={() => toggleAddon(a.id)} className="peer sr-only" />
                  <span className="flex size-5 shrink-0 items-center justify-center border border-line transition-colors peer-checked:border-gold peer-checked:bg-gold">
                    <Check className="size-3.5 text-ink opacity-0 transition-opacity group-has-checked:opacity-100" aria-hidden="true" />
                  </span>
                  <span className="flex-1">{a.label}</span>
                  <span className="tabular-nums text-muted">+ {formatBRL(a.price)}</span>
                </label>
              ))}
            </div>
          </Step>
        </div>

        <aside className="h-fit border border-line bg-surface p-6 lg:sticky lg:top-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Resumo</p>
          <dl className="mt-6 space-y-3 border-b border-line pb-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Veículo</dt>
              <dd>{VEHICLES.find((v) => v.id === vehicle).label}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Pacote {PACKAGES.find((p) => p.id === pkg).label}</dt>
              <dd className="tabular-nums">{formatBRL(PACKAGES.find((p) => p.id === pkg).prices[vehicle])}</dd>
            </div>
            {ADDONS.filter((a) => addons.includes(a.id)).map((a) => (
              <div key={a.id} className="flex justify-between gap-4">
                <dt className="text-muted">{a.label}</dt>
                <dd className="tabular-nums">{formatBRL(a.price)}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex items-baseline justify-between" aria-live="polite">
            <span className="text-sm text-muted">Total estimado</span>
            <span key={total} className="font-display text-5xl tabular-nums text-gold motion-safe:animate-[pulse_0.4s_ease-out_1]">
              {formatBRL(total)}
            </span>
          </div>
          <a
            href={buildWhatsAppLink(vehicle, pkg, addons)}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 flex items-center justify-between bg-wine px-5 py-4 font-semibold transition-colors hover:bg-wine-bright"
          >
            Agendar este pacote
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>
          <p className="mt-3 text-xs text-muted">Valores de referência. O valor final é confirmado após avaliação do veículo.</p>
        </aside>
      </div>
    </section>
  )
}
