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
