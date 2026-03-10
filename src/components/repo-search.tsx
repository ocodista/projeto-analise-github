import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/query-keys";
import { searchRepositories } from "../services/github";

const DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 2;
const FIVE_MINUTES = 5 * 60 * 1000;

type RepoSearchProps = {
  onSelect: (fullName: string) => void;
  selectedRepos: string[];
};

export function RepoSearch({ onSelect, selectedRepos }: RepoSearchProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEYS.searchRepositories(debouncedQuery),
    queryFn: () => searchRepositories(debouncedQuery),
    staleTime: FIVE_MINUTES,
    enabled: debouncedQuery.length >= MIN_QUERY_LENGTH,
  });

  const handleSelect = (fullName: string) => {
    onSelect(fullName);
    setQuery("");
    setDebouncedQuery("");
    setIsDropdownOpen(false);
  };

  const filteredResults =
    data?.items.filter((repo) => !selectedRepos.includes(repo.full_name)) ?? [];

  return (
    <div ref={containerRef} className="relative group">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <svg
          className="h-5 w-5 text-neutral-600 transition-colors group-focus-within:text-neutral-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsDropdownOpen(true);
        }}
        onFocus={() => setIsDropdownOpen(true)}
        placeholder="Search repositories... (e.g. react, vue, angular)"
        className="w-full rounded-xl border border-border bg-surface pl-12 pr-4 py-3 text-sm text-neutral-200 placeholder-neutral-600 shadow-sm outline-none transition-all hover:border-border-hover focus:border-neutral-500 focus:bg-surface-hover"
      />

      {isFetching && (
        <div className="absolute right-3 top-3.5">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-500 border-t-transparent" />
        </div>
      )}

      {isDropdownOpen && filteredResults.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-border bg-surface shadow-xl">
          {filteredResults.map((repo) => (
            <li key={repo.id}>
              <button
                onClick={() => handleSelect(repo.full_name)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-surface-hover"
              >
                <img
                  src={repo.owner.avatar_url}
                  alt=""
                  className="h-6 w-6 rounded-full border border-border"
                />
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-neutral-200">
                    {repo.full_name}
                  </span>
                  {repo.description && (
                    <p className="truncate text-xs text-neutral-600">
                      {repo.description}
                    </p>
                  )}
                </div>
                <span className="text-xs text-neutral-600">
                  ★ {repo.stargazers_count.toLocaleString()}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
