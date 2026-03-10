# GitHub Repository Comparator

Dashboard visual para comparar repositórios open-source do GitHub lado a lado.

## Features

- **Busca de repositórios** com debounce e sugestões curadas
- **Comparação lado a lado** com cards de métricas (stars, forks, contributors, PRs abertos/mergeados, commits, issues)
- **Gráfico de barras** para popularidade (stars, forks, watchers)
- **Radar chart** com métricas normalizadas (7 dimensões)
- **Gráfico de linha** para atividade de commits (filtro semanal/mensal)
- **Rate limit** da API do GitHub exibido no header
- **Token opcional** salvo no localStorage para maior cota de API
- **Dark theme** inspirado no design system da Vercel

## Stack

- Vite + React + TypeScript
- TailwindCSS v4
- Apache ECharts (via echarts-for-react)
- TanStack React Query (Suspense mode)
- react-error-boundary

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Token GitHub (opcional)

Para aumentar o rate limit de 60 para 5.000 requests/hora, adicione um [Personal Access Token](https://github.com/settings/tokens) clicando no botão "No token" no header.
