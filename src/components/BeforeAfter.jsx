import { useState } from 'react'
import { ChevronsLeftRight } from 'lucide-react'
import Img from './Img.jsx'

// As duas fotos precisam ter o mesmo enquadramento e tamanho (1536×1024)
const photo = { width: 1536, height: 1024, loading: 'lazy', decoding: 'async', draggable: false }

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
          <p className="max-w-xs text-muted">Barro, poeira e manchas saem. A pintura e as rodas voltam a ter brilho.</p>
        </div>

        <div className="relative aspect-[3/2] select-none overflow-hidden rounded-2xl bg-surface shadow-md">
          <Img src="./depois.webp" alt="Honda Civic preto limpo e com brilho, depois do detalhamento" {...photo} className="size-full" />
          <img
            src="./antes.webp"
            alt="O mesmo carro sujo de barro e poeira, antes do detalhamento"
            {...photo}
            className="absolute inset-0 size-full object-cover"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
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
      </div>
    </section>
  )
}
