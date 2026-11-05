import { ehDoPipeline, getDashboardDados } from '@/lib/dashboard-data'
import { formatDateTime } from '@/lib/format'
import { Section } from '@/components/dashboard/section'
import { KpiHeader } from '@/components/dashboard/kpi-header'
import { FieldAccuracyChart } from '@/components/dashboard/field-accuracy-chart'
import { JudgeCharts } from '@/components/dashboard/judge-charts'
import { JudgeDiversityCards } from '@/components/dashboard/judge-diversity-cards'
import { ModelDiversityTable } from '@/components/dashboard/model-diversity-table'
import { CoverageCard } from '@/components/dashboard/coverage-card'
import { JudgeDecisionsTable } from '@/components/dashboard/judge-decisions-table'
import { PreviousProcess } from '@/components/dashboard/previous-process'

export default async function Page() {
  const dados = await getDashboardDados()
  // O baseline (processo anterior) e as tentativas que falharam ficam fora dos gráficos do pipeline
  const execucoes = dados.execucoes.filter((e) => ehDoPipeline(e.caso) && !e.falhou)
  const casos = dados.resumo_por_caso.filter((c) => ehDoPipeline(c.caso))
  const decisoes = dados.decisoes_juiza.filter((d) => execucoes.some((e) => e.id === d.execucao))
  const cefet = casos.find((c) => c.caso === 'cefet-engcomp')
  const sintetico = casos.find((c) => c.caso === 'sintetico')

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
            {execucoes.length} execuções do pipeline · {casos.length} casos · {decisoes.length} decisões da juíza ·
            dados gerados em{' '}
            <time dateTime={dados.gerado_em}>{formatDateTime(dados.gerado_em)}</time>
          </p>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-14 px-4 py-10 md:px-8">
        {cefet ? (
          <section aria-label="Indicadores principais">
            <KpiHeader
              cefet={cefet}
              sintetico={sintetico}
              tempoModeloUnico={dados.processo_anterior?.qualidade?.segundos ?? null}
            />
          </section>
        ) : (
          <p className="text-sm text-muted-foreground">Caso &quot;cefet-engcomp&quot; não encontrado nos dados.</p>
        )}

        {dados.processo_anterior?.qualidade ? (
          <Section
            id="anterior"
            numero={2}
            titulo="Contra o processo anterior"
            descricao="Um modelo recebe o PPC inteiro e a especificação do GradMent, sem segunda IA, juíza ou validador. Mesmo PPC e mesmo gabarito."
          >
            <PreviousProcess anterior={dados.processo_anterior} pipeline={cefet} />
          </Section>
        ) : null}

        <Section
          id="acerto"
          numero={3}
          titulo="Acerto por campo"
          descricao="Percentual de acerto de cada campo extraído, comparado ao gabarito determinístico."
        >
          <FieldAccuracyChart execucoes={execucoes} casos={casos} />
        </Section>

        <Section
          id="juiza"
          numero={4}
          titulo="A juíza ajudou?"
          descricao="Para cada item em que IA 1 e IA 2 divergiram: a decisão da juíza corrigiu, manteve ou piorou o resultado?"
        >
          <div className="flex flex-col gap-4">
            <JudgeDiversityCards grupos={dados.juiza_por_diversidade} />
            <JudgeCharts execucoes={execucoes} />
          </div>
        </Section>

        <Section
          id="modelos"
          numero={5}
          titulo="Diversidade de modelos"
          descricao="Quais modelos fizeram cada papel. Quando IA 1 e IA 2 usam o mesmo modelo, a extração dupla perde independência."
        >
          <ModelDiversityTable execucoes={execucoes} />
        </Section>

        <Section id="cobertura" numero={6} titulo="Quanto do PPC chegou às IAs">
          <CoverageCard cobertura={dados.cobertura_texto_ppc_real} />
        </Section>

        <Section
          id="decisoes"
          numero={7}
          titulo="Decisões da juíza"
          descricao="Cada arbitragem registrada, com a página do PPC citada pela juíza e o valor esperado no gabarito."
        >
          <JudgeDecisionsTable decisoes={decisoes} />
        </Section>
      </main>

      <footer className="border-t bg-background">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted-foreground md:px-8">
          Fonte: execuções reais pontuadas contra gabarito determinístico; custo do Claude contado pela API oficial de
          contagem de tokens. Tempo de revisão humana ainda não medido.
        </div>
      </footer>
    </div>
  )
}
