import { useRepositoryComparison } from "../hooks/use-repository-comparison";
import { RepoCardGrid } from "./repo-card-grid";
import { PopularityBarChart } from "./popularity-bar-chart";
import { ActivityRadarChart } from "./activity-radar-chart";
import { CommitActivityLineChart } from "./commit-activity-line-chart";

type ComparisonDashboardProps = {
  selectedRepos: string[];
};

export function ComparisonDashboard({
  selectedRepos,
}: ComparisonDashboardProps) {
  const comparisons = useRepositoryComparison(selectedRepos);

  return (
    <div className="space-y-6">
      <RepoCardGrid comparisons={comparisons} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PopularityBarChart comparisons={comparisons} />
        <ActivityRadarChart comparisons={comparisons} />
      </div>
      <CommitActivityLineChart comparisons={comparisons} />
    </div>
  );
}
