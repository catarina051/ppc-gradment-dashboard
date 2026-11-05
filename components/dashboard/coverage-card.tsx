import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatInt, formatPct } from '@/lib/format'
import type { CoberturaTexto } from '@/lib/dashboard-data'

function Barra({ label, enviado, total }: { label: string; enviado: number; total: number }) {
  const pct = total > 0 ? (enviado / total) * 100 : 0
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground tabular-nums">
          <span className="font-semibold text-foreground">{formatInt(enviado)}</span> / {formatInt(total)} ·{' '}
          {formatPct(pct)}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={enviado}
        className="h-2.5 w-full overflow-hidden rounded-full bg-primary/10"
      >
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function CoverageCard({ cobertura }: { cobertura: CoberturaTexto }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cobertura do texto do PPC real ({cobertura.paginas_total} páginas)</CardTitle>
        <CardDescription>O que foi efetivamente enviado às IAs, em relação ao documento completo.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-5">
          <Barra label="Páginas enviadas" enviado={cobertura.paginas_enviadas_as_ias} total={cobertura.paginas_total} />
          <Barra
            label="Caracteres enviados"
            enviado={cobertura.caracteres_enviados_as_ias}
            total={cobertura.caracteres_texto_bruto}
          />
          <Barra
            label="Blocos de detalhamento enviados"
            enviado={cobertura.blocos_detalhamento_enviados}
            total={cobertura.blocos_detalhamento_total}
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-medium">Disciplinas cortadas ({cobertura.disciplinas_cortadas.length})</h3>
            <p className="text-sm text-muted-foreground">
              Códigos cujo bloco de detalhamento não chegou às IAs.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {cobertura.disciplinas_cortadas.map((codigo) => (
              <li
                key={codigo}
                className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 font-mono text-xs font-medium text-primary"
              >
                {codigo}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
