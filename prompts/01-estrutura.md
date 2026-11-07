# Prompt 1 (v0): estrutura do dashboard

Enviado ao v0 como primeiro prompt. O v0 gerou o commit inicial deste repositório (`Initial commit from v0`).
A amostra do formato dos dados que acompanhou o prompt foi omitida: eram 3 execuções e 2 decisões tiradas do
próprio JSON. Texto exatamente como enviado:

```
Crie um dashboard em Next.js + Tailwind + shadcn/ui + Recharts, em português do Brasil, chamado
"PPC → GradMent: o que a dupla IA + juíza realmente entrega".

Contexto: é um pipeline em n8n que lê o Projeto Pedagógico de Curso (PPC) de uma universidade e gera a
matriz curricular (disciplinas, períodos, carga horária, pré-requisitos) para o GradMent, um planejador
de grade. Duas IAs extraem de forma independente, um código compara e uma 3ª IA (juíza) arbitra só as
divergências. Medi cada execução contra um gabarito sem LLM.

Os dados REAIS ficam em https://raw.githubusercontent.com/catarina051/ppc-gradment-ia/main/avaliacao/dashboard-dados.json .
Busque com fetch num Server Component (next: { revalidate: 3600 }), tipe com TypeScript a partir da amostra
abaixo e NÃO invente nenhum número nem use dados de exemplo no lugar dos reais.
"A MEDIR" (badge cinza) só para tempo_manual. Nos requisitos do caso unifei-eco, null significa "sem gabarito"
(badge cinza com esse texto). Em métricas da juíza, null significa "juíza não acionada".

Seções, nesta ordem:
1. Cabeçalho com 4 cards de KPI para o caso "cefet-engcomp" (PPC real de 190 páginas):
   - Tempo médio por PPC (min:seg) e, ao lado, "manual: A MEDIR"
   - Disciplinas encontradas (%) e "99/99"
   - Carga horária correta (%)
   - Pré-requisitos encontrados (revocação %) com a precisão (%) em texto menor
   Mostre também uma linha menor com os mesmos números do caso "sintetico".
2. "Acerto por campo": gráfico de barras agrupadas por execução (eixo X = id da execução), barras para
   obrig_vs_optativa_pct, periodo_pct, carga_horaria_pct, requisitos_precisao_pct e requisitos_revocacao_pct.
   Filtro por caso (sintetico / cefet-engcomp / unifei-eco).
3. "A juíza ajudou?": barras empilhadas horizontais por execução com juiza_corrigiu (verde),
   juiza_manteve_certo (cinza), juiza_manteve_errado (âmbar) e juiza_piorou (vermelho). Ao lado, um
   gráfico de barras comparando, por execução, acerto_nas_divergencias_juiza_pct,
   acerto_nas_divergencias_sempre_ia1_pct e acerto_nas_divergencias_sempre_ia2_pct.
4. "Diversidade de modelos": tabela por execução com modelo_ia1, modelo_ia2, modelo_ia3, um badge vermelho
   "mesmo modelo" quando ia1_e_ia2_mesmo_modelo = true, divergencias e requisitos_revocacao_pct.
5. "Quanto do PPC chegou às IAs": um card com cobertura_texto_ppc_real (páginas enviadas / total,
   caracteres enviados / total, blocos de detalhamento enviados / total) usando barras de progresso, e a
   lista de disciplinas_cortadas como chips.
6. "Decisões da juíza": tabela filtrável de decisoes_juiza (colunas execucao, item, motivo, acao_juiza,
   pagina_citada, esperado, efeito) com o efeito colorido como na seção 3 e um filtro "só PIOROU".
7. Rodapé: "Fonte: execuções reais pontuadas contra gabarito determinístico. Tempo manual ainda não medido."

Visual: limpo, fundo claro, uma cor de destaque (roxo #6D28D9), números grandes nos KPIs, responsivo.

AMOSTRA DO FORMATO (truncada: o arquivo real tem 9 execuções, 3 casos e 126 decisões):
{ ...amostra do dashboard-dados.json... }
```
