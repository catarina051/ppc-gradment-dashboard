const pctFormatter = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })
const intFormatter = new Intl.NumberFormat('pt-BR')

export function formatPct(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return `${pctFormatter.format(value)}%`
}

export function formatInt(value: number): string {
  return intFormatter.format(value)
}

export function formatMinSec(totalSeconds: number): string {
  const rounded = Math.round(totalSeconds)
  const min = Math.floor(rounded / 60)
  const sec = rounded % 60
  return `${min}:${sec.toString().padStart(2, '0')}`
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(iso))
}

export const EFEITO_CORES = {
  CORRIGIU: '#16A34A',
  MANTEVE_CERTO: '#9CA3AF',
  MANTEVE_ERRADO: '#F59E0B',
  PIOROU: '#DC2626',
} as const

export const EFEITO_ROTULOS = {
  CORRIGIU: 'Corrigiu',
  MANTEVE_CERTO: 'Manteve certo',
  MANTEVE_ERRADO: 'Manteve errado',
  PIOROU: 'Piorou',
} as const
