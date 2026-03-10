import { useSuspenseQueries } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/query-keys";
import {
  fetchRepository,
  fetchCommitActivity,
  fetchOpenPRCount,
  fetchMergedPRCount,
  fetchContributorsCount,
} from "../services/github";
import type { RepositoryComparison } from "../types/github";

const FIVE_MINUTES = 5 * 60 * 1000;

export function useRepositoryComparison(
  repoNames: string[]
): RepositoryComparison[] {
  const repositoryQueries = useSuspenseQueries({
    queries: repoNames.map((name) => ({
      queryKey: QUERY_KEYS.repository(name),
      queryFn: () => fetchRepository(name),
      staleTime: FIVE_MINUTES,
    })),
  });

  const commitQueries = useSuspenseQueries({
    queries: repoNames.map((name) => ({
      queryKey: QUERY_KEYS.commitActivity(name),
      queryFn: () => fetchCommitActivity(name),
      staleTime: FIVE_MINUTES,
      retry: 5,
      retryDelay: 2000,
    })),
  });

  const openPRQueries = useSuspenseQueries({
    queries: repoNames.map((name) => ({
      queryKey: QUERY_KEYS.openPRCount(name),
      queryFn: () => fetchOpenPRCount(name),
      staleTime: FIVE_MINUTES,
    })),
  });

  const mergedPRQueries = useSuspenseQueries({
    queries: repoNames.map((name) => ({
      queryKey: QUERY_KEYS.mergedPRCount(name),
      queryFn: () => fetchMergedPRCount(name),
      staleTime: FIVE_MINUTES,
    })),
  });

  const contributorsQueries = useSuspenseQueries({
    queries: repoNames.map((name) => ({
      queryKey: QUERY_KEYS.contributorsCount(name),
      queryFn: () => fetchContributorsCount(name),
      staleTime: FIVE_MINUTES,
    })),
  });

  return repoNames.map((_, index) => ({
    repository: repositoryQueries[index].data,
    commitActivity: commitQueries[index].data,
    openPRCount: openPRQueries[index].data,
    mergedPRCount: mergedPRQueries[index].data,
    contributorsCount: contributorsQueries[index].data,
  }));
}
