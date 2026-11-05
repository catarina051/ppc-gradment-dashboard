export const DATA_URL =
  'https://raw.githubusercontent.com/catarina051/ppc-gradment-ia/main/avaliacao/dashboard-dados.json'

export type CasoId = 'sintetico' | 'cefet-engcomp' | 'unifei-eco' | (string & {})

export interface Gabarito {
  disciplinas: number
  requisitos: number | null
  parcial: boolean
}

export interface ResumoCaso {
  caso: CasoId
  descricao: string
  gabarito: Gabarito
  execucoes: number
  sucesso: number
  tempo_medio_s: number
  tempo_min_s: number
  tempo_max_s: number
  disciplinas_revocacao_media_pct: number | null
  disciplinas_precisao_media_pct: number | null
  classificacao_obrig_opt_media_pct: number | null
  periodo_exato_medio_pct: number | null
  carga_horaria_media_pct: number | null
  requisitos_precisao_media_pct: number | null
  requisitos_revocacao_media_pct: number | null
  invariantes_gradment_ok: string
  execucoes_com_ia1_e_ia2_no_mesmo_modelo: number
  juiza_acionada: number
  juiza_corrigiu: number
  juiza_piorou: number
}

export interface Execucao {
  id: string
  caso: CasoId
  segundos: number
  modelo_ia1: string
  modelo_ia2: string
  modelo_ia3: string | null
  ia1_e_ia2_mesmo_modelo: boolean
  divergencias: number
  juiza_acionada: boolean
  disciplinas_encontradas_pct: number
  obrig_vs_optativa_pct: number
  periodo_pct: number
  carga_horaria_pct: number
  /** Ausente/null quando o caso não tem gabarito de requisitos (ex.: unifei-eco). */
  requisitos_precisao_pct?: number | null
  requisitos_revocacao_pct?: number | null
  regras_gradment_ok: boolean
  /** null = juíza não acionada */
  juiza_corrigiu: number | null
  juiza_piorou: number | null
  juiza_manteve_certo: number | null
  juiza_manteve_errado: number | null
  acerto_nas_divergencias_juiza_pct: number | null
  acerto_nas_divergencias_sempre_ia1_pct: number | null
  acerto_nas_divergencias_sempre_ia2_pct: number | null
}

export type EfeitoJuiza = 'CORRIGIU' | 'MANTEVE_CERTO' | 'MANTEVE_ERRADO' | 'PIOROU'

export interface DecisaoJuiza {
  execucao: string
  id: string
  tipo: 'disciplina' | 'requisito' | (string & {})
  item: string
  motivo: string
  so_ementa_divergia: boolean
  acao_juiza: string
  pagina_citada: string
  esperado: string
  efeito: EfeitoJuiza
}

export interface CoberturaTexto {
  paginas_total: number
  paginas_enviadas_as_ias: number
  caracteres_texto_bruto: number
  caracteres_enviados_as_ias: number
  blocos_detalhamento_total: number
  blocos_detalhamento_enviados: number
  disciplinas_cortadas: string[]
}

export interface TempoManual {
  minutos: number | null
  status: string
  protocolo: string
}

export interface JuizaPorDiversidade {
  grupo: string
  execucoes: string[]
  divergencias_avaliadas: number
  corrigiu: number
  piorou: number
  manteve_certo: number
  manteve_errado: number
  acerto_pct: number
}

export interface DashboardDados {
  gerado_em: string
  fonte: string
  resumo_por_caso: ResumoCaso[]
  execucoes: Execucao[]
  decisoes_juiza: DecisaoJuiza[]
  /** Pode faltar em respostas antigas em cache. */
  juiza_por_diversidade?: JuizaPorDiversidade[]
  cobertura_texto_ppc_real: CoberturaTexto
  tempo_manual: TempoManual
  volume_por_ppc_real: {
    disciplinas: number
    campos_por_disciplina: number
    requisitos: number
  }
}

export async function getDashboardDados(): Promise<DashboardDados> {
  const res = await fetch(DATA_URL, { next: { revalidate: 300 } })
  if (!res.ok) {
    throw new Error(`Falha ao buscar dados (${res.status} ${res.statusText})`)
  }
  return (await res.json()) as DashboardDados
}
