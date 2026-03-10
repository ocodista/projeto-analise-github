import { SUGGESTED_REPOS } from "../constants/suggested-repos";

type SuggestedReposProps = {
  onSelect: (fullName: string) => void;
  selectedRepos: string[];
};

export function SuggestedRepos({
  onSelect,
  selectedRepos,
}: SuggestedReposProps) {
  const availableRepos = SUGGESTED_REPOS.filter(
    (repo) => !selectedRepos.includes(repo)
  );

  if (availableRepos.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <span className="mr-2 flex items-center text-xs font-medium text-neutral-600">
        Suggested
      </span>
      {availableRepos.map((repo) => (
        <button
          key={repo}
          onClick={() => onSelect(repo)}
          className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-neutral-400 transition-all hover:border-neutral-600 hover:text-neutral-200"
        >
          {repo}
        </button>
      ))}
    </div>
  );
}
