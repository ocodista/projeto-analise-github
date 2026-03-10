const GITHUB_API = "https://api.github.com";
const TOKEN_KEY = "github-token";

export function getStoredToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? "";
}

export function setStoredToken(token: string): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function buildHeaders(): HeadersInit {
  const token = getStoredToken();
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function githubFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${GITHUB_API}${path}`, {
    headers: buildHeaders(),
  });

  if (response.status === 202) {
    throw new Error("GitHub is computing this data. Retrying...");
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody?.message ?? `GitHub API error: ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

export async function githubFetchWithLinkCount(path: string): Promise<number> {
  const response = await fetch(`${GITHUB_API}${path}`, {
    headers: buildHeaders(),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody?.message ?? `GitHub API error: ${response.status}`;
    throw new Error(message);
  }

  const linkHeader = response.headers.get("Link");
  if (!linkHeader) {
    const body = await response.json();
    return Array.isArray(body) ? body.length : 0;
  }

  const lastMatch = linkHeader.match(/&page=(\d+)>; rel="last"/);
  return lastMatch ? parseInt(lastMatch[1], 10) : 1;
}

type RateLimit = {
  limit: number;
  remaining: number;
  resetAt: Date;
};

type RateLimitResponse = {
  resources: {
    core: { limit: number; remaining: number; reset: number };
    search: { limit: number; remaining: number; reset: number };
  };
};

export async function fetchRateLimit(): Promise<{
  core: RateLimit;
  search: RateLimit;
}> {
  const data = await githubFetch<RateLimitResponse>("/rate_limit");

  return {
    core: {
      limit: data.resources.core.limit,
      remaining: data.resources.core.remaining,
      resetAt: new Date(data.resources.core.reset * 1000),
    },
    search: {
      limit: data.resources.search.limit,
      remaining: data.resources.search.remaining,
      resetAt: new Date(data.resources.search.reset * 1000),
    },
  };
}
