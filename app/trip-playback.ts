import type { Day, Place } from "./trip-data";

export type PlaybackKind = "transport" | "explore" | "meal" | "rest";
export type PlaybackMode = "flight" | "drive";
export type RouteCoordinate = [number, number];

export type PlaybackRouteFeature = {
  type: "Feature";
  properties: {
    dayId: number;
    legId: string;
    mode: PlaybackMode;
    label: string;
  };
  geometry: { type: "LineString"; coordinates: number[][] };
};

export type PlaybackStop = {
  dayId: number;
  order: number;
  place: Place;
  kind: PlaybackKind;
  holdMs: number;
  routeIndex: number;
};

export type PlaybackSegment = {
  dayId: number;
  order: number;
  mode: PlaybackMode;
  from: PlaybackStop;
  to: PlaybackStop;
  coordinates: RouteCoordinate[];
  durationMs: number;
};

export type PlaybackDay = {
  dayId: number;
  title: string;
  dateLabel: string;
  stops: PlaybackStop[];
  segments: PlaybackSegment[];
};

export type PlaybackStage =
  | {
      type: "stop";
      dayIndex: number;
      stopIndex: number;
      stopNumber: number;
      stop: PlaybackStop;
      durationMs: number;
    }
  | {
      type: "travel";
      dayIndex: number;
      segmentIndex: number;
      segment: PlaybackSegment;
      durationMs: number;
    };

type ModeRange = { mode: PlaybackMode; start: number; end: number };

const holdByKind: Record<PlaybackKind, number> = {
  transport: 1000,
  explore: 1350,
  meal: 1500,
  rest: 1250,
};

export function playbackKindForPlace(place: Pick<Place, "category">): PlaybackKind {
  if (place.category === "transport") return "transport";
  if (place.category === "food") return "meal";
  if (place.category === "stay") return "rest";
  return "explore";
}

function sameCoordinate(a: RouteCoordinate, b: RouteCoordinate) {
  return a[0] === b[0] && a[1] === b[1];
}

function joinDayFeatures(features: PlaybackRouteFeature[]) {
  const coordinates: RouteCoordinate[] = [];
  const ranges: ModeRange[] = [];

  features.forEach((feature) => {
    const next = feature.geometry.coordinates.map(([lng, lat]) => [lng, lat] as RouteCoordinate);
    if (next.length === 0) return;
    const sharesBoundary = coordinates.length > 0 && sameCoordinate(coordinates.at(-1)!, next[0]);
    const start = coordinates.length === 0 ? 0 : coordinates.length - 1;
    coordinates.push(...(sharesBoundary ? next.slice(1) : next));
    ranges.push({ mode: feature.properties.mode, start, end: coordinates.length - 1 });
  });

  return { coordinates, ranges };
}

function squaredDistance(point: RouteCoordinate, place: Place) {
  const lngDelta = point[0] - place.coordinates.lng;
  const latDelta = point[1] - place.coordinates.lat;
  return lngDelta * lngDelta + latDelta * latDelta;
}

function nearestForwardIndex(coordinates: RouteCoordinate[], place: Place, start: number) {
  let bestIndex = Math.min(start, coordinates.length - 1);
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let index = bestIndex; index < coordinates.length; index += 1) {
    const distance = squaredDistance(coordinates[index], place);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  }
  return bestIndex;
}

function downsample(coordinates: RouteCoordinate[], limit = 140) {
  if (coordinates.length <= limit) return coordinates;
  return Array.from({ length: limit }, (_, index) => {
    const sourceIndex = Math.round((index * (coordinates.length - 1)) / (limit - 1));
    return coordinates[sourceIndex];
  });
}

function haversineKm(a: RouteCoordinate, b: RouteCoordinate) {
  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  const lat1 = toRadians(a[1]);
  const lat2 = toRadians(b[1]);
  const deltaLat = lat2 - lat1;
  const deltaLng = toRadians(b[0] - a[0]);
  const value = Math.sin(deltaLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function routeDistanceKm(coordinates: RouteCoordinate[]) {
  let total = 0;
  for (let index = 1; index < coordinates.length; index += 1) {
    total += haversineKm(coordinates[index - 1], coordinates[index]);
  }
  return total;
}

function modeForSegment(ranges: ModeRange[], fromIndex: number, toIndex: number) {
  const probe = Math.min(toIndex, fromIndex + 1);
  return ranges.find((range) => probe >= range.start && probe <= range.end)?.mode
    ?? ranges.find((range) => fromIndex >= range.start && fromIndex <= range.end)?.mode
    ?? "drive";
}

function durationForSegment(mode: PlaybackMode, coordinates: RouteCoordinate[]) {
  if (mode === "flight") return 2800;
  return Math.round(Math.min(2800, Math.max(1200, 1120 + routeDistanceKm(coordinates) * 15)));
}

export function createPlaybackPlan(
  sourceDays: Day[],
  sourcePlaces: Place[],
  routeFeatures: PlaybackRouteFeature[],
): PlaybackDay[] {
  const placeById = new Map(sourcePlaces.map((place) => [place.id, place]));

  return sourceDays.map((day) => {
    const dayFeatures = routeFeatures.filter((feature) => feature.properties.dayId === day.id);
    const { coordinates, ranges } = joinDayFeatures(dayFeatures);
    if (coordinates.length < 2) throw new Error(`Day ${day.id} needs a connected route`);

    let cursor = 0;
    const stops = day.placeIds.map((placeId, order) => {
      const place = placeById.get(placeId);
      if (!place) throw new Error(`Unknown playback place: ${placeId}`);
      const routeIndex = nearestForwardIndex(coordinates, place, cursor);
      cursor = routeIndex;
      const kind = playbackKindForPlace(place);
      return { dayId: day.id, order, place, kind, holdMs: holdByKind[kind], routeIndex };
    });

    const segments = stops.slice(0, -1).map((from, order) => {
      const to = stops[order + 1];
      const rawCoordinates = coordinates.slice(from.routeIndex, to.routeIndex + 1);
      const routeCoordinates = downsample(rawCoordinates.length >= 2
        ? rawCoordinates
        : [coordinates[from.routeIndex], coordinates[to.routeIndex]]);
      const mode = modeForSegment(ranges, from.routeIndex, to.routeIndex);
      return {
        dayId: day.id,
        order,
        mode,
        from,
        to,
        coordinates: routeCoordinates,
        durationMs: durationForSegment(mode, routeCoordinates),
      };
    });

    return { dayId: day.id, title: day.title, dateLabel: day.dateLabel, stops, segments };
  });
}

export function createPlaybackStages(plan: PlaybackDay[]): PlaybackStage[] {
  const stages: PlaybackStage[] = [];
  let stopNumber = 0;

  plan.forEach((day, dayIndex) => {
    day.stops.forEach((stop, stopIndex) => {
      if (stopIndex > 0) {
        const segment = day.segments[stopIndex - 1];
        stages.push({
          type: "travel",
          dayIndex,
          segmentIndex: stopIndex - 1,
          segment,
          durationMs: segment.durationMs,
        });
      }
      stopNumber += 1;
      stages.push({
        type: "stop",
        dayIndex,
        stopIndex,
        stopNumber,
        stop,
        durationMs: stop.holdMs,
      });
    });
  });

  return stages;
}
