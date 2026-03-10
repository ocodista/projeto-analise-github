import { formatCompactNumber, formatRelativeDate } from "../utils/format";
import type { RepositoryComparison } from "../types/github";

type RepoCardProps = {
  comparison: RepositoryComparison;
};

type MetricProps = {
  label: string;
  value: string;
};

function Metric({ label, value }: MetricProps) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-600">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-neutral-200">{value}</p>
    </div>
  );
}

export function RepoCard({ comparison }: RepoCardProps) {
  const {
    repository,
    commitActivity,
    openPRCount,
    mergedPRCount,
    contributorsCount,
  } = comparison;
  const totalCommits = commitActivity.reduce(
    (sum, week) => sum + week.total,
    0
  );

  return (
    <div className="card-glow relative rounded-xl border border-border bg-surface p-6 transition-all duration-300 group hover:bg-surface-hover">
      <div className="mb-5 flex items-center gap-3">
        <img
          src={repository.owner.avatar_url}
          alt=""
          className="h-8 w-8 rounded-full border border-border"
        />
        <div className="min-w-0">
          <a
            href={repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-medium text-neutral-200 transition-colors group-hover:text-white truncate block"
          >
            {repository.full_name}
          </a>
        </div>
      </div>

      {repository.description && (
        <p className="mb-6 h-10 text-sm text-neutral-500 line-clamp-2">
          {repository.description}
        </p>
      )}

      <div className="grid grid-cols-3 gap-x-2 gap-y-6 border-t border-border pt-6">
        <Metric
          label="Stars"
          value={formatCompactNumber(repository.stargazers_count)}
        />
        <Metric
          label="Forks"
          value={formatCompactNumber(repository.forks_count)}
        />
        <Metric
          label="Contributors"
          value={formatCompactNumber(contributorsCount)}
        />
        <Metric
          label="Open PRs"
          value={formatCompactNumber(openPRCount)}
        />
        <Metric
          label="Merged PRs"
          value={formatCompactNumber(mergedPRCount)}
        />
        <Metric
          label="Commits (52w)"
          value={formatCompactNumber(totalCommits)}
        />
        <Metric
          label="Issues"
          value={formatCompactNumber(repository.open_issues_count)}
        />
        <Metric
          label="Last Push"
          value={formatRelativeDate(repository.pushed_at)}
        />
      </div>
    </div>
  );
}
