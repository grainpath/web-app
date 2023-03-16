export const GRAINPATH_BASE_URL = process.env.REACT_APP_API_ADDRESS! + process.env.REACT_APP_API_VERSION!;
export const GRAINPATH_AUTOCOMPLETE_URL = GRAINPATH_BASE_URL + "/autocomplete";
export const GRAINPATH_PLACE_URL = GRAINPATH_BASE_URL + "/place";
export const GRAINPATH_STACK_URL = GRAINPATH_BASE_URL + "/stack";
export const GRAINPATH_ROUTE_URL = GRAINPATH_BASE_URL + "/route";
export const GRAINPATH_SHORT_URL = GRAINPATH_BASE_URL + "/short";

/**
 * Point in [WSG84] CRS.
 */
export type Point = {
  lon: number;
  lat: number;
};

type PlaceBase = {
  name: string;
  location: Point;
  keywords: string[];
};

/**
 * Place representation essential for query construction.
 */
export type MaybePlace = PlaceBase & {
  id?: string;
}

/**
 * Place representation as an query response (both places, and routes).
 */
export type LightPlace = PlaceBase & {
  id: string;
};

type PlaceAddress = {
  country?: string;
  settlement?: string;
  district?: string;
  place?: string;
  house?: string;
  postal_code?: string;
};

type PlacePayment = {
  cash?: boolean;
  card?: boolean;
  amex?: boolean;
  jcb?: boolean;
  mastercard?: boolean;
  visa?: boolean;
  crypto?: boolean;
};

type PlaceTags = {
  polygon?: Point[];
  image?: string;
  description?: string;
  website?: string;
  address?: PlaceAddress;
  payment?: PlacePayment;
  email?: string;
  phone?: string;
  delivery?: boolean;
  drinking_water?: boolean;
  internet_access?: boolean;
  shower?: boolean;
  smoking?: boolean;
  takeaway?: boolean;
  toilets?: boolean;
  wheelchair?: boolean;
  capacity?: number;
  min_age?: number;
  rank?: number;
  fee?: boolean;
  charge?: string[];
  opening_hours?: string[];
  clothes?: string[];
  cuisine?: string[];
  rental?: string[];
};

type PlaceLinked = {
  osm?: string;
  wikidata?: string;
  geonames?: string;
  dbpedia?: string;
  yago?: string;
};

/**
 * Detailed place representation.
 */
export type HeavyPlace = LightPlace & {
  tags: PlaceTags;
  linked: PlaceLinked;
};

export function heavy2light(grain: HeavyPlace): LightPlace {
  return { id: grain.id, name: grain.name, location: grain.location, keywords: grain.keywords } as LightPlace;
}

export type Boundary = {
  source?: Point;
  target?: Point;
};

type ConstraintBase = {
  tag: string;
  relation?: string;
};

type BooleanConstraint = ConstraintBase & {
  value?: boolean;
};

type CollectConstraint = ConstraintBase & {
  value?: string;
};

type MeasureConstraint = ConstraintBase & {
  value?: number;
};

type TextualConstraint = ConstraintBase & {
  value?: string;
};

export type KeywordConstraint
  = BooleanConstraint
  | CollectConstraint
  | MeasureConstraint
  | TextualConstraint;

export type KeywordFilter = {
  keyword: string;
  constrs: KeywordConstraint[];
};

/**
 * 
 */
export type Result = {
  name?: string;
  distance?: number;
  duration?: number;
  places?: LightPlace[];
  waypoints?: Point[];
  polyline?: Point[];
  constraints?: KeywordConstraint[];
};

/**
 * Standard @b fetch from an application server, only JSON content type is available.
 */
export function grainpathFetch(url: string, body: any): Promise<Response> {
  const content = "application/json";

  return fetch(url, {
    method: "POST",
    headers: { "Accept": content, "Content-Type": content },
    body: JSON.stringify(body)
  });
}
