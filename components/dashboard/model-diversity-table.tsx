import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { GrayBadge, SameModelBadge } from './status-badges'
import { formatPct } from '@/lib/format'
import type { Execucao } from '@/lib/dashboard-data'

function Modelo({ nome }: { nome: string }) {
  return <span className="font-mono text-xs break-all">{nome}</span>
}

export function ModelDiversityTable({ execucoes }: { execucoes: Execucao[] }) {
  return (
    <Card className="py-0">
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Execução</TableHead>
              <TableHead>Modelo IA 1</TableHead>
              <TableHead>Modelo IA 2</TableHead>
              <TableHead>Modelo IA 3 (juíza)</TableHead>
              <TableHead>Diversidade</TableHead>
              <TableHead className="text-right">Divergências</TableHead>
              <TableHead className="pr-4 text-right">Requisitos (revocação)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {execucoes.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="pl-4 font-medium whitespace-nowrap">{e.id}</TableCell>
                <TableCell className="min-w-44 whitespace-normal">
                  <Modelo nome={e.modelo_ia1} />
                </TableCell>
                <TableCell className="min-w-44 whitespace-normal">
                  <Modelo nome={e.modelo_ia2} />
                </TableCell>
                <TableCell className="min-w-44 whitespace-normal">
                  {e.modelo_ia3 === null ? <GrayBadge>juíza não acionada</GrayBadge> : <Modelo nome={e.modelo_ia3} />}
                </TableCell>
                <TableCell>{e.ia1_e_ia2_mesmo_modelo ? <SameModelBadge /> : null}</TableCell>
                <TableCell className="text-right tabular-nums">{e.divergencias}</TableCell>
                <TableCell className="pr-4 text-right tabular-nums">
                  {e.requisitos_revocacao_pct === null || e.requisitos_revocacao_pct === undefined ? (
                    <GrayBadge>sem gabarito</GrayBadge>
                  ) : (
                    formatPct(e.requisitos_revocacao_pct)
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
