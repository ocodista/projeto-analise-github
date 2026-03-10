import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/query-keys";
import { fetchRateLimit } from "../utils/github-api";

const ONE_MINUTE = 60 * 1000;

export function RateLimitBadge() {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.rateLimit,
    queryFn: fetchRateLimit,
    staleTime: ONE_MINUTE,
    refetchInterval: ONE_MINUTE,
  });

  if (isLoading) {
    return <span className="text-xs text-neutral-600 animate-pulse">Loading...</span>;
  }

  if (isError || !data) return null;

  return (
    <div className="flex items-center gap-3 text-xs font-medium">
      <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 shadow-sm">
        <span className="text-neutral-500">Core</span>
        <span className="text-neutral-200">
          {data.core.remaining}/{data.core.limit}
        </span>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 shadow-sm">
        <span className="text-neutral-500">Search</span>
        <span className="text-neutral-200">
          {data.search.remaining}/{data.search.limit}
        </span>
      </div>
    </div>
  );
}
