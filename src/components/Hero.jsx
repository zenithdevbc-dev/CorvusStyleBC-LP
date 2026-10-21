import { Clock, Droplets, MessageCircle, ReceiptText, ShieldCheck, Sparkles } from 'lucide-react'
import { genericWhatsAppLink } from '../pricing.js'
import Img from './Img.jsx'

const TRUST = [
  [ReceiptText, 'Preço visível antes de agendar'],
  [MessageCircle, 'Agendamento direto pelo WhatsApp'],
  [Clock, 'Atendimento com hora marcada'],
]

const SERVICES = [
  [Droplets, 'Lavagem técnica', 'Produtos e toalhas certos para cada superfície, sem riscar a pintura.'],
  [Sparkles, 'Descontaminação', 'Remove a sujeira grudada que a lavagem comum não tira e devolve o toque liso.'],
  [ShieldCheck, 'Proteção', 'Uma camada de proteção que segura o brilho e facilita as próximas lavagens.'],
]

export default function Hero() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#topo" className="flex items-center gap-3 rounded-lg">
            <img src="./logo.webp" alt="" width="40" height="40" className="size-10" />
            <span className="font-bold tracking-tight">Corvus Style</span>
          </a>
          <div className="flex items-center gap-1 text-sm font-medium text-muted sm:gap-2">
            {[
              ['#servicos', 'Serviços'],
              ['#orcamento', 'Orçamento'],
              ['#precos', 'Preços'],
            ].map(([href, label]) => (
              <a key={href} href={href} className="hidden rounded-lg px-3 py-2 transition-all duration-200 ease-in-out hover:bg-ink/5 hover:text-ink md:inline">
                {label}
              </a>
            ))}
            <a href={genericWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="btn-primary ml-2 px-4 py-2 text-sm">
              Agendar
            </a>
          </div>
        </nav>
      </header>

      <section id="topo" className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.3fr_1fr] md:py-24">
        <div>
          <span className="eyebrow">Estética automotiva</span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Detalhamento automotivo feito com <span className="text-wine">calma e método</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Lavagem técnica, descontaminação e proteção de pintura. Você monta o orçamento aqui mesmo e agenda direto pelo WhatsApp.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={genericWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <MessageCircle className="size-5" aria-hidden="true" />
              Agendar via WhatsApp
            </a>
            <a href="#orcamento" className="btn-secondary">
              Calcular orçamento
            </a>
          </div>
          <ul className="mt-10 grid gap-3 text-sm text-muted sm:grid-cols-3">
            {TRUST.map(([Icon, text]) => (
              <li key={text} className="flex items-center gap-2">
                <Icon className="size-4 shrink-0 text-gold" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-72 md:max-w-sm">
          <div className="absolute inset-0 -m-6 rounded-full bg-gold-soft" aria-hidden="true" />
          <Img src="./logo.webp" alt="Logo Corvus Style" width="512" height="512" fetchPriority="high" className="relative aspect-square rounded-full shadow-md" />
        </div>
      </section>

      <section id="servicos" className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {SERVICES.map(([Icon, title, text]) => (
            <article key={title} className="card p-6 hover:-translate-y-1 hover:shadow-md">
              <span className="flex size-11 items-center justify-center rounded-xl bg-wine-soft text-wine">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
