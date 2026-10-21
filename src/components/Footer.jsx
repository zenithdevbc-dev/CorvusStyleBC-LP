import { MessageCircle } from 'lucide-react'
import { genericWhatsAppLink } from '../pricing.js'
import DevShowcase from './DevShowcase.jsx'

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          Pronto para deixar seu carro com <span className="text-gold">cara de novo</span>?
        </h2>
        <p className="mt-4 text-white/70">Mande uma mensagem e escolha o melhor dia.</p>
        <a href={genericWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8">
          <MessageCircle className="size-5" aria-hidden="true" />
          Agendar via WhatsApp
        </a>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
          <div className="flex items-center gap-3 text-sm text-white/70">
            <img src="./logo.webp" alt="" width="28" height="28" loading="lazy" className="size-7" />
            © {new Date().getFullYear()} Corvus Style BC
          </div>
          <DevShowcase />
        </div>
      </div>
    </footer>
  )
}
