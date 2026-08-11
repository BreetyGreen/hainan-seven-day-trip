import { days, type RouteLeg, type TravelLegMode } from "./trip-data.ts";

export function getDayLegs(dayId: number): RouteLeg[] {
  return days.find((day) => day.id === dayId)?.legs ?? [];
}

export function getLegAfter(dayId: number, placeIndex: number): RouteLeg | undefined {
  return getDayLegs(dayId).find((leg) => leg.fromIndex === placeIndex);
}

export function modeLabel(mode: TravelLegMode): string {
  if (mode === "flight") return "✈ 航班";
  if (mode === "drive") return "🚙 自驾";
  if (mode === "boat") return "乘船";
  if (mode === "walk") return "步行";
  return "可选";
}
