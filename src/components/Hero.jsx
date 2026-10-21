import { ArrowDown, MessageCircle } from 'lucide-react'
import { genericWhatsAppLink } from '../pricing.js'

const STEPS = ['Lavagem técnica', 'Descontaminação', 'Proteção']

export default function Hero() {
  return (
    <>
      <header className="border-b border-line">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="#topo" className="flex items-center gap-3">
            <img src="./logo.webp" alt="" width="40" height="40" className="size-10" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em]">Corvus Style</span>
          </a>
          <div className="flex items-center gap-6 text-sm text-muted">
            <a href="#orcamento" className="hidden transition-colors hover:text-bone sm:inline">Orçamento</a>
            <a href="#resultado" className="hidden transition-colors hover:text-bone sm:inline">Resultado</a>
            <a
              href={genericWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-line px-3 py-1.5 text-bone transition-colors hover:border-gold hover:text-gold"
            >
              WhatsApp
            </a>
          </div>
        </nav>
      </header>

      <section id="topo" className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr] md:items-center md:py-28">
        <div>
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-gold">Estética automotiva · BC</p>
          <h1 className="font-display text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
            Lavar, qualquer um lava.
            <br />
            <em className="text-gold">Detalhar</em> é outra conversa.
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted">
            Detalhamento minucioso e proteção de pintura para quem enxerga o carro como patrimônio. Cada etapa com produto certo,
            tempo certo e acabamento conferido de perto.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href={genericWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-gold px-6 py-4 font-semibold text-ink transition-colors hover:bg-bone"
            >
              <MessageCircle className="size-5" aria-hidden="true" />
              Agendar via WhatsApp
            </a>
            <a href="#orcamento" className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-bone">
              Montar orçamento
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-64 md:max-w-sm">
          <div className="absolute inset-0 -m-4 rounded-full border border-line" aria-hidden="true" />
          <img src="./logo.webp" alt="Logo Corvus Style" width="512" height="512" className="relative w-full" fetchPriority="high" />
        </div>
      </section>

      <ol className="mx-auto grid max-w-6xl border-y border-line sm:grid-cols-3 sm:border-x">
        {STEPS.map((step, i) => (
          <li key={step} className="flex items-baseline gap-4 border-line px-6 py-5 not-last:border-b sm:not-last:border-r sm:not-last:border-b-0">
            <span className="font-display text-2xl text-gold">0{i + 1}</span>
            <span className="text-sm uppercase tracking-[0.15em] text-muted">{step}</span>
          </li>
        ))}
      </ol>
    </>
  )
}
