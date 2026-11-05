import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatInt, formatMinSec, formatPct } from '@/lib/format'
import type { ProcessoAnterior, ResumoCaso } from '@/lib/dashboard-data'

const usd = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })

const NOMES_MODELO: Record<string, string> = {
  'claude-opus-5-5': 'Claude Opus 5.5',
  'claude-sonnet-5-5': 'Claude Sonnet 5.5',
  'claude-haiku-5-5': 'Claude Haiku 5.5',
}

type Melhor = 'anterior' | 'pipeline' | null

function Celula({ children, destaque }: { children: React.ReactNode; destaque: boolean }) {
  return (
    <td
      className={cn(
        'px-4 py-3 align-top tabular-nums',
        destaque && 'bg-green-50 font-semibold text-green-800',
      )}
    >
      {children}
    </td>
  )
}

function Aceito({ ok }: { ok: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        ok ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700',
      )}
    >
      {ok ? 'sim' : 'não'}
    </span>
  )
}

/** Maior é melhor; empate não destaca ninguém. */
function maior(a: number | null, b: number | null): Melhor {
  if (a === null || b === null || a === b) return null
  return a > b ? 'anterior' : 'pipeline'
}

function menor(a: number | null, b: number | null): Melhor {
  if (a === null || b === null || a === b) return null
  return a < b ? 'anterior' : 'pipeline'
}

export function PreviousProcess({
  anterior,
  pipeline,
}: {
  anterior: ProcessoAnterior | undefined
  pipeline: ResumoCaso | undefined
}) {
  const q = anterior?.qualidade
  if (!anterior || !q || !pipeline) return null

  const aceitoPipeline = (() => {
    const [ok, total] = pipeline.invariantes_gradment_ok.split('/').map(Number)
    return ok === total && total > 0
  })()

  const linhas: { rotulo: string; a: React.ReactNode; p: React.ReactNode; melhor: Melhor }[] = [
    {
      rotulo: 'Obrigatória × optativa correta',
      a: formatPct(q.obrig_vs_optativa_pct),
      p: formatPct(pipeline.classificacao_obrig_opt_media_pct),
      melhor: maior(q.obrig_vs_optativa_pct, pipeline.classificacao_obrig_opt_media_pct),
    },
    {
      rotulo: 'Carga horária correta',
      a: formatPct(q.carga_horaria_pct),
      p: formatPct(pipeline.carga_horaria_media_pct),
      melhor: maior(q.carga_horaria_pct, pipeline.carga_horaria_media_pct),
    },
    {
      rotulo: 'Disciplinas que não existem',
      a: formatInt(q.disciplinas_inexistentes),
      p: '0',
      melhor: menor(q.disciplinas_inexistentes, 0),
    },
    {
      rotulo: 'Requisitos: precisão',
      a: formatPct(q.requisitos_precisao_pct),
      p: formatPct(pipeline.requisitos_precisao_media_pct),
      melhor: maior(q.requisitos_precisao_pct, pipeline.requisitos_precisao_media_pct),
    },
    {
      rotulo: 'Requisitos: revocação',
      a: formatPct(q.requisitos_revocacao_pct),
      p: formatPct(pipeline.requisitos_revocacao_media_pct),
      melhor: maior(q.requisitos_revocacao_pct, pipeline.requisitos_revocacao_media_pct),
    },
    {
      rotulo: 'Aceito pelo GradMent',
      a: <Aceito ok={q.aceito_pelo_gradment} />,
      p: <Aceito ok={aceitoPipeline} />,
      melhor: q.aceito_pelo_gradment === aceitoPipeline ? null : aceitoPipeline ? 'pipeline' : 'anterior',
    },
    {
      rotulo: 'Tempo',
      a: formatMinSec(q.segundos),
      p: formatMinSec(pipeline.tempo_medio_s),
      melhor: menor(q.segundos, pipeline.tempo_medio_s),
    },
  ]

  const custos = anterior.custo_claude_por_ppc ?? []

  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-xl bg-primary/5 px-5 py-4 text-base leading-relaxed text-pretty sm:text-lg">
        Antes, o PPC ia para um LLM no chat. Medimos esse processo no mesmo PPC real e com o mesmo gabarito.
      </p>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="gap-0 overflow-hidden py-0 lg:col-span-3">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <caption className="sr-only">Comparação entre o processo anterior e o pipeline</caption>
              <thead className="bg-muted/60 text-left">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium text-muted-foreground">
                    PPC real CEFET-MG
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Um modelo só
                    <span className="block text-xs font-normal text-muted-foreground">processo anterior</span>
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Este pipeline
                    <span className="block text-xs font-normal text-muted-foreground">
                      média de {pipeline.sucesso} execuções
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {linhas.map((l) => (
                  <tr key={l.rotulo}>
                    <th scope="row" className="px-4 py-3 text-left font-normal text-muted-foreground">
                      {l.rotulo}
                    </th>
                    <Celula destaque={l.melhor === 'anterior'}>{l.a}</Celula>
                    <Celula destaque={l.melhor === 'pipeline'}>{l.p}</Celula>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t px-4 py-3 text-xs text-muted-foreground">
            Verde = melhor valor da linha. O modelo único encontrou mais requisitos porque leu o PPC inteiro, sem o
            corte de texto do pipeline. Modelo do baseline: <span className="font-mono">{q.modelo}</span>.
          </p>
        </Card>

        <Card className="gap-4 py-5 lg:col-span-2">
          <CardHeader className="px-5">
            <CardTitle className="text-base">Custo em tokens por PPC</CardTitle>
            <CardDescription>Claude, com o PDF anexado como no chat. Tokens contados pela API.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 px-5">
            <ul className="flex flex-col divide-y">
              {custos.map((c) => (
                <li key={c.modelo} className="flex flex-col gap-0.5 py-2.5 first:pt-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm">{NOMES_MODELO[c.modelo] ?? c.modelo}</span>
                    <span className="text-2xl font-semibold tabular-nums tracking-tight">
                      {usd.format(c.custo_usd_pdf_anexado)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    entrada {formatInt(c.tokens_entrada_pdf_anexado)} tokens · saída{' '}
                    {formatInt(c.tokens_saida_json_gradment)} tokens
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-baseline justify-between gap-3 rounded-lg bg-green-50 px-3 py-2.5 text-green-800">
              <span className="text-sm font-medium">Este pipeline (cotas gratuitas)</span>
              <span className="text-2xl font-semibold tabular-nums">{usd.format(anterior.custo_pipeline_usd)}</span>
            </div>
            {custos[0] ? <p className="text-xs text-muted-foreground text-pretty">{custos[0].observacao}</p> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
