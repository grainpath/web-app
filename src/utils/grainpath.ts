export const GRAINPATH_BASE_URL = process.env.REACT_APP_API_ADDRESS! + process.env.REACT_APP_API_VERSION!;
export const GRAINPATH_AUTOCOMPLETE_URL = GRAINPATH_BASE_URL + "/autocomplete";
export const GRAINPATH_HEAVY_URL = GRAINPATH_BASE_URL + "/heavy";
export const GRAINPATH_GRAIN_URL = GRAINPATH_BASE_URL + "/grain";
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

type LightGrainTags = {
  name?: string;
};

type HeavyGrainTags = LightGrainTags & {
  image?: string;
  description?: string;
};

type FeaturedGrain = {
  location: Point;
  keywords: string[];
};

/**
 * Grain representation essential for query construction.
 */
export type LightGrain = FeaturedGrain & {
  id?: string;
  tags: LightGrainTags;
};

/**
 * Grain representation used for view construction and persistence.
 */
export type HeavyGrain = FeaturedGrain & {
  id: string;
  polygon?: Point[];
  tags: HeavyGrainTags;
};

/**
 * Standard @b fetch from GrainPath server, only JSON content is available.
 */
export function grainpathFetch(url: string, body: any): Promise<Response> {
  const content = "application/json";

  return fetch(url, {
    method: "POST",
    headers: { "Accept": content, "Content-Type": content },
    body: JSON.stringify(body)
  });
}
