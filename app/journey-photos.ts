import type { Day, PhotoSource, Place } from "./trip-data.ts";

export type JourneyPhotoItem = {
  id: string;
  dayId: number;
  kind: "hotel" | "place";
  place: Place;
  photo: PhotoSource;
};

export function buildJourneyPhotoItems(days: Day[], places: Place[]): JourneyPhotoItem[] {
  const placeById = new Map(places.map((place) => [place.id, place]));
  const usedPhotos = new Set<string>();
  const items: JourneyPhotoItem[] = [];

  for (const day of days) {
    for (const placeId of day.placeIds) {
      const place = placeById.get(placeId);
      if (!place?.image || place.category === "transport" || usedPhotos.has(place.image.src)) continue;
      usedPhotos.add(place.image.src);
      items.push({
        id: `day-${day.id}-${place.id}`,
        dayId: day.id,
        kind: place.category === "stay" ? "hotel" : "place",
        place,
        photo: place.image,
      });
    }
  }

  return items;
}
