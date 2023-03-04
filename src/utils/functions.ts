import { LatLng } from "leaflet";
import { Point } from "../domain/types";

/**
 * Constructs human-readable GPS representation.
 */
export function point2view(point: Point): string {
  const prec = 6;
  return `${point.lat.toFixed(prec)}N, ${point.lon.toFixed(prec)}E`;
}

const ensureLonBounds = (lon: number): number => Math.min(Math.max(lon, -180.0), +180.0);
const ensureLatBounds = (lat: number): number => Math.min(Math.max(lat, -85.06), +85.06);

/**
 * Ensure LatLng within EPSG:3857, see https://epsg.io/3857.
 */
export function ensureLatLngBounds(latLng: L.LatLng): L.LatLng {
  return new LatLng(ensureLatBounds(latLng.lat), ensureLonBounds(latLng.lng));
}

/**
 * Ensure marker within EPSG:3857, see https://epsg.io/3857.
 * @param marker raised dragend event.
 */
export function ensureMarkerBounds(marker: L.Marker<any>): L.Marker<any> {
  const lls = marker.getLatLng();
  return marker.setLatLng(ensureLatLngBounds(lls));
};

/**
 * Transform Leaflet point to a standard.
 */
export function latLng2point(l: LatLng): Point {
  return { lon: l.lng, lat: l.lat } as Point;
}

/**
 * Swaps elements in an array and return its copy. The input array is not modified.
 */
export function swapImmutable<T>(arr: T[], l: number, r: number): T[] {
  return [ ...arr.slice(0, l), arr[r], ...arr.slice(l + 1, r), arr[l], ...arr.slice(r + 1) ];
};
