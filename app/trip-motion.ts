import type { RouteCoordinate } from "./trip-playback";

export type RouteMotionSample = {
  visibleCoordinates: RouteCoordinate[];
  point: RouteCoordinate;
  bearing: number;
};

const radians = (degrees: number) => degrees * Math.PI / 180;
const degrees = (value: number) => value * 180 / Math.PI;

function segmentDistance([startLng, startLat]: RouteCoordinate, [endLng, endLat]: RouteCoordinate) {
  const averageLatitude = radians((startLat + endLat) / 2);
  const deltaLng = radians(endLng - startLng) * Math.cos(averageLatitude);
  const deltaLat = radians(endLat - startLat);
  return Math.hypot(deltaLng, deltaLat);
}

function bearingBetween([startLng, startLat]: RouteCoordinate, [endLng, endLat]: RouteCoordinate) {
  const averageLatitude = radians((startLat + endLat) / 2);
  const x = (endLng - startLng) * Math.cos(averageLatitude);
  const y = endLat - startLat;
  return (degrees(Math.atan2(x, y)) + 360) % 360;
}

export function sampleRouteAtProgress(
  coordinates: RouteCoordinate[],
  progress: number,
): RouteMotionSample {
  if (coordinates.length < 2) throw new Error("A route needs at least two coordinates");

  const clampedProgress = Math.min(1, Math.max(0, progress));
  const segmentLengths = coordinates.slice(1).map((coordinate, index) => (
    segmentDistance(coordinates[index], coordinate)
  ));
  const totalLength = segmentLengths.reduce((sum, length) => sum + length, 0);

  if (clampedProgress >= 1 || totalLength === 0) {
    const lastIndex = coordinates.length - 1;
    return {
      visibleCoordinates: coordinates.map((coordinate) => [...coordinate]),
      point: [...coordinates[lastIndex]],
      bearing: bearingBetween(coordinates[Math.max(0, lastIndex - 1)], coordinates[lastIndex]),
    };
  }

  const targetLength = totalLength * clampedProgress;
  let traversed = 0;
  let segmentIndex = 0;
  for (; segmentIndex < segmentLengths.length - 1; segmentIndex += 1) {
    if (traversed + segmentLengths[segmentIndex] >= targetLength) break;
    traversed += segmentLengths[segmentIndex];
  }

  const start = coordinates[segmentIndex];
  const end = coordinates[segmentIndex + 1];
  const segmentLength = segmentLengths[segmentIndex];
  const segmentProgress = segmentLength === 0 ? 0 : (targetLength - traversed) / segmentLength;
  const point: RouteCoordinate = [
    start[0] + (end[0] - start[0]) * segmentProgress,
    start[1] + (end[1] - start[1]) * segmentProgress,
  ];

  return {
    visibleCoordinates: [...coordinates.slice(0, segmentIndex + 1).map((coordinate) => [...coordinate] as RouteCoordinate), point],
    point,
    bearing: bearingBetween(start, end),
  };
}
