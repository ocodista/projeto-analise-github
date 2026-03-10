import { describe, it, expect, vi, afterEach } from "vitest";
import { formatCompactNumber, formatRelativeDate } from "../format";

describe("formatCompactNumber", () => {
  it("formats millions", () => {
    expect(formatCompactNumber(1_500_000)).toBe("1.5M");
    expect(formatCompactNumber(1_000_000)).toBe("1M");
    expect(formatCompactNumber(10_300_000)).toBe("10.3M");
  });

  it("formats thousands", () => {
    expect(formatCompactNumber(1_000)).toBe("1k");
    expect(formatCompactNumber(2_500)).toBe("2.5k");
    expect(formatCompactNumber(999_999)).toBe("1000k");
  });

  it("returns raw number below 1000", () => {
    expect(formatCompactNumber(0)).toBe("0");
    expect(formatCompactNumber(42)).toBe("42");
    expect(formatCompactNumber(999)).toBe("999");
  });

  it("drops trailing .0", () => {
    expect(formatCompactNumber(5_000)).toBe("5k");
    expect(formatCompactNumber(2_000_000)).toBe("2M");
  });
});

describe("formatRelativeDate", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("formats seconds ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-01T12:00:30Z"));
    expect(formatRelativeDate("2025-06-01T12:00:00Z")).toBe("30 seconds ago");
  });

  it("formats minutes ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-01T12:05:00Z"));
    expect(formatRelativeDate("2025-06-01T12:00:00Z")).toBe("5 minutes ago");
  });

  it("formats hours ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-01T15:00:00Z"));
    expect(formatRelativeDate("2025-06-01T12:00:00Z")).toBe("3 hours ago");
  });

  it("formats days ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-04T12:00:00Z"));
    expect(formatRelativeDate("2025-06-01T12:00:00Z")).toBe("3 days ago");
  });

  it("formats yesterday", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-02T12:00:00Z"));
    expect(formatRelativeDate("2025-06-01T12:00:00Z")).toBe("yesterday");
  });
});
