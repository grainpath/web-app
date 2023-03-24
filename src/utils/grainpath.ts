export const GRAINPATH_BASE_URL = process.env.REACT_APP_API_ADDRESS! + process.env.REACT_APP_API_VERSION!;
export const GRAINPATH_AUTOC_URL = GRAINPATH_BASE_URL + "/autoc";
export const GRAINPATH_BOUND_URL = GRAINPATH_BASE_URL + "/bound";
export const GRAINPATH_PLACE_URL = GRAINPATH_BASE_URL + "/place";
export const GRAINPATH_ROUTE_URL = GRAINPATH_BASE_URL + "/route";
export const GRAINPATH_SHORT_URL = GRAINPATH_BASE_URL + "/short";
export const GRAINPATH_STACK_URL = GRAINPATH_BASE_URL + "/stack";

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

  private readonly existens: Set<string>;
  private readonly booleans: Set<string>;
  private readonly numerics: Set<string>;
  private readonly textuals: Set<string>;
  private readonly collects: Set<string>;

  constructor(features: Set<string>) {
    this.existens = new Set(AutocFeatures.union(AutocFeatures.supportedExistens, features));
    this.booleans = new Set(AutocFeatures.union(AutocFeatures.supportedBooleans, features));
    this.numerics = new Set(AutocFeatures.union(AutocFeatures.supportedNumerics, features));
    this.textuals = new Set(AutocFeatures.union(AutocFeatures.supportedTextuals, features));
    this.collects = new Set(AutocFeatures.union(AutocFeatures.supportedCollects, features));
  }

  public getExistens(): string[] { return Array.from(this.existens); }

  public getBooleans(): string[] { return Array.from(this.booleans); }

  public getNumerics(): string[] { return Array.from(this.numerics); }

  public getTextuals(): string[] { return Array.from(this.textuals); }

  public getCollects(): string[] { return Array.from(this.collects); }
}

export type AutocItem = {
  keyword: string;
  features: AutocFeatures;
};

export type KeywordFilterExisten = {};

export type KeywordFilterBoolean = boolean;

export type KeywordFilterNumeric = {
  min: number;
  max: number;
};

export type KeywordFilterCollect = {
  includes: string[],
  excludes: string[];
};

export type KeywordFilterTextual = string;

export type KeywordFilter = {
  keyword: string;
  features: {
    image?: KeywordFilterExisten;
    description?: KeywordFilterExisten;
    website?: KeywordFilterExisten;
    address?: KeywordFilterExisten;
    payment?: KeywordFilterExisten;
    email?: KeywordFilterExisten;
    phone?: KeywordFilterExisten;
    charge?: KeywordFilterExisten;
    opening_hours: KeywordFilterExisten;
    fee?: KeywordFilterBoolean;
    delivery?: KeywordFilterBoolean;
    drinking_water?: KeywordFilterBoolean;
    internet_access?: KeywordFilterBoolean;
    shower?: KeywordFilterBoolean;
    smoking?: KeywordFilterBoolean;
    takeaway?: KeywordFilterBoolean;
    toilets?: KeywordFilterBoolean;
    wheelchair?: KeywordFilterBoolean;
    rank?: KeywordFilterNumeric;
    capacity?: KeywordFilterNumeric;
    minimum_age?: KeywordFilterNumeric;
    name?: KeywordFilterTextual;
    clothes?: KeywordFilterCollect;
    cuisine?: KeywordFilterCollect;
    rental?: KeywordFilterCollect;
  };
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
 * Standard `POST` @b fetch from an application server, only JSON content
 * type is available.
 */
export function grainpathFetch(url: string, body: any): Promise<Response> {
  const content = "application/json";

  return fetch(url, {
    method: "POST",
    headers: { "Accept": content, "Content-Type": content },
    body: JSON.stringify(body)
  });
}
