# GitHub Repository Comparator

Compare repositórios do GitHub lado a lado com métricas em tempo real e gráficos interativos.

## O que faz

Selecione repositórios das sugestões curadas ou busque por nome. O dashboard renderiza cards de métricas e três tipos de gráfico para comparação visual.

**Métricas por repositório:** stars, forks, contributors, PRs abertos/mergeados, commits (52 semanas) e issues.

**Gráficos:**
- Barras — popularidade (stars, forks, watchers)
- Radar — 7 dimensões normalizadas
- Linha — atividade de commits (semanal/mensal)

## Início rápido

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Token do GitHub (opcional)

A API do GitHub permite 60 requests/hora sem autenticação. Adicione um [Personal Access Token](https://github.com/settings/tokens) pelo botão no header para aumentar o limite para 5.000 requests/hora.

## Stack

- React 19 + TypeScript + Vite
- TailwindCSS v4
- TanStack React Query (Suspense mode)
- Apache ECharts
- react-error-boundary

## Testes

```bash
npm test          # testes unitários (Vitest)
npm run test:e2e  # testes e2e (Playwright)
```

## CI/CD

| Workflow | Gatilho | Ação |
|----------|---------|------|
| CI | PR para main | Roda testes unitários |
| Deploy | Push na main | Build e deploy no GitHub Pages |
| Preview | PR aberto/atualizado | Deploy de preview + testes e2e |
| Cleanup | PR fechado | Remove deploy de preview |
