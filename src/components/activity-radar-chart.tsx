import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import type { RepositoryComparison } from "../types/github";
import {
  CHART_COLORS,
  DARK_LEGEND,
  DARK_TOOLTIP,
} from "../constants/chart-theme";

function normalize(values: number[]): number[] {
  const max = Math.max(...values, 1);
  return values.map((v) => Math.round((v / max) * 100));
}

function buildRadarOptions(
  comparisons: RepositoryComparison[]
): EChartsOption {
  const stars = comparisons.map((c) => c.repository.stargazers_count);
  const forks = comparisons.map((c) => c.repository.forks_count);
  const issues = comparisons.map((c) => c.repository.open_issues_count);
  const openPRs = comparisons.map((c) => c.openPRCount);
  const mergedPRs = comparisons.map((c) => c.mergedPRCount);
  const contributors = comparisons.map((c) => c.contributorsCount);
  const commits = comparisons.map((c) =>
    c.commitActivity.reduce((sum, w) => sum + w.total, 0)
  );

  const normalizedStars = normalize(stars);
  const normalizedForks = normalize(forks);
  const normalizedIssues = normalize(issues);
  const normalizedOpenPRs = normalize(openPRs);
  const normalizedMergedPRs = normalize(mergedPRs);
  const normalizedContributors = normalize(contributors);
  const normalizedCommits = normalize(commits);

  return {
    tooltip: DARK_TOOLTIP,
    legend: {
      ...DARK_LEGEND,
      data: comparisons.map((c) => c.repository.name),
    },
    radar: {
      indicator: [
        { name: "Stars", max: 100 },
        { name: "Forks", max: 100 },
        { name: "Contributors", max: 100 },
        { name: "Open PRs", max: 100 },
        { name: "Merged PRs", max: 100 },
        { name: "Issues", max: 100 },
        { name: "Commits", max: 100 },
      ],
      axisName: { color: "#666" },
      splitLine: { lineStyle: { color: "#1a1a1a" } },
      splitArea: { areaStyle: { color: ["transparent"] } },
      axisLine: { lineStyle: { color: "#333" } },
    },
    series: [
      {
        type: "radar",
        data: comparisons.map((c, i) => ({
          name: c.repository.name,
          value: [
            normalizedStars[i],
            normalizedForks[i],
            normalizedContributors[i],
            normalizedOpenPRs[i],
            normalizedMergedPRs[i],
            normalizedIssues[i],
            normalizedCommits[i],
          ],
          lineStyle: {
            color: CHART_COLORS[i % CHART_COLORS.length],
          },
          itemStyle: {
            color: CHART_COLORS[i % CHART_COLORS.length],
          },
          areaStyle: {
            color: CHART_COLORS[i % CHART_COLORS.length],
            opacity: 0.1,
          },
        })),
      },
    ],
  };
}

type ActivityRadarChartProps = {
  comparisons: RepositoryComparison[];
};

export function ActivityRadarChart({ comparisons }: ActivityRadarChartProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h3 className="mb-6 flex items-center gap-2 text-sm font-medium text-neutral-200">
        <svg
          className="h-4 w-4 text-neutral-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Activity Radar
      </h3>
      <ReactECharts
        option={buildRadarOptions(comparisons)}
        style={{ height: 250 }}
      />
    </div>
  );
}
