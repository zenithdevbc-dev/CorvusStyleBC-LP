import { useState } from 'react'
import { ChevronsLeftRight } from 'lucide-react'

// shortcut: pintura simulada em CSS (zero bytes de imagem); trocar por fotos reais antes/depois quando houver
const PAINT =
  'radial-gradient(ellipse 60% 40% at 28% 18%, rgb(255 255 255 / 0.28), transparent 60%),' +
  'linear-gradient(104deg, transparent 44%, rgb(255 255 255 / 0.16) 49%, transparent 54%),' +
  'linear-gradient(160deg, #5c0a16 0%, #250307 42%, #7a0f1e 68%, #140205 100%)'
const SWIRLS =
  'repeating-radial-gradient(circle at 62% 48%, rgb(255 255 255 / 0.07) 0 1px, transparent 1px 6px),' +
  'repeating-radial-gradient(circle at 20% 80%, rgb(255 255 255 / 0.05) 0 1px, transparent 1px 9px),' +
  'radial-gradient(circle at 40% 60%, rgb(160 140 120 / 0.25), transparent 50%)'

export default function BeforeAfter() {
  const [pos, setPos] = useState(50)

  return (
    <section id="resultado" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="eyebrow">Resultado</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Arraste para ver a diferença</h2>
          </div>
          <p className="max-w-xs text-muted">Micro-riscos, manchas e opacidade saem. A cor volta a ter profundidade.</p>
        </div>

        <div className="relative aspect-[4/3] select-none overflow-hidden rounded-2xl shadow-md sm:aspect-[16/7]">
          <div className="absolute inset-0" style={{ background: PAINT }} />
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, background: `${SWIRLS}, ${PAINT}`, filter: 'saturate(0.45) brightness(0.7) contrast(0.85)' }}
          />

          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold shadow-sm">Antes</span>
          <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-wine shadow-sm">Depois</span>

          <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white" style={{ left: `${pos}%` }} aria-hidden="true">
            <span className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-md">
              <ChevronsLeftRight className="size-5" />
            </span>
          </div>

          {/* range nativo invisível por cima de tudo: mouse, toque e teclado sem listeners manuais */}
          <input
            type="range"
            min="0"
            max="100"
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label="Comparar antes e depois da pintura"
            className="absolute inset-0 size-full cursor-ew-resize opacity-0"
          />
        </div>
        <p className="mt-3 text-xs text-muted">Simulação ilustrativa de correção de pintura.</p>
      </div>
    </section>
  )
}
