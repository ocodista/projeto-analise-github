export const QUERY_KEYS = {
  repository: (fullName: string) => ["repository", fullName] as const,
  commitActivity: (fullName: string) => ["commitActivity", fullName] as const,
  openPRCount: (fullName: string) => ["openPRCount", fullName] as const,
  mergedPRCount: (fullName: string) => ["mergedPRCount", fullName] as const,
  contributorsCount: (fullName: string) =>
    ["contributorsCount", fullName] as const,
  searchRepositories: (query: string) =>
    ["searchRepositories", query] as const,
  rateLimit: ["rateLimit"] as const,
} as const;
