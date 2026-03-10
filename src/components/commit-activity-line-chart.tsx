import { useState } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import type {
  RepositoryComparison,
  CommitPeriod,
  CommitWeek,
  AggregatedCommitPoint,
} from "../types/github";
import {
  CHART_COLORS,
  DARK_AXIS_STYLE,
  DARK_LEGEND,
  DARK_TOOLTIP,
} from "../constants/chart-theme";

function aggregateByWeek(weeks: CommitWeek[]): AggregatedCommitPoint[] {
  return weeks.map((w) => ({
    label: new Date(w.week * 1000).toLocaleDateString("en", {
      month: "short",
      day: "numeric",
    }),
    total: w.total,
  }));
}

function aggregateByMonth(weeks: CommitWeek[]): AggregatedCommitPoint[] {
  const monthMap = new Map<string, number>();

  for (const week of weeks) {
    const date = new Date(week.week * 1000);
    const key = date.toLocaleDateString("en", {
      year: "numeric",
      month: "short",
    });

    monthMap.set(key, (monthMap.get(key) ?? 0) + week.total);
  }

  return Array.from(monthMap, ([label, total]) => ({ label, total }));
}

const PERIOD_AGGREGATORS = {
  week: aggregateByWeek,
  month: aggregateByMonth,
} as const;

function buildCommitLineOptions(
  comparisons: RepositoryComparison[],
  period: CommitPeriod
): EChartsOption {
  const aggregate = PERIOD_AGGREGATORS[period];

  const aggregatedData = comparisons.map((c) =>
    aggregate(c.commitActivity)
  );

  const labels =
    aggregatedData.find((d) => d.length > 0)?.map((p) => p.label) ?? [];

  return {
    tooltip: { ...DARK_TOOLTIP, trigger: "axis" },
    legend: {
      ...DARK_LEGEND,
      data: comparisons.map((c) => c.repository.name),
    },
    grid: { left: "3%", right: "4%", bottom: "15%", containLabel: true },
    xAxis: {
      type: "category",
      data: labels,
      ...DARK_AXIS_STYLE,
      axisLabel: {
        color: "#666",
        rotate: period === "week" ? 45 : 0,
        interval:
          period === "week" ? Math.floor(labels.length / 12) : 0,
      },
    },
    yAxis: {
      type: "value",
      name: "Commits",
      nameTextStyle: { color: "#666" },
      ...DARK_AXIS_STYLE,
    },
    series: comparisons.map((_, index) => ({
      name: comparisons[index].repository.name,
      type: "line" as const,
      smooth: true,
      symbol: "none",
      data: aggregatedData[index].map((p) => p.total),
      lineStyle: {
        color: CHART_COLORS[index % CHART_COLORS.length],
        width: 2,
      },
      itemStyle: {
        color: CHART_COLORS[index % CHART_COLORS.length],
      },
    })),
  };
}

const PERIOD_LABELS: Record<CommitPeriod, string> = {
  week: "Weekly",
  month: "Monthly",
};

type CommitActivityLineChartProps = {
  comparisons: RepositoryComparison[];
};

export function CommitActivityLineChart({
  comparisons,
}: CommitActivityLineChartProps) {
  const [period, setPeriod] = useState<CommitPeriod>("week");

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-medium text-neutral-200">
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
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
          </svg>
          Commit Activity
        </h3>

        <div className="flex rounded-lg border border-border overflow-hidden">
          {(["week", "month"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                period === p
                  ? "bg-neutral-200 text-background"
                  : "text-neutral-500 hover:text-neutral-300 hover:bg-surface-hover"
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      <ReactECharts
        option={buildCommitLineOptions(comparisons, period)}
        style={{ height: 300 }}
      />
    </div>
  );
}
