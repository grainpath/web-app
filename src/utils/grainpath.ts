import {
  Bounds,
  Entity,
  KeywordAutoc,
  PlacesRequest,
  PlacesResult,
  RoutesRequest,
  UiDirection,
  UiPlace,
  UiRoute
} from "../domain/types";

const GRAINPATH_BASIS_URL = process.env.REACT_APP_API_ADDRESS! + process.env.REACT_APP_API_VERSION!;

const GRAINPATH_AUTOCS_URL = GRAINPATH_BASIS_URL + "/autocs";
const GRAINPATH_BOUNDS_URL = GRAINPATH_BASIS_URL + "/bounds";
const GRAINPATH_DIRECT_URL = GRAINPATH_BASIS_URL + "/direct";
const GRAINPATH_ENTITY_URL = GRAINPATH_BASIS_URL + "/entity";
const GRAINPATH_ROUTES_URL = GRAINPATH_BASIS_URL + "/routes";
const GRAINPATH_PLACES_URL = GRAINPATH_BASIS_URL + "/places";

/**
 * GrainPath-specific API calls.
 */
export class GrainPathFetcher {

  private static acceptResponse(res: Response): Response {
    if (!res.ok) {
      throw new Error(`[Fetch error] ${res.status}: ${res.statusText}`);
    }
    return res;
  }

  /**
   * Standard `POST` @b fetch from an application server, only JSON content
   * type is available.
   */
  private static async fetch(url: string, body: any): Promise<any> {
    const content = "application/json";

    const res = await fetch(url, {
      method: "POST",
      headers: { "Accept": content, "Content-Type": content },
      body: JSON.stringify(body)
    });
    return this.acceptResponse(res).json();
  }

  /**
   * Fetch autocomplete items based on provided prefix.
   */
  public static async fetchAutocs(prefix: string): Promise<KeywordAutoc[] | undefined> {
    try {
      const jsn = await GrainPathFetcher
        .fetch(GRAINPATH_AUTOCS_URL, { count: 3, prefix: prefix });
      return jsn.items;
    }
    catch (ex) { alert(ex); return undefined; }
  }

  /**
   * Fetch current bounds for selected attributes.
   */
  public static async fetchBounds(): Promise<Bounds | undefined> {
    try {
      return await GrainPathFetcher
        .fetch(GRAINPATH_BOUNDS_URL, {});
    }
    catch (ex) { alert(ex); return undefined; }
  }

  /**
   * Fetch walking path visiting a sequence of locations.
   */
  public static async fetchDirect(sequence: UiPlace[]): Promise<UiDirection | undefined> {
    const waypoints = sequence.map((l) => l.location);
    try {
      const jsn = await GrainPathFetcher
        .fetch(GRAINPATH_DIRECT_URL, { waypoints: waypoints });
      return { sequence: sequence, path: jsn };
    }
    catch (ex) { alert(ex); return undefined; }
  }

  /**
   * Fetch entity (place with extended information) by id.
   */
  public static async fetchEntity(placeId: string): Promise<Entity | undefined> {
    try {
      return await GrainPathFetcher
        .fetch(GRAINPATH_ENTITY_URL, { placeId: placeId });
    }
    catch (ex) { alert(ex); return undefined; }
  }

  /**
   * Fetch places satisfying user-defined conditions.
   */
  public static async fetchPlaces(request: PlacesRequest): Promise<PlacesResult | undefined> {
    try {
      const jsn = await GrainPathFetcher
        .fetch(GRAINPATH_PLACES_URL, request);
      return { ...request, ...jsn };
    }
    catch (ex) { alert(ex); return undefined; }
  }

  /**
   * Fetch routes visiting places that satisfy user-defined conditions.
   */
  public static async fetchRoutes(request: RoutesRequest): Promise<UiRoute[] | undefined> {
    try {
      const jsn = await GrainPathFetcher
        .fetch(GRAINPATH_ROUTES_URL, request);
      return jsn.routes.map((route: any) => { return { ...request, ...route }; });
    }
    catch (ex) { alert(ex); return undefined; }
  }
}
