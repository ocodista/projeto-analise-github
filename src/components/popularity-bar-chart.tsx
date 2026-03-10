import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import type { RepositoryComparison } from "../types/github";
import {
  CHART_COLORS,
  DARK_AXIS_STYLE,
  DARK_LEGEND,
  DARK_TOOLTIP,
} from "../constants/chart-theme";

function buildPopularityOptions(
  comparisons: RepositoryComparison[]
): EChartsOption {
  const repoNames = comparisons.map((c) => c.repository.name);

  return {
    tooltip: { ...DARK_TOOLTIP, trigger: "axis", axisPointer: { type: "shadow" } },
    legend: { ...DARK_LEGEND, data: repoNames },
    grid: { left: "3%", right: "4%", bottom: "15%", containLabel: true },
    xAxis: {
      type: "category",
      data: ["Stars", "Forks", "Watchers"],
      ...DARK_AXIS_STYLE,
    },
    yAxis: {
      type: "value",
      ...DARK_AXIS_STYLE,
      axisLabel: {
        color: "#666",
        formatter: (value: number) => {
          if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
          if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
          return value.toString();
        },
      },
    },
    series: comparisons.map((comparison, index) => ({
      name: comparison.repository.name,
      type: "bar" as const,
      data: [
        comparison.repository.stargazers_count,
        comparison.repository.forks_count,
        comparison.repository.watchers_count,
      ],
      itemStyle: { color: CHART_COLORS[index % CHART_COLORS.length] },
    })),
  };
}

type PopularityBarChartProps = {
  comparisons: RepositoryComparison[];
};

export function PopularityBarChart({ comparisons }: PopularityBarChartProps) {
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        Popularity Comparison
      </h3>
      <ReactECharts
        option={buildPopularityOptions(comparisons)}
        style={{ height: 250 }}
      />
    </div>
  );
}
