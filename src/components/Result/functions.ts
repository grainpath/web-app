import { Place, StoredPlace } from "../../domain/types";

export function getCopyKnownGrains(places: StoredPlace[]): Map<string, StoredPlace> {
  return places
    .filter((place) => !!place.grainId)
    .map((place) => structuredClone(place))
    .reduce((map, place) => map.set(place.grainId, place), new Map<string, StoredPlace>());
}

export function getSatConditions(places: Place[]): Set<string> {
  return places.reduce((set, place) => {
    place.selected.forEach((keyword) => { set.add(keyword) });
    return set;
  }, new Set<string>());
}
