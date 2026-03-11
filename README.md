# GitHub Repository Comparator

Compare GitHub repositories side by side with real-time metrics and interactive charts.

## What it does

Select repositories from curated suggestions or search by name. The dashboard renders metric cards and three chart types for visual comparison.

**Metrics per repository:** stars, forks, contributors, open/merged PRs, commits (52 weeks), and issues.

**Charts:**
- Bar chart — popularity (stars, forks, watchers)
- Radar chart — 7 normalized dimensions
- Line chart — commit activity (weekly/monthly)

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## GitHub token (optional)

The GitHub API allows 60 requests/hour without authentication. Add a [Personal Access Token](https://github.com/settings/tokens) via the header button to increase the limit to 5,000 requests/hour.

## Stack

- React 19 + TypeScript + Vite
- TailwindCSS v4
- TanStack React Query (Suspense mode)
- Apache ECharts
- react-error-boundary

## Testing

```bash
npm test          # unit tests (Vitest)
npm run test:e2e  # e2e tests (Playwright)
```

## CI/CD

| Workflow | Trigger | Action |
|----------|---------|--------|
| CI | PR to main | Runs unit tests |
| Deploy | Push to main | Builds and deploys to GitHub Pages |
| Preview | PR opened/updated | Deploys preview + runs e2e tests |
| Cleanup | PR closed | Removes preview deployment |
