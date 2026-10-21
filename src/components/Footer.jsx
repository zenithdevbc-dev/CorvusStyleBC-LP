import { MessageCircle } from 'lucide-react'
import { genericWhatsAppLink } from '../pricing.js'
import DevShowcase from './DevShowcase.jsx'

export default function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <h2 className="font-display text-4xl sm:text-6xl">
          Seu carro merece <em className="text-gold">mais que uma lavagem</em>.
        </h2>
        <a
          href={genericWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-3 bg-gold px-6 py-4 font-semibold text-ink transition-colors hover:bg-bone"
        >
          <MessageCircle className="size-5" aria-hidden="true" />
          Agendar via WhatsApp
        </a>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
          <div className="flex items-center gap-3 text-sm text-muted">
            <img src="./logo.webp" alt="" width="28" height="28" loading="lazy" className="size-7" />
            © {new Date().getFullYear()} Corvus Style BC
          </div>
          <DevShowcase />
        </div>
      </div>
    </footer>
  )
}
