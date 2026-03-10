export type Repository = {
  id: number;
  full_name: string;
  name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  license: { spdx_id: string } | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
};

export type CommitWeek = {
  total: number;
  week: number;
  days: number[];
};

export type SearchResponse = {
  total_count: number;
  items: Repository[];
};

export type OpenPRCountResponse = {
  total_count: number;
};

export type RepositoryComparison = {
  repository: Repository;
  commitActivity: CommitWeek[];
  openPRCount: number;
  mergedPRCount: number;
  contributorsCount: number;
};

export type CommitPeriod = "week" | "month";

export type AggregatedCommitPoint = {
  label: string;
  total: number;
};
