import { RepoCard } from "./repo-card";
import type { RepositoryComparison } from "../types/github";

type RepoCardGridProps = {
  comparisons: RepositoryComparison[];
};

export function RepoCardGrid({ comparisons }: RepoCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {comparisons.map((comparison) => (
        <RepoCard
          key={comparison.repository.id}
          comparison={comparison}
        />
      ))}
    </div>
  );
}
