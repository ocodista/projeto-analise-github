import { githubFetch, githubFetchWithLinkCount } from "../utils/github-api";
import type {
  Repository,
  CommitWeek,
  SearchResponse,
  OpenPRCountResponse,
} from "../types/github";

export function fetchRepository(fullName: string): Promise<Repository> {
  return githubFetch<Repository>(`/repos/${fullName}`);
}

export function fetchCommitActivity(fullName: string): Promise<CommitWeek[]> {
  return githubFetch<CommitWeek[]>(`/repos/${fullName}/stats/commit_activity`);
}

export function fetchOpenPRCount(fullName: string): Promise<number> {
  const query = encodeURIComponent(`repo:${fullName} type:pr state:open`);
  return githubFetch<OpenPRCountResponse>(
    `/search/issues?q=${query}&per_page=1`
  ).then((response) => response.total_count);
}

export function fetchMergedPRCount(fullName: string): Promise<number> {
  const query = encodeURIComponent(`repo:${fullName} type:pr is:merged`);
  return githubFetch<OpenPRCountResponse>(
    `/search/issues?q=${query}&per_page=1`
  ).then((response) => response.total_count);
}

export function fetchContributorsCount(fullName: string): Promise<number> {
  return githubFetchWithLinkCount(
    `/repos/${fullName}/contributors?per_page=1&anon=true`
  );
}

export function searchRepositories(query: string): Promise<SearchResponse> {
  const encoded = encodeURIComponent(query);
  return githubFetch<SearchResponse>(
    `/search/repositories?q=${encoded}&per_page=10&sort=stars`
  );
}
