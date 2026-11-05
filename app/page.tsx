import { getDashboardDados } from '@/lib/dashboard-data'
import { formatDateTime } from '@/lib/format'
import { Section } from '@/components/dashboard/section'
import { KpiHeader } from '@/components/dashboard/kpi-header'
import { FieldAccuracyChart } from '@/components/dashboard/field-accuracy-chart'
import { JudgeCharts } from '@/components/dashboard/judge-charts'
import { ModelDiversityTable } from '@/components/dashboard/model-diversity-table'
import { CoverageCard } from '@/components/dashboard/coverage-card'
import { JudgeDecisionsTable } from '@/components/dashboard/judge-decisions-table'

export default async function Page() {
  const dados = await getDashboardDados()
  const cefet = dados.resumo_por_caso.find((c) => c.caso === 'cefet-engcomp')
  const sintetico = dados.resumo_por_caso.find((c) => c.caso === 'sintetico')

  return (
    <div className="min-h-dvh bg-zinc-50">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 md:px-8 md:py-10">
          <p className="text-sm font-medium text-primary">Avaliação do pipeline n8n</p>
          <h1 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            PPC → GradMent: o que a dupla IA + juíza realmente entrega
          </h1>
          <p className="max-w-3xl text-pretty text-muted-foreground">
            Duas IAs extraem a matriz curricular do Projeto Pedagógico de Curso de forma independente, um código
            compara as saídas e uma terceira IA (juíza) arbitra só as divergências. Cada execução foi pontuada
            contra um gabarito sem LLM.
          </p>
          <p className="text-xs text-muted-foreground">
            {dados.execucoes.length} execuções · {dados.resumo_por_caso.length} casos ·{' '}
            {dados.decisoes_juiza.length} decisões da juíza · dados gerados em{' '}
            <time dateTime={dados.gerado_em}>{formatDateTime(dados.gerado_em)}</time>
          </p>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-14 px-4 py-10 md:px-8">
        {cefet ? (
          <section aria-label="Indicadores principais">
            <KpiHeader cefet={cefet} sintetico={sintetico} tempoManual={dados.tempo_manual} />
          </section>
        ) : (
          <p className="text-sm text-muted-foreground">Caso &quot;cefet-engcomp&quot; não encontrado nos dados.</p>
        )}

        <Section
          id="acerto"
          numero={2}
          titulo="Acerto por campo"
          descricao="Percentual de acerto de cada campo extraído, comparado ao gabarito determinístico."
        >
          <FieldAccuracyChart execucoes={dados.execucoes} casos={dados.resumo_por_caso} />
        </Section>

        <Section
          id="juiza"
          numero={3}
          titulo="A juíza ajudou?"
          descricao="Para cada item em que IA 1 e IA 2 divergiram: a decisão da juíza corrigiu, manteve ou piorou o resultado?"
        >
          <JudgeCharts execucoes={dados.execucoes} />
        </Section>

        <Section
          id="modelos"
          numero={4}
          titulo="Diversidade de modelos"
          descricao="Quais modelos fizeram cada papel. Quando IA 1 e IA 2 usam o mesmo modelo, a extração dupla perde independência."
        >
          <ModelDiversityTable execucoes={dados.execucoes} />
        </Section>

        <Section id="cobertura" numero={5} titulo="Quanto do PPC chegou às IAs">
          <CoverageCard cobertura={dados.cobertura_texto_ppc_real} />
        </Section>

        <Section
          id="decisoes"
          numero={6}
          titulo="Decisões da juíza"
          descricao="Cada arbitragem registrada, com a página do PPC citada pela juíza e o valor esperado no gabarito."
        >
          <JudgeDecisionsTable decisoes={dados.decisoes_juiza} />
        </Section>
      </main>

      <footer className="border-t bg-background">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted-foreground md:px-8">
          Fonte: execuções reais pontuadas contra gabarito determinístico. Tempo manual ainda não medido.
        </div>
      </footer>
    </div>
  )
}
