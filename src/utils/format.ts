const COMPACT_THRESHOLDS = [
  { value: 1_000_000, suffix: "M" },
  { value: 1_000, suffix: "k" },
] as const;

export function formatCompactNumber(num: number): string {
  for (const { value, suffix } of COMPACT_THRESHOLDS) {
    if (num >= value) {
      return `${(num / value).toFixed(1).replace(/\.0$/, "")}${suffix}`;
    }
  }
  return num.toString();
}

const RELATIVE_TIME_UNITS = [
  { max: 60, divisor: 1, unit: "second" },
  { max: 3600, divisor: 60, unit: "minute" },
  { max: 86400, divisor: 3600, unit: "hour" },
  { max: 2592000, divisor: 86400, unit: "day" },
  { max: 31536000, divisor: 2592000, unit: "month" },
  { max: Infinity, divisor: 31536000, unit: "year" },
] as const;

export function formatRelativeDate(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);

  for (const { max, divisor, unit } of RELATIVE_TIME_UNITS) {
    if (seconds < max) {
      const value = Math.floor(seconds / divisor);
      return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
        -value,
        unit as Intl.RelativeTimeFormatUnit,
      );
    }
  }

  return "a long time ago";
}
