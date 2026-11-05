import { cn } from '@/lib/utils'
import { EFEITO_CORES, EFEITO_ROTULOS } from '@/lib/format'
import type { EfeitoJuiza } from '@/lib/dashboard-data'

export function GrayBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-zinc-600',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function SameModelBadge() {
  return (
    <span className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-red-700">
      mesmo modelo
    </span>
  )
}

const EFEITO_CLASSES: Record<EfeitoJuiza, string> = {
  CORRIGIU: 'border-green-200 bg-green-50 text-green-700',
  MANTEVE_CERTO: 'border-zinc-200 bg-zinc-100 text-zinc-600',
  MANTEVE_ERRADO: 'border-amber-200 bg-amber-50 text-amber-800',
  PIOROU: 'border-red-200 bg-red-50 text-red-700',
}

export function EfeitoBadge({ efeito }: { efeito: EfeitoJuiza }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        EFEITO_CLASSES[efeito] ?? EFEITO_CLASSES.MANTEVE_CERTO,
      )}
    >
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full"
        style={{ backgroundColor: EFEITO_CORES[efeito] ?? EFEITO_CORES.MANTEVE_CERTO }}
      />
      {EFEITO_ROTULOS[efeito] ?? efeito}
    </span>
  )
}
