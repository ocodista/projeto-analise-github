import { useState, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { TokenConfig } from "./components/token-config";
import { RateLimitBadge } from "./components/rate-limit-badge";
import { RepoSelector } from "./components/repo-selector";
import { ComparisonDashboard } from "./components/comparison-dashboard";
import { ErrorFallback } from "./components/error-fallback";
import { DashboardSkeleton } from "./components/dashboard-skeleton";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);

  const addRepo = (fullName: string) => {
    setSelectedRepos((prev) => [...prev, fullName]);
  };

  const removeRepo = (fullName: string) => {
    setSelectedRepos((prev) => prev.filter((r) => r !== fullName));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background font-sans antialiased">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-100">
                Compare Repositories
              </h1>
              <p className="mt-2 text-sm text-neutral-500">
                Analyze open-source projects side by side.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <RateLimitBadge />
              <TokenConfig />
            </div>
          </header>

          <section className="mb-12">
            <RepoSelector
              selectedRepos={selectedRepos}
              onAdd={addRepo}
              onRemove={removeRepo}
            />
          </section>

          {selectedRepos.length > 0 && (
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              resetKeys={selectedRepos}
            >
              <Suspense fallback={<DashboardSkeleton />}>
                <ComparisonDashboard selectedRepos={selectedRepos} />
              </Suspense>
            </ErrorBoundary>
          )}

          {selectedRepos.length === 0 && (
            <div className="mt-16 text-center">
              <p className="text-sm text-neutral-600">
                Search or pick a suggestion to start comparing.
              </p>
            </div>
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
}
