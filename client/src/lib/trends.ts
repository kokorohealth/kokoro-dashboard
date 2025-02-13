type TrendDirection = "up" | "down" | "neutral";

interface TrendInfo {
  direction: TrendDirection;
  percentage: number;
  label: string;
}

export function calculateTrend(current: number, previous: number): TrendInfo {
  if (!previous) return { direction: "neutral", percentage: 0, label: "No change" };

  const change = ((current - previous) / previous) * 100;
  const direction: TrendDirection = 
    change > 0 ? "up" : 
    change < 0 ? "down" : "neutral";

  return {
    direction,
    percentage: Math.abs(Math.round(change * 10) / 10),
    label: `${direction === "up" ? "▲" : direction === "down" ? "▼" : "◆"} ${Math.abs(Math.round(change * 10) / 10)}%`
  };
}

export function formatTrendValue(value: number, previousValue?: number): string {
  if (!previousValue) return value.toLocaleString();
  
  const trend = calculateTrend(value, previousValue);
  return `${value.toLocaleString()} (${trend.label} vs. previous)`;
}

export function getDateRangeLabel(from: Date, to: Date): string {
  return `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`;
}
