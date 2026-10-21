import { useRef } from 'react'
import { X, Zap } from 'lucide-react'

// Preencha para aparecer no modal; links vazios não são exibidos
const DEV = { name: '', github: '', linkedin: '' }

const STACK = [
  ['React 19 + Vite', 'Componentes funcionais com hooks, build estático servido por qualquer CDN.'],
  ['Tailwind CSS v4', 'Paleta da marca como design tokens em @theme e classes de componente (botões, cards) num só lugar. Só o CSS usado vai para produção.'],
  ['Lucide React', 'Ícones SVG importados um a um, entram no bundle apenas os usados.'],
  ['Performance', 'Logo convertida para WebP (73 kB contra 863 kB do PNG original), fonte com preconnect e display=swap, slider antes/depois desenhado em CSS, sem biblioteca de UI.'],
  ['Fluidez', 'Transições de 200 ms em botões, cards e opções, esqueleto de carregamento nas imagens e animações desligadas para quem usa prefers-reduced-motion.'],
  ['Acessibilidade', 'Calculadora com radio e checkbox nativos, slider é um input range (teclado e leitor de tela), tabela de preços semântica e modal com <dialog> nativo (foco e Esc).'],
  ['UX e conversão', 'Preço em tempo real reduz a fricção do "quanto custa?". O botão gera a mensagem do WhatsApp já com veículo, pacote, adicionais e total.'],
  ['Qualidade', 'Regra de preço isolada em pricing.js, sem React, coberta por testes com node:test.'],
]

export default function DevShowcase() {
  const dialog = useRef(null)

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current.showModal()}
        className="rounded-lg px-2 py-1 text-xs text-white/60 transition-all duration-200 ease-in-out hover:bg-white/10 hover:text-white"
      >
        ⚡ Ver detalhes técnicos deste site
      </button>

      <dialog
        ref={dialog}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl scale-95 rounded-2xl bg-surface text-ink opacity-0 shadow-xl transition-all transition-discrete duration-200 ease-out open:scale-100 open:opacity-100 starting:open:scale-95 starting:open:opacity-0"
        aria-labelledby="dev-title"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="eyebrow">
                <Zap className="size-3.5" aria-hidden="true" /> Para recrutadores
              </span>
              <h2 id="dev-title" className="mt-3 text-2xl font-extrabold tracking-tight">Como este site foi feito</h2>
            </div>
            <button
              type="button"
              onClick={() => dialog.current.close()}
              aria-label="Fechar"
              className="rounded-lg p-2 text-muted transition-all duration-200 ease-in-out hover:bg-ink/5 hover:text-ink"
            >
              <X className="size-5" />
            </button>
          </div>

          <dl className="mt-6 divide-y divide-line">
            {STACK.map(([title, text]) => (
              <div key={title} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <dt className="text-sm font-bold">{title}</dt>
                <dd className="text-sm leading-relaxed text-muted">{text}</dd>
              </div>
            ))}
          </dl>

          {DEV.name && (
            <p className="mt-4 text-sm text-muted">
              Desenvolvido por <span className="font-semibold text-ink">{DEV.name}</span>
              {DEV.github && (
                <> · <a href={DEV.github} target="_blank" rel="noopener noreferrer" className="font-semibold text-wine hover:underline">GitHub</a></>
              )}
              {DEV.linkedin && (
                <> · <a href={DEV.linkedin} target="_blank" rel="noopener noreferrer" className="font-semibold text-wine hover:underline">LinkedIn</a></>
              )}
            </p>
          )}
        </div>
      </dialog>
    </>
  )
}
