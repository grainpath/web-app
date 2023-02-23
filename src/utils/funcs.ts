import { Point } from './types';

const degree2view = (loc: number): string => {

  const deg = Math.floor(loc);
  loc = (loc - deg) * 60;
  const min = Math.floor(loc);
  const sec = (loc - min) * 60;
  return `${deg}°${min}'${sec.toFixed(3)}''`;
};

/**
 * Constructs human-readable GPS representation.
 */
export function marker2view(point: Point): string {
  return `${degree2view(point.lat)}N, ${degree2view(point.lon)}E`;
}

/**
 * Swaps elements in an array and return its copy. The input array is not modified.
 */
export function swapImmutable<T>(arr: T[], l: number, r: number): T[] {
  return [ ...arr.slice(0, l), arr[r], ...arr.slice(l + 1, r), arr[l], ...arr.slice(r + 1) ];
}
