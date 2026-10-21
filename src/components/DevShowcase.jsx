import { useRef } from 'react'
import { X, Zap } from 'lucide-react'

// Preencha para aparecer no modal; links vazios não são exibidos
const DEV = { name: '', github: '', linkedin: '' }

const STACK = [
  ['React 19 + Vite', 'Componentes funcionais com hooks, build estático servido por qualquer CDN.'],
  ['Tailwind CSS v4', 'Paleta da marca como design tokens em @theme. Só o CSS usado vai para produção.'],
  ['Lucide React', 'Ícones SVG importados um a um, entram no bundle apenas os usados.'],
  ['Performance', 'Logo convertida para WebP (73 kB contra 863 kB do PNG original), fontes com preconnect e display=swap, slider antes/depois desenhado em CSS, sem biblioteca de UI.'],
  ['Acessibilidade', 'Calculadora com radio e checkbox nativos, slider é um input range (teclado e leitor de tela), modal com <dialog> nativo (foco e Esc), respeita prefers-reduced-motion.'],
  ['UX e conversão', 'Preço em tempo real reduz a fricção do "quanto custa?". O botão gera a mensagem do WhatsApp já com veículo, pacote, adicionais e total.'],
  ['Qualidade', 'Regra de preço isolada em pricing.js, sem React, coberta por testes com node:test.'],
]

export default function DevShowcase() {
  const dialog = useRef(null)

  return (
    <>
      <button type="button" onClick={() => dialog.current.showModal()} className="text-xs text-muted transition-colors hover:text-gold">
        ⚡ Ver detalhes técnicos deste site
      </button>

      <dialog
        ref={dialog}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        className="m-auto w-[calc(100%-2rem)] max-w-2xl border border-line bg-surface text-bone"
        aria-labelledby="dev-title"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-gold">
                <Zap className="size-4" aria-hidden="true" /> Para recrutadores
              </p>
              <h2 id="dev-title" className="mt-3 font-display text-3xl sm:text-4xl">Como este site foi feito</h2>
            </div>
            <button type="button" onClick={() => dialog.current.close()} aria-label="Fechar" className="p-1 text-muted transition-colors hover:text-bone">
              <X className="size-5" />
            </button>
          </div>

          <dl className="mt-8 divide-y divide-line border-y border-line">
            {STACK.map(([title, text]) => (
              <div key={title} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <dt className="text-sm font-semibold">{title}</dt>
                <dd className="text-sm leading-relaxed text-muted">{text}</dd>
              </div>
            ))}
          </dl>

          {DEV.name && (
            <p className="mt-6 text-sm text-muted">
              Desenvolvido por <span className="text-bone">{DEV.name}</span>
              {DEV.github && (
                <> · <a href={DEV.github} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">GitHub</a></>
              )}
              {DEV.linkedin && (
                <> · <a href={DEV.linkedin} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">LinkedIn</a></>
              )}
            </p>
          )}
        </div>
      </dialog>
    </>
  )
}
