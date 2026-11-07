# Prompt 2 (v0): destaque da conclusão central

Enviado ao v0 depois de eu acrescentar o campo `juiza_por_diversidade` ao JSON de dados. O v0 respondeu com o
commit `Add judge model-diversity cards and reduce revalidate to 300s`. Texto exatamente como enviado:

```
Ajuste a seção 3 "A juíza ajudou?". O JSON agora tem um campo novo, `juiza_por_diversidade` (array com
2 grupos: grupo, execucoes, divergencias_avaliadas, corrigiu, piorou, manteve_certo, manteve_errado,
acerto_pct). Use os números do JSON, sem escrever valores fixos no código.

1. No topo da seção, coloque 2 cards lado a lado, um por grupo: número grande com acerto_pct; embaixo,
   "corrigiu X · piorou Y" (piorou em vermelho) e "N divergências avaliadas"; e chips com os ids das
   execuções. O card "modelo diferente" tem borda roxa; o card "mesmo modelo", borda vermelha clara.
2. Acima dos cards, uma frase de destaque gerada a partir dos dados: "A juíza acerta {acerto diferente}%
   quando roda num modelo diferente das IAs 1 e 2, e {acerto mesmo}% quando cai no mesmo modelo por falha
   de cota." Use formatação pt-BR (vírgula decimal).
3. Mantenha os dois gráficos existentes da seção logo abaixo dos cards.
4. Tipe o campo novo em TypeScript. Se ele não existir no JSON (cache antigo), esconda os cards sem quebrar
   a página.
5. Reduza o cache do fetch para revalidate: 300.
```
