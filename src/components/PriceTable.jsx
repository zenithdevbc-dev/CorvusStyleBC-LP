import { ADDONS, PACKAGES, VEHICLES, formatBRL } from '../pricing.js'

export default function PriceTable() {
  return (
    <section id="precos" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 md:pb-28">
      <div className="mb-10 max-w-2xl">
        <span className="eyebrow">Tabela de preços</span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Todos os valores, sem surpresa</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Preço dos pacotes por tipo de veículo</caption>
            <thead>
              <tr className="border-b border-line text-muted">
                <th scope="col" className="px-4 py-4 font-medium sm:px-6">Pacote</th>
                {VEHICLES.map((v) => (
                  <th key={v.id} scope="col" className="px-4 py-4 text-right font-medium sm:px-6">{v.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PACKAGES.map((p) => (
                <tr key={p.id} className="border-b border-line transition-colors duration-200 last:border-0 hover:bg-canvas">
                  <th scope="row" className="px-4 py-5 align-top font-normal sm:px-6">
                    <span className="block font-bold">{p.label}</span>
                    <span className="mt-1 hidden max-w-xs text-muted sm:block">{p.description}</span>
                  </th>
                  {VEHICLES.map((v) => (
                    <td key={v.id} className="px-4 py-5 text-right align-top font-semibold sm:px-6 tabular-nums">{formatBRL(p.prices[v.id])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card p-6">
          <h3 className="font-bold">Adicionais</h3>
          <p className="mt-1 text-sm text-muted">Mesmo valor para qualquer veículo.</p>
          <ul className="mt-5 divide-y divide-line text-sm">
            {ADDONS.map((a) => (
              <li key={a.id} className="flex justify-between gap-4 py-3">
                <span>{a.label}</span>
                <span className="font-semibold tabular-nums">{formatBRL(a.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
