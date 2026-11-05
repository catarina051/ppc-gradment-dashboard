'use client'

import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GrayBadge } from './status-badges'
import type { Execucao, ResumoCaso } from '@/lib/dashboard-data'

const chartConfig = {
  obrig_vs_optativa_pct: { label: 'Obrig. vs optativa', color: '#DDD6FE' },
  periodo_pct: { label: 'Período', color: '#C4B5FD' },
  carga_horaria_pct: { label: 'Carga horária', color: '#A78BFA' },
  requisitos_precisao_pct: { label: 'Requisitos (precisão)', color: '#7C3AED' },
  requisitos_revocacao_pct: { label: 'Requisitos (revocação)', color: '#4C1D95' },
} satisfies ChartConfig

const CAMPOS = Object.keys(chartConfig) as (keyof typeof chartConfig)[]

export function FieldAccuracyChart({ execucoes, casos }: { execucoes: Execucao[]; casos: ResumoCaso[] }) {
  const [caso, setCaso] = useState<string>(casos.find((c) => c.caso === 'cefet-engcomp')?.caso ?? casos[0]?.caso)
  const resumo = casos.find((c) => c.caso === caso)

  const dados = execucoes
    .filter((e) => e.caso === caso)
    .map((e) => ({
      id: e.id,
      obrig_vs_optativa_pct: e.obrig_vs_optativa_pct,
      periodo_pct: e.periodo_pct,
      carga_horaria_pct: e.carga_horaria_pct,
      requisitos_precisao_pct: e.requisitos_precisao_pct ?? null,
      requisitos_revocacao_pct: e.requisitos_revocacao_pct ?? null,
    }))

  const semGabaritoRequisitos =
    dados.length > 0 && dados.every((d) => d.requisitos_precisao_pct === null && d.requisitos_revocacao_pct === null)

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Acerto por campo, por execução</CardTitle>
          <CardDescription>{resumo?.descricao}</CardDescription>
        </div>
        <Tabs value={caso} onValueChange={(v) => setCaso(String(v))}>
          <TabsList aria-label="Filtrar por caso">
            {casos.map((c) => (
              <TabsTrigger key={c.caso} value={c.caso} className="px-3">
                {c.caso}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {semGabaritoRequisitos ? (
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            Requisitos (precisão e revocação): <GrayBadge>sem gabarito</GrayBadge>
          </div>
        ) : null}
        <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
          <BarChart data={dados} margin={{ left: -16, right: 8, top: 8 }} barCategoryGap="18%">
            <CartesianGrid vertical={false} />
            <XAxis dataKey="id" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} unit="%" width={56} />
            <ChartTooltip
              cursor={{ fill: 'var(--muted)' }}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        {chartConfig[name as keyof typeof chartConfig]?.label ?? name}
                      </span>
                      <span className="font-mono font-medium tabular-nums">
                        {value === null || value === undefined
                          ? 'sem gabarito'
                          : `${Number(value).toLocaleString('pt-BR')}%`}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent className="flex-wrap" />} />
            {CAMPOS.map((campo) => (
              <Bar key={campo} dataKey={campo} fill={`var(--color-${campo})`} radius={[3, 3, 0, 0]} />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
