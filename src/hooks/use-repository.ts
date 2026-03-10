import { useSuspenseQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/query-keys";
import { fetchRepository, fetchCommitActivity, fetchOpenPRCount } from "../services/github";

const FIVE_MINUTES = 5 * 60 * 1000;

export function useRepository(fullName: string) {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.repository(fullName),
    queryFn: () => fetchRepository(fullName),
    staleTime: FIVE_MINUTES,
  });
}

export function useCommitActivity(fullName: string) {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.commitActivity(fullName),
    queryFn: () => fetchCommitActivity(fullName),
    staleTime: FIVE_MINUTES,
    retry: 5,
    retryDelay: 2000,
  });
}

export function useOpenPRCount(fullName: string) {
  return useSuspenseQuery({
    queryKey: QUERY_KEYS.openPRCount(fullName),
    queryFn: () => fetchOpenPRCount(fullName),
    staleTime: FIVE_MINUTES,
  });
}
