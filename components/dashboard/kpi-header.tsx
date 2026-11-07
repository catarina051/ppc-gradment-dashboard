import { Clock, BookOpen, Timer, GitBranch } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { GrayBadge } from './status-badges'
import { formatMinSec, formatPct } from '@/lib/format'
import type { ResumoCaso } from '@/lib/dashboard-data'

function encontradas(resumo: ResumoCaso) {
  const pct = resumo.disciplinas_revocacao_media_pct
  if (pct === null) return null
  return `${Math.round((pct / 100) * resumo.gabarito.disciplinas)}/${resumo.gabarito.disciplinas}`
}

function KpiCard({
  icon: Icon,
  label,
  value,
  aside,
  footnote,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  aside?: React.ReactNode
  footnote?: React.ReactNode
}) {
  return (
    <Card className="gap-0 py-5">
      <CardContent className="flex flex-col gap-3 px-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon className="size-4 text-primary" aria-hidden="true" />
          <span>{label}</span>
        </div>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-4xl font-semibold tracking-tight tabular-nums md:text-5xl">{value}</span>
          {aside}
        </div>
        {footnote ? <div className="text-sm text-muted-foreground">{footnote}</div> : null}
      </CardContent>
    </Card>
  )
}

export function KpiHeader({
  cefet,
  sintetico,
  tempoModeloUnico,
}: {
  cefet: ResumoCaso
  sintetico: ResumoCaso | undefined
  /** Tempo do processo anterior (um modelo só), em segundos; null se não medido. */
  tempoModeloUnico: number | null
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          Caso principal: <span className="font-medium text-foreground">{cefet.descricao}</span> ·{' '}
          {cefet.sucesso}/{cefet.execucoes} execuções com sucesso
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={Clock}
          label="Tempo médio por PPC"
          value={formatMinSec(cefet.tempo_medio_s)}
          aside={
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              modelo único:{' '}
              <GrayBadge>{tempoModeloUnico === null ? 'não medido' : formatMinSec(tempoModeloUnico)}</GrayBadge>
            </span>
          }
          footnote={`min:seg · faixa ${formatMinSec(cefet.tempo_min_s)}–${formatMinSec(cefet.tempo_max_s)}`}
        />
        <KpiCard
          icon={BookOpen}
          label="Disciplinas encontradas"
          value={formatPct(cefet.disciplinas_revocacao_media_pct)}
          aside={<span className="text-lg font-medium text-primary tabular-nums">{encontradas(cefet)}</span>}
          footnote={`precisão ${formatPct(cefet.disciplinas_precisao_media_pct)}`}
        />
        <KpiCard
          icon={Timer}
          label="Carga horária correta"
          value={formatPct(cefet.carga_horaria_media_pct)}
          footnote={`período exato ${formatPct(cefet.periodo_exato_medio_pct)}`}
        />
        <KpiCard
          icon={GitBranch}
          label="Pré-requisitos encontrados"
          value={formatPct(cefet.requisitos_revocacao_media_pct)}
          aside={
            <span className="text-sm text-muted-foreground tabular-nums">
              precisão {formatPct(cefet.requisitos_precisao_media_pct)}
            </span>
          }
          footnote={`revocação · gabarito com ${cefet.gabarito.requisitos ?? '—'} requisitos`}
        />
      </div>

      {sintetico ? (
        <p className="rounded-lg border border-dashed bg-card px-4 py-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Caso sintético</span> ({sintetico.execucoes} execuções):
          tempo médio <span className="font-medium text-foreground tabular-nums">{formatMinSec(sintetico.tempo_medio_s)}</span> ·
          disciplinas{' '}
          <span className="font-medium text-foreground tabular-nums">
            {formatPct(sintetico.disciplinas_revocacao_media_pct)} ({encontradas(sintetico)})
          </span>{' '}
          · carga horária{' '}
          <span className="font-medium text-foreground tabular-nums">{formatPct(sintetico.carga_horaria_media_pct)}</span> ·
          pré-requisitos{' '}
          <span className="font-medium text-foreground tabular-nums">
            {formatPct(sintetico.requisitos_revocacao_media_pct)}
          </span>{' '}
          (precisão {formatPct(sintetico.requisitos_precisao_media_pct)})
        </p>
      ) : null}
    </div>
  )
}
