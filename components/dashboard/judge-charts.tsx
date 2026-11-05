'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { GrayBadge } from './status-badges'
import { EFEITO_CORES } from '@/lib/format'
import type { Execucao } from '@/lib/dashboard-data'

const efeitoConfig = {
  juiza_corrigiu: { label: 'Corrigiu', color: EFEITO_CORES.CORRIGIU },
  juiza_manteve_certo: { label: 'Manteve certo', color: EFEITO_CORES.MANTEVE_CERTO },
  juiza_manteve_errado: { label: 'Manteve errado', color: EFEITO_CORES.MANTEVE_ERRADO },
  juiza_piorou: { label: 'Piorou', color: EFEITO_CORES.PIOROU },
} satisfies ChartConfig

const acertoConfig = {
  acerto_nas_divergencias_juiza_pct: { label: 'Juíza', color: '#6D28D9' },
  acerto_nas_divergencias_sempre_ia1_pct: { label: 'Sempre IA 1', color: '#94A3B8' },
  acerto_nas_divergencias_sempre_ia2_pct: { label: 'Sempre IA 2', color: '#334155' },
} satisfies ChartConfig

function NaoAcionada({ ids }: { ids: string[] }) {
  if (ids.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      {ids.map((id) => (
        <span key={id} className="flex items-center gap-1.5">
          <span className="font-mono">{id}</span>
          <GrayBadge>juíza não acionada</GrayBadge>
        </span>
      ))}
    </div>
  )
}

export function JudgeCharts({ execucoes }: { execucoes: Execucao[] }) {
  const acionadas = execucoes.filter((e) => e.juiza_corrigiu !== null)
  const naoAcionadas = execucoes.filter((e) => e.juiza_corrigiu === null).map((e) => e.id)

  const efeitos = acionadas.map((e) => ({
    id: e.id,
    juiza_corrigiu: e.juiza_corrigiu,
    juiza_manteve_certo: e.juiza_manteve_certo,
    juiza_manteve_errado: e.juiza_manteve_errado,
    juiza_piorou: e.juiza_piorou,
  }))

  const comAcerto = execucoes.filter((e) => e.acerto_nas_divergencias_juiza_pct !== null)
  const semAcerto = execucoes.filter((e) => e.acerto_nas_divergencias_juiza_pct === null).map((e) => e.id)
  const acertos = comAcerto.map((e) => ({
    id: e.id,
    acerto_nas_divergencias_juiza_pct: e.acerto_nas_divergencias_juiza_pct,
    acerto_nas_divergencias_sempre_ia1_pct: e.acerto_nas_divergencias_sempre_ia1_pct,
    acerto_nas_divergencias_sempre_ia2_pct: e.acerto_nas_divergencias_sempre_ia2_pct,
  }))

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Efeito de cada decisão da juíza</CardTitle>
          <CardDescription>Quantidade de itens divergentes por desfecho, por execução.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <ChartContainer config={efeitoConfig} className="aspect-auto w-full" style={{ height: 48 + efeitos.length * 36 }}>
            <BarChart data={efeitos} layout="vertical" margin={{ left: 4, right: 8 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="id"
                tickLine={false}
                axisLine={false}
                width={118}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip cursor={{ fill: 'var(--muted)' }} content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent className="flex-wrap" />} />
              {(Object.keys(efeitoConfig) as (keyof typeof efeitoConfig)[]).map((k, i, arr) => (
                <Bar
                  key={k}
                  dataKey={k}
                  stackId="efeito"
                  fill={`var(--color-${k})`}
                  radius={i === arr.length - 1 ? [0, 3, 3, 0] : 0}
                />
              ))}
            </BarChart>
          </ChartContainer>
          <NaoAcionada ids={naoAcionadas} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acerto nas divergências</CardTitle>
          <CardDescription>
            Juíza vs. estratégias ingênuas de sempre adotar a IA 1 ou sempre adotar a IA 2.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <ChartContainer config={acertoConfig} className="aspect-auto h-80 w-full">
            <BarChart data={acertos} margin={{ left: 24, right: 8, top: 8, bottom: 24 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="id"
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-35}
                textAnchor="end"
                tick={{ fontSize: 11 }}
                height={56}
              />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} unit="%" width={56} />
              <ChartTooltip
                cursor={{ fill: 'var(--muted)' }}
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <div className="flex w-full items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          {acertoConfig[name as keyof typeof acertoConfig]?.label ?? name}
                        </span>
                        <span className="font-mono font-medium tabular-nums">
                          {Number(value).toLocaleString('pt-BR')}%
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <ChartLegend verticalAlign="top" content={<ChartLegendContent className="pb-2" />} />
              {(Object.keys(acertoConfig) as (keyof typeof acertoConfig)[]).map((k) => (
                <Bar key={k} dataKey={k} fill={`var(--color-${k})`} radius={[3, 3, 0, 0]} />
              ))}
            </BarChart>
          </ChartContainer>
          <NaoAcionada ids={semAcerto} />
        </CardContent>
      </Card>
    </div>
  )
}
