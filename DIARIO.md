# DIARIO — ppc-gradment-dashboard

Registro de autoria: o que a Catarina decidiu e fez, e o que a IA fez. Uma entrada por sessão de trabalho.
Este diário começa em 2026-11-07. A construção do dashboard, em 05/11/2026, está nos 3 commits e nos prompts
da pasta `prompts/`.

## 2026-11-07 · [PREENCHER] h
**Catarina decidiu:** tornar o repositório público e transformá-lo numa demonstração de vibe coding para quem avalia o portfólio: README com a linha do tempo, os prompts exatos e a divisão entre o que foi dela e o que foi da IA.
**Catarina fez:** deixou o repositório público no GitHub. [PREENCHER o que mais fez]
**A IA fez:** conferiu o repositório antes de ele ser tratado como vitrine (nenhuma chave, e-mail ou dado pessoal nos arquivos versionados); extraiu do `ppc-gradment-ia` os dois prompts enviados ao v0, exatamente como enviados, para `prompts/`; escreveu o README; trocou o selo "A MEDIR" por "não medido"; ligou a validação de tipos no build (o v0 deixa `ignoreBuildErrors: true`) depois de conferir que `tsc --noEmit` e `next build` passam; renomeou o pacote `my-project`.
**Onde a IA errou e como foi corrigido:** o primeiro impulso foi usar a captura de tela que já existia no repositório do pipeline, mas ela mostrava uma versão antiga do dashboard (ainda com "manual: A MEDIR" e sem a seção "Contra o processo anterior"); foi descartada e substituída por duas capturas novas do site publicado, tiradas depois do deploy. Também foi preciso conferir quem escreveu a correção do erro de avaliação antes de atribuí-la no README: o commit `3663543` do pipeline é do Claude Code, e não da Catarina.
**Aprendizado:** [PREENCHER]
