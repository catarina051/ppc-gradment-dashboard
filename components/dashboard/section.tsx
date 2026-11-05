export function Section({
  id,
  numero,
  titulo,
  descricao,
  children,
}: {
  id: string
  numero: number
  titulo: string
  descricao?: string
  children: React.ReactNode
}) {
  return (
    <section aria-labelledby={`${id}-titulo`} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold tracking-wider text-primary uppercase">Seção {numero}</p>
        <h2 id={`${id}-titulo`} className="text-xl font-semibold tracking-tight text-balance md:text-2xl">
          {titulo}
        </h2>
        {descricao ? <p className="max-w-3xl text-sm text-pretty text-muted-foreground">{descricao}</p> : null}
      </div>
      {children}
    </section>
  )
}
