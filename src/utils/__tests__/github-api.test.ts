import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getStoredToken,
  setStoredToken,
  githubFetch,
  githubFetchWithLinkCount,
  fetchRateLimit,
} from "../github-api";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

describe("token management", () => {
  beforeEach(() => localStorageMock.clear());

  it("returns empty string when no token stored", () => {
    expect(getStoredToken()).toBe("");
  });

  it("stores and retrieves a token", () => {
    setStoredToken("ghp_abc123");
    expect(getStoredToken()).toBe("ghp_abc123");
  });

  it("removes token when empty string is passed", () => {
    setStoredToken("ghp_abc123");
    setStoredToken("");
    expect(getStoredToken()).toBe("");
  });
});

describe("githubFetch", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => vi.restoreAllMocks());

  it("fetches and returns JSON data", async () => {
    const mockData = { id: 1, name: "test-repo" };
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockData),
    } as Response);

    const result = await githubFetch("/repos/test/repo");
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.github.com/repos/test/repo",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/vnd.github.v3+json",
        }),
      })
    );
  });

  it("includes auth header when token is set", async () => {
    setStoredToken("ghp_test");
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    } as Response);

    await githubFetch("/repos/test/repo");
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer ghp_test",
        }),
      })
    );
  });

  it("throws on 202 (computing) status", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 202,
      json: () => Promise.resolve({}),
    } as Response);

    await expect(githubFetch("/repos/test/repo")).rejects.toThrow(
      "GitHub is computing this data"
    );
  });

  it("throws with API error message on failure", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: "Not Found" }),
    } as Response);

    await expect(githubFetch("/repos/bad/repo")).rejects.toThrow("Not Found");
  });

  it("throws generic error when response body is not JSON", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error("parse error")),
    } as Response);

    await expect(githubFetch("/repos/bad/repo")).rejects.toThrow(
      "GitHub API error: 500"
    );
  });
});

describe("githubFetchWithLinkCount", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => vi.restoreAllMocks());

  it("extracts count from Link header", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      headers: new Headers({
        Link: '<https://api.github.com/repos/test/contributors?per_page=1&page=2>; rel="next", <https://api.github.com/repos/test/contributors?per_page=1&anon=true&page=150>; rel="last"',
      }),
      json: () => Promise.resolve([]),
    } as Response);

    const count = await githubFetchWithLinkCount(
      "/repos/test/contributors?per_page=1"
    );
    expect(count).toBe(150);
  });

  it("falls back to array length when no Link header", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      headers: new Headers(),
      json: () => Promise.resolve([1, 2, 3]),
    } as Response);

    const count = await githubFetchWithLinkCount("/repos/test/contributors");
    expect(count).toBe(3);
  });

  it("returns 0 for non-array body without Link header", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      headers: new Headers(),
      json: () => Promise.resolve({ total: 5 }),
    } as Response);

    const count = await githubFetchWithLinkCount("/repos/test/contributors");
    expect(count).toBe(0);
  });
});

describe("fetchRateLimit", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => vi.restoreAllMocks());

  it("transforms rate limit response", async () => {
    const resetTimestamp = 1700000000;
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          resources: {
            core: { limit: 60, remaining: 58, reset: resetTimestamp },
            search: { limit: 10, remaining: 9, reset: resetTimestamp },
          },
        }),
    } as Response);

    const result = await fetchRateLimit();
    expect(result.core).toEqual({
      limit: 60,
      remaining: 58,
      resetAt: new Date(resetTimestamp * 1000),
    });
    expect(result.search).toEqual({
      limit: 10,
      remaining: 9,
      resetAt: new Date(resetTimestamp * 1000),
    });
  });
});
