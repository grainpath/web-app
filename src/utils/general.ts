import { LatLng } from "leaflet";
import namespace from "@rdfjs/namespace";
import { Point } from "./grainpath";

// user input

export enum TagEnum {
  DEFAULT,
  BOOLEAN,
  COLLECT,
  MEASURE,
  TEXTUAL
};

export enum RelEnum {
  EQ = 0,
  NE,
  LT,
  LE,
  GT,
  GE,
  IN,
  NI,
  SW,
  EW,
  CN
};

export const RelView = new Map<RelEnum, string>([
  [ RelEnum.EQ, "==" ],
  [ RelEnum.NE, "!=" ],
  [ RelEnum.LT, "<"  ],
  [ RelEnum.LE, "<=" ],
  [ RelEnum.GE, ">=" ],
  [ RelEnum.GT, ">"  ],
  [ RelEnum.IN, "+"  ],
  [ RelEnum.NI, "-"  ],
  [ RelEnum.SW, "^"  ],
  [ RelEnum.EW, "$"  ],
  [ RelEnum.CN, "?"  ]
]);

type TagMapping = {
  ty: TagEnum;
  ts: string[];
  rs: RelEnum[];
};

const mapping: TagMapping[] = [
  {
    ts: [ "name" ],
    ty: TagEnum.TEXTUAL,
    rs: [ RelEnum.SW, RelEnum.EW, RelEnum.CN ]
  },
  {
    ty: TagEnum.COLLECT,
    ts: [ "clothes", "cuisine", "rental" ],
    rs: [ RelEnum.IN, RelEnum.NI ]
  },
  {
    ty: TagEnum.MEASURE,
    ts: [ "capacity", "min_age", "rank" ],
    rs: [ RelEnum.EQ, RelEnum.NE, RelEnum.LT, RelEnum.LE, RelEnum.GT, RelEnum.GE ]
  },
  {
    ty: TagEnum.BOOLEAN,
    ts: [ "fee", "delivery", "drinking_water", "internet_access", "shower", "takeaway", "toilets", "wheelchair" ],
    rs: [ RelEnum.EQ, RelEnum.NE ]
  }
];

export const EXISTING_TAGS: string[] = [
  ...mapping.map(({ ts }, _) => ts).flat(),
  "description", "image", "website", "email", "phone", "charge", "opening_hours"
];

function tag2entity<T>(ms: TagMapping[], f: (t: TagMapping) => T): Map<string, T> {
  return ms
    .map((m) => m.ts.map((t) => { return { t: t, es: f(m) }; })).flat()
    .reduce((acc, { t, es }) => { acc.set(t, es); return acc; }, new Map<string, T>());
}

export const TAG_TO_TYPE: Map<string, TagEnum> = tag2entity(mapping, t => t.ty);

export const TAG_TO_RELATION: Map<string, RelEnum[]> = tag2entity(mapping, (t) => t.rs);

// client-side routing

export const SEARCH_ADDR = "/search";
export const LOCKER_ADDR = "/locker";
export const SHAPES_ADDR = "/shapes";
export const POINTS_ADDR = "/points";

// linked open vocabularies

export const ns = {
  dct: namespace("http://purl.org/dc/terms/"),
  geo: namespace("http://www.w3.org/2003/01/geo/wgs84_pos#"),
  ov: namespace("http://open.vocab.org/terms/"),
  rdf: namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#"),
  rdfs: namespace("http://www.w3.org/2000/01/rdf-schema#"),
  skos: namespace("http://www.w3.org/2004/02/skos/core#")
};

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
