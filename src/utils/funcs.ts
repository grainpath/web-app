import { Point } from './types';

const degree2view = (loc: number): string => {

  let deg = Math.floor(loc);
  loc = (loc - deg) * 60;
  let min = Math.floor(loc);
  loc = (loc - min) * 60;
  let sec = Math.floor(loc);
  return `${deg}°${min}'${sec}''`;
};

export function marker2view(point: Point): string {
  return `${degree2view(point.lat)}N, ${degree2view(point.lon)}E`;
}

/**
 * The function swaps elements in an array and return its copy. Input array
 * is not modified.
 */
export function swapImmutable<T>(arr: T[], l: number, r: number): T[] {
  return [ ...arr.slice(0, l), arr[r], ...arr.slice(l + 1, r), arr[l], ...arr.slice(r + 1) ];
}

/**
 * The function recognizes valid snake_case_strings consisting of underscores
 * and lower case letters. '_a', 'a_', '', 'a__a' are not valid snake case.
 */
export function validSnakeCase(w: string) {

  let u = '_', pattern = /^[a-z]$/;

  if (!w.length || !w.slice(0).match(pattern) || !w.slice(-1).match(pattern)) return false;

  for (let i = 1; i < w.length; ++i) {

    // two consecutive underscores
    if (w[i - 1] === u && w[i] === u) return false;

    // not an allowed char
    if (w[i] !== u && !w[i].match(pattern)) return false;
  }

  return true;
}
