import type { FallbackProps } from "react-error-boundary";

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-6 text-center">
      <h2 className="mb-2 text-lg font-semibold text-red-400">
        Something went wrong
      </h2>
      <p className="mb-4 text-sm text-red-400/70">
        {error instanceof Error ? error.message : "An unexpected error occurred"}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="rounded-lg bg-neutral-200 px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-white"
      >
        Try again
      </button>
    </div>
  );
}
