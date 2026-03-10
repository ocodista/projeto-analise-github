export const CHART_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
] as const;

export const DARK_AXIS_STYLE = {
  axisLine: { lineStyle: { color: "#333" } },
  axisTick: { lineStyle: { color: "#333" } },
  axisLabel: { color: "#666" },
  splitLine: { lineStyle: { color: "#1a1a1a" } },
} as const;

export const DARK_LEGEND = {
  textStyle: { color: "#999" },
  bottom: 0,
} as const;

export const DARK_TOOLTIP = {
  backgroundColor: "#0a0a0a",
  borderColor: "#222",
  textStyle: { color: "#ededed" },
} as const;
