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

/**
 * Every shape query should define first and last point.
 */
export type Boundary = {
  source?: Point;
  target?: Point;
};

type PlaceTags = {
  image?: string;
  polygon?: Point[];
  description?: string;
};

type PlaceBase = {
  name: string;
  location: Point;
  keywords: string[];
};

/**
 * Place representation essential for query construction.
 */
export type LightPlace = PlaceBase & {
  id?: string;
};

/**
 * Place representation used for view construction and persistence.
 */
export type HeavyPlace = PlaceBase & {
  id: string;
  tags: PlaceTags;
};

export function heavy2light(grain: HeavyPlace): LightPlace {
  return { id: grain.id, name: grain.name, location: grain.location, keywords: grain.keywords } as LightPlace;
}

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
