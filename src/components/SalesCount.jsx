import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { fetchSalesTotal } from '../salesCounter.js'

const number = new Intl.NumberFormat('pt-BR')

// Prova social: some enquanto o total for zero ou se o contador estiver indisponível
export default function SalesCount() {
  const [total, setTotal] = useState(null)

  useEffect(() => {
    fetchSalesTotal().then(setTotal)
  }, [])

  if (!total) return null
  return (
    <p className="mt-6 inline-flex animate-pop items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted shadow-sm">
      <MessageCircle className="size-4 text-wine" aria-hidden="true" />
      <span>
        <strong className="font-bold text-ink tabular-nums">{number.format(total)}</strong>{' '}
        {total === 1 ? 'agendamento solicitado' : 'agendamentos solicitados'} pelo site
      </span>
    </p>
  )
}
