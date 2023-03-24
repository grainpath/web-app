const GRAINPATH_BASIS_URL = process.env.REACT_APP_API_ADDRESS! + process.env.REACT_APP_API_VERSION!;
export const GRAINPATH_AUTOC_URL = GRAINPATH_BASIS_URL + "/autoc";
const GRAINPATH_BOUND_URL = GRAINPATH_BASIS_URL + "/bound";
export const GRAINPATH_PLACE_URL = GRAINPATH_BASIS_URL + "/place";
const GRAINPATH_ROUTE_URL = GRAINPATH_BASIS_URL + "/route";
const GRAINPATH_SHORT_URL = GRAINPATH_BASIS_URL + "/short";
const GRAINPATH_STACK_URL = GRAINPATH_BASIS_URL + "/stack";

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

type PlaceFeatures = {
  polygon?: Point[];
  name?: string;
  image?: string;
  description?: string;
  website?: string;
  address?: PlaceAddress;
  payment?: PlacePayment;
  email?: string;
  phone?: string;
  charge?: string[];
  opening_hours?: string[];
  fee?: boolean;
  delivery?: boolean;
  drinking_water?: boolean;
  internet_access?: boolean;
  shower?: boolean;
  smoking?: boolean;
  takeaway?: boolean;
  toilets?: boolean;
  wheelchair?: boolean;
  rank?: number;
  capacity?: number;
  minimum_age?: number;
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
  linked: PlaceLinked;
  features: PlaceFeatures;
};

export function heavy2light(grain: HeavyPlace): LightPlace {
  return { id: grain.id, name: grain.name, location: grain.location, keywords: grain.keywords };
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type AutocItem = {
  keyword: string;
  features: string[];
};

export class AutocFeatures {

  private static supportedExistens = new Set([
    "image",
    "description",
    "website",
    "address",
    "payment",
    "email",
    "phone",
    "charge",
    "opening_hours"
  ]);

  private static supportedBooleans = new Set([
    "fee",
    "delivery",
    "drinking_water",
    "internet_access",
    "shower",
    "smoking",
    "takeaway",
    "toilets",
    "wheelchair"
  ]);

  private static supportedNumerics = new Set([
    "rank",
    "capacity",
    "minimum_age"
  ]);

  private static supportedTextuals = new Set([
    "name"
  ]);

  private static supportedCollects = new Set([
    "clothes",
    "cuisine",
    "rental"
  ]);

  private static set2list(s: Set<string>): string[] { return [ ...Array.from(s) ]; }

  private static union(s1: Set<string>, s2: Set<string>): Set<string> {
    return this
      .set2list(s1)
      .reduce((s, item) => { if (s2.has(item)) { s.add(item) } return s; }, new Set<string>());
  }

  public static group(features: string[]) {
    return {
      es: Array.from(AutocFeatures.union(AutocFeatures.supportedExistens, new Set(features))),
      bs: Array.from(AutocFeatures.union(AutocFeatures.supportedBooleans, new Set(features))),
      ns: Array.from(AutocFeatures.union(AutocFeatures.supportedNumerics, new Set(features))),
      ts: Array.from(AutocFeatures.union(AutocFeatures.supportedTextuals, new Set(features))),
      cs: Array.from(AutocFeatures.union(AutocFeatures.supportedCollects, new Set(features))),
    };
  }
}

export type KeywordExistenFilter = {};

export type KeywordBooleanFilter = boolean;

export type KeywordNumericFilter = {
  min: number;
  max: number;
};

export type KeywordTextualFilter = string;

export type KeywordCollectFilter = {
  includes: string[],
  excludes: string[];
};

export type KeywordFilters = {
  image?: KeywordExistenFilter;
  description?: KeywordExistenFilter;
  website?: KeywordExistenFilter;
  address?: KeywordExistenFilter;
  payment?: KeywordExistenFilter;
  email?: KeywordExistenFilter;
  phone?: KeywordExistenFilter;
  charge?: KeywordExistenFilter;
  opening_hours: KeywordExistenFilter;
  fee?: KeywordBooleanFilter;
  delivery?: KeywordBooleanFilter;
  drinking_water?: KeywordBooleanFilter;
  internet_access?: KeywordBooleanFilter;
  shower?: KeywordBooleanFilter;
  smoking?: KeywordBooleanFilter;
  takeaway?: KeywordBooleanFilter;
  toilets?: KeywordBooleanFilter;
  wheelchair?: KeywordBooleanFilter;
  rank?: KeywordNumericFilter;
  capacity?: KeywordNumericFilter;
  minimum_age?: KeywordNumericFilter;
  name?: KeywordTextualFilter;
  clothes?: KeywordCollectFilter;
  cuisine?: KeywordCollectFilter;
  rental?: KeywordCollectFilter;
}

export type KeywordCondition = AutocItem & {
  filters: KeywordFilters;
};

export type BoundItemNumeric = {
  min: number;
  max: number;
};

export type BoundItem = {
  clothes: string[];
  cuisine: string[];
  rental: string[];
  rank: BoundItemNumeric;
  capacity: BoundItemNumeric;
  minimum_age: BoundItemNumeric;
};

/**
 * TO BE REMOVED!
 */
export function grainpathFetch(url: string, body: any): Promise<Response> {
  const content = "application/json";

  return fetch(url, {
    method: "POST",
    headers: { "Accept": content, "Content-Type": content },
    body: JSON.stringify(body)
  });
}

/**
 * GrainPath-specific API calls.
 */
export class GrainPathFetcher {

  /**
   * Standard `POST` @b fetch from an application server, only JSON content
   * type is available.
   */
  private static fetchBasis(url: string, body: any): Promise<Response> {
    const content = "application/json";

    return fetch(url, {
      method: "POST",
      headers: { "Accept": content, "Content-Type": content },
      body: JSON.stringify(body)
    });
  }

  private static acceptResponse(res: Response): Response {
    if (!res.ok) {
      throw new Error(`[Fetch error] ${res.status}: ${res.statusText}`);
    }
    return res;
  }

  /**
   * Fetches autocomplete items based on provided prefix.
   */
  public static async fetchAutoc(prefix: string): Promise<AutocItem[] | undefined> {
    try {
      const res = await GrainPathFetcher
        .fetchBasis(GRAINPATH_AUTOC_URL, { count: 3, prefix: prefix });
      return await this.acceptResponse(res).json();
    }
    catch (ex) { alert(ex); return undefined; }
  }

  public static fetchBound(): Promise<BoundItem | undefined> {
    return GrainPathFetcher
      .fetchBasis(GRAINPATH_BOUND_URL, {})
      .then((res) => {
        return this.acceptResponse(res).json();
      })
      .catch((ex) => { alert(ex); return undefined; });
  }

  public static fetchPlace(): Promise<void> {
    return new Promise((res, rej) => res());
  }

  public static fetchRoute(): Promise<void> {
    return new Promise((res, rej) => res());
  }

  public static fetchShort(): Promise<void> {
    return new Promise((res, rej) => res());
  }

  public static fetchStack(): Promise<void> {
    return new Promise((res, rej) => res());
  }
}
