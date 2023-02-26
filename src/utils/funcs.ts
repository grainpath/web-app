import { LatLng } from "leaflet";
import { Point } from "./types";

/**
 * Constructs human-readable GPS representation.
 */
export function marker2view(point: Point): string {
  const prec = 7;
  return `${point.lat.toFixed(prec)}N, ${point.lon.toFixed(prec)}E`;
}

/**
 * Ensure coordinates within EPSG:3857, see https://epsg.io/3857.
 * @param marker raised dragend event.
 */
export function ensureMarkerBounds(marker: L.Marker<any>): void {
  const lls = marker.getLatLng();
  const lat = Math.min(Math.max(lls.lat, -85.06), +85.06);
  const lng = Math.min(Math.max(lls.lng, -180.0), +180.0);
  marker.setLatLng(new LatLng(lat, lng));
}

/**
 * Swaps elements in an array and return its copy. The input array is not modified.
 */
export function swapImmutable<T>(arr: T[], l: number, r: number): T[] {
  return [ ...arr.slice(0, l), arr[r], ...arr.slice(l + 1, r), arr[l], ...arr.slice(r + 1) ];
}
