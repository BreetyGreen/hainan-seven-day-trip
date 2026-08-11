import type { Place } from "./trip-data";
import type { PlaybackSegment, RouteCoordinate } from "./trip-playback";

export type CameraIntent = {
  kind: "overview" | "intercity" | "suburban" | "local" | "arrival";
  zoom: number;
  duration: number;
};

export type TravelStageProgress = {
  phase: "camera" | "moving" | "complete";
  routeProgress: number;
  totalProgress: number;
};

const clampProgress = (value: number) => Math.max(0, Math.min(1, value));

export function travelStageProgress(
  elapsedMs: number,
  movementDurationMs: number,
  camera: Pick<CameraIntent, "duration">,
  reducedMotion = false,
): TravelStageProgress {
  const cameraLeadMs = reducedMotion ? 0 : Math.round(camera.duration * 1000) + 160;
  const safeMovementMs = Math.max(1, movementDurationMs);
  const routeProgress = clampProgress((elapsedMs - cameraLeadMs) / safeMovementMs);
  const totalProgress = clampProgress(elapsedMs / (cameraLeadMs + safeMovementMs));
  const phase = elapsedMs < cameraLeadMs ? "camera"
    : routeProgress >= 1 ? "complete"
      : "moving";
  return { phase, routeProgress, totalProgress };
}

function haversineKm(a: RouteCoordinate, b: RouteCoordinate) {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const lat1 = radians(a[1]);
  const lat2 = radians(b[1]);
  const deltaLat = lat2 - lat1;
  const deltaLng = radians(b[0] - a[0]);
  const value = Math.sin(deltaLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function endpointDistance(segment: Pick<PlaybackSegment, "coordinates">) {
  const first = segment.coordinates[0];
  const last = segment.coordinates.at(-1);
  return first && last ? haversineKm(first, last) : 0;
}

export function cameraForTravel(
  segment: Pick<PlaybackSegment, "mode" | "from" | "to" | "coordinates">,
): CameraIntent {
  if (segment.mode === "flight") {
    return { kind: "overview", zoom: 6, duration: 0.9 };
  }
  if (segment.from.place.city === segment.to.place.city) {
    return { kind: "local", zoom: 13, duration: 0.72 };
  }
  if (endpointDistance(segment) <= 35) {
    return { kind: "suburban", zoom: 11, duration: 0.76 };
  }
  return { kind: "intercity", zoom: 9, duration: 0.82 };
}

export function cameraForArrival(
  place: Pick<Place, "id" | "category">,
): CameraIntent {
  if (place.category === "transport") {
    return { kind: "arrival", zoom: 9, duration: 0.68 };
  }
  if (place.category === "stay") {
    return { kind: "arrival", zoom: 13, duration: 0.72 };
  }
  return { kind: "arrival", zoom: 15, duration: 0.76 };
}
