'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { EfeitoBadge } from './status-badges'
import { EFEITO_ROTULOS } from '@/lib/format'
import type { DecisaoJuiza, EfeitoJuiza } from '@/lib/dashboard-data'

const TODAS = '__todas__'

export function JudgeDecisionsTable({ decisoes }: { decisoes: DecisaoJuiza[] }) {
  const [execucao, setExecucao] = useState(TODAS)
  const [soPiorou, setSoPiorou] = useState(false)
  const [busca, setBusca] = useState('')

  const execucoes = useMemo(() => [...new Set(decisoes.map((d) => d.execucao))], [decisoes])

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return decisoes.filter(
      (d) =>
        (execucao === TODAS || d.execucao === execucao) &&
        (!soPiorou || d.efeito === 'PIOROU') &&
        (termo === '' ||
          `${d.item} ${d.motivo} ${d.acao_juiza} ${d.pagina_citada} ${d.esperado}`.toLowerCase().includes(termo)),
    )
  }, [decisoes, execucao, soPiorou, busca])

  const contagem = useMemo(() => {
    const c: Partial<Record<EfeitoJuiza, number>> = {}
    for (const d of filtradas) c[d.efeito] = (c[d.efeito] ?? 0) + 1
    return c
  }, [filtradas])

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex flex-col gap-3 border-b py-4 md:flex-row md:flex-wrap md:items-center md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar item, motivo, página…"
              aria-label="Buscar decisões"
              className="h-9 w-full rounded-md border bg-background pr-3 pl-8 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:w-64"
            />
          </div>
          <select
            value={execucao}
            onChange={(e) => setExecucao(e.target.value)}
            aria-label="Filtrar por execução"
            className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value={TODAS}>Todas as execuções</option>
            {execucoes.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <Switch id="so-piorou" checked={soPiorou} onCheckedChange={setSoPiorou} />
            <Label htmlFor="so-piorou">só PIOROU</Label>
          </div>
        </div>
        <p className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
          {filtradas.length} de {decisoes.length} decisões
          {(Object.keys(EFEITO_ROTULOS) as EfeitoJuiza[])
            .filter((k) => contagem[k])
            .map((k) => ` · ${EFEITO_ROTULOS[k].toLowerCase()}: ${contagem[k]}`)
            .join('')}
        </p>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-auto px-0">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-card">
            <TableRow>
              <TableHead className="pl-4">Execução</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Ação da juíza</TableHead>
              <TableHead>Página citada</TableHead>
              <TableHead>Esperado</TableHead>
              <TableHead className="pr-4">Efeito</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Nenhuma decisão com esses filtros.
                </TableCell>
              </TableRow>
            ) : (
              filtradas.map((d) => (
                <TableRow key={`${d.execucao}-${d.id}`}>
                  <TableCell className="pl-4 font-mono text-xs whitespace-nowrap">{d.execucao}</TableCell>
                  <TableCell className="min-w-48 font-medium whitespace-normal">{d.item}</TableCell>
                  <TableCell className="min-w-56 text-muted-foreground whitespace-normal">{d.motivo}</TableCell>
                  <TableCell className="font-mono text-xs">{d.acao_juiza}</TableCell>
                  <TableCell className="min-w-32 whitespace-normal">{d.pagina_citada}</TableCell>
                  <TableCell className="min-w-28 whitespace-normal">{d.esperado}</TableCell>
                  <TableCell className="pr-4">
                    <EfeitoBadge efeito={d.efeito} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
