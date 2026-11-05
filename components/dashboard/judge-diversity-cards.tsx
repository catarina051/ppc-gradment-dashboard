import { cn } from '@/lib/utils'
import { formatInt, formatPct } from '@/lib/format'
import type { JuizaPorDiversidade } from '@/lib/dashboard-data'

function isMesmoModelo(grupo: JuizaPorDiversidade) {
  return /mesmo modelo/i.test(grupo.grupo)
}

function isModeloDiferente(grupo: JuizaPorDiversidade) {
  return /diferente/i.test(grupo.grupo)
}

function DiversityCard({ grupo }: { grupo: JuizaPorDiversidade }) {
  const mesmo = isMesmoModelo(grupo)
  return (
    <article
      className={cn(
        'flex flex-col gap-3 rounded-xl border-2 bg-card p-5 shadow-sm',
        mesmo ? 'border-red-200' : 'border-primary',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-muted-foreground text-pretty">{grupo.grupo}</h3>
        <span
          className={cn(
            'shrink-0 rounded-md px-2 py-0.5 text-xs font-medium',
            mesmo ? 'bg-red-50 text-red-700' : 'bg-primary/10 text-primary',
          )}
        >
          {mesmo ? 'mesmo modelo' : 'modelo diferente'}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-semibold tabular-nums tracking-tight sm:text-5xl">
          {formatPct(grupo.acerto_pct)}
        </span>
        <span className="text-sm text-muted-foreground">de acerto</span>
      </div>
      <div className="flex flex-col gap-0.5 text-sm">
        <p>
          corrigiu <span className="font-semibold tabular-nums">{formatInt(grupo.corrigiu)}</span>
          {' · '}
          <span className="text-red-600">
            piorou <span className="font-semibold tabular-nums">{formatInt(grupo.piorou)}</span>
          </span>
        </p>
        <p className="text-muted-foreground">
          {formatInt(grupo.divergencias_avaliadas)} divergências avaliadas
        </p>
      </div>
      <ul className="flex flex-wrap gap-1.5" aria-label="Execuções do grupo">
        {grupo.execucoes.map((id) => (
          <li
            key={id}
            className="rounded-md border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground"
          >
            {id}
          </li>
        ))}
      </ul>
    </article>
  )
}

export function JudgeDiversityCards({ grupos }: { grupos?: JuizaPorDiversidade[] | null }) {
  if (!Array.isArray(grupos) || grupos.length === 0) return null

  const diferente = grupos.find(isModeloDiferente)
  const mesmo = grupos.find(isMesmoModelo)
  const ordenados = [diferente, mesmo, ...grupos.filter((g) => g !== diferente && g !== mesmo)].filter(
    (g): g is JuizaPorDiversidade => Boolean(g),
  )

  return (
    <div className="flex flex-col gap-4">
      {diferente && mesmo && (
        <p className="rounded-xl bg-primary/5 px-5 py-4 text-base leading-relaxed text-pretty sm:text-lg">
          A juíza acerta{' '}
          <strong className="font-semibold text-primary">{formatPct(diferente.acerto_pct)}</strong> quando
          roda num modelo diferente das IAs 1 e 2, e{' '}
          <strong className="font-semibold text-red-600">{formatPct(mesmo.acerto_pct)}</strong> quando cai no
          mesmo modelo por falha de cota.
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {ordenados.map((g) => (
          <DiversityCard key={g.grupo} grupo={g} />
        ))}
      </div>
    </div>
  )
}
