import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as githubApi from "../../utils/github-api";
import {
  fetchRepository,
  fetchCommitActivity,
  fetchOpenPRCount,
  fetchMergedPRCount,
  fetchContributorsCount,
  searchRepositories,
} from "../github";

vi.mock("../../utils/github-api");

const mockedGithubFetch = vi.mocked(githubApi.githubFetch);
const mockedGithubFetchWithLinkCount = vi.mocked(
  githubApi.githubFetchWithLinkCount
);

describe("github service", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it("fetchRepository calls correct endpoint", async () => {
    const repo = { id: 1, full_name: "facebook/react" };
    mockedGithubFetch.mockResolvedValue(repo);

    const result = await fetchRepository("facebook/react");
    expect(result).toEqual(repo);
    expect(mockedGithubFetch).toHaveBeenCalledWith("/repos/facebook/react");
  });

  it("fetchCommitActivity calls correct endpoint", async () => {
    const weeks = [{ total: 10, week: 1, days: [1, 2, 3, 4, 0, 0, 0] }];
    mockedGithubFetch.mockResolvedValue(weeks);

    const result = await fetchCommitActivity("facebook/react");
    expect(result).toEqual(weeks);
    expect(mockedGithubFetch).toHaveBeenCalledWith(
      "/repos/facebook/react/stats/commit_activity"
    );
  });

  it("fetchOpenPRCount extracts total_count from search", async () => {
    mockedGithubFetch.mockResolvedValue({ total_count: 42 });

    const result = await fetchOpenPRCount("facebook/react");
    expect(result).toBe(42);
    expect(mockedGithubFetch).toHaveBeenCalledWith(
      expect.stringContaining("/search/issues?q=")
    );
    expect(mockedGithubFetch).toHaveBeenCalledWith(
      expect.stringContaining("state%3Aopen")
    );
  });

  it("fetchMergedPRCount extracts total_count from search", async () => {
    mockedGithubFetch.mockResolvedValue({ total_count: 100 });

    const result = await fetchMergedPRCount("facebook/react");
    expect(result).toBe(100);
    expect(mockedGithubFetch).toHaveBeenCalledWith(
      expect.stringContaining("is%3Amerged")
    );
  });

  it("fetchContributorsCount uses link count endpoint", async () => {
    mockedGithubFetchWithLinkCount.mockResolvedValue(250);

    const result = await fetchContributorsCount("facebook/react");
    expect(result).toBe(250);
    expect(mockedGithubFetchWithLinkCount).toHaveBeenCalledWith(
      "/repos/facebook/react/contributors?per_page=1&anon=true"
    );
  });

  it("searchRepositories encodes query and sorts by stars", async () => {
    const response = { total_count: 1, items: [] };
    mockedGithubFetch.mockResolvedValue(response);

    const result = await searchRepositories("react framework");
    expect(result).toEqual(response);
    expect(mockedGithubFetch).toHaveBeenCalledWith(
      expect.stringContaining("react%20framework")
    );
    expect(mockedGithubFetch).toHaveBeenCalledWith(
      expect.stringContaining("sort=stars")
    );
  });
});
