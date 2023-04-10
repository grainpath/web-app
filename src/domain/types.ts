/**
 * Point in [WGS84] CRS.
 */
export type WgsPoint = {
  lon: number;
  lat: number;
};

/**
 * Attributes for stored something (point, place, route, etc.).
 */
type StoredAttributes = {
  name: string;
  note: string;
  updated: Date;
};

/**
 * Every point-like object has these attributes.
 */
type PlaceAttributes = {
  name: string;
  location: WgsPoint;
  keywords: string[];
  selected: string[];
};

/**
 * Standard server-defined place representation.
 */
export type Place = PlaceAttributes & {
  grainId: string;
};

/**
 * Place as per represented in the user interface.
 */
export type UiPlace = PlaceAttributes & {
  placeId?: string;
  grainId?: string;
};

/**
 * Place as per stored in the IStorage.
 */
export type StoredPlace = PlaceAttributes & StoredAttributes & {
  placeId: string;
  grainId?: string;
};

/**
 * Entity external links with owl:sameAs semantics.
 */
type EntityLinked = {
  osm?: string;
  dbpedia?: string;
  geonames?: string;
  mapycz?: string;
  wikidata?: string;
  yago?: string;
};

/**
 * Entity address.
 */
type EntityAddress = {
  country?: string;
  settlement?: string;
  district?: string;
  place?: string;
  house?: string;
  postalCode?: string;
};

/**
 * Entity payment options.
 */
type EntityPayment = {
  cash?: boolean;
  card?: boolean;
  amex?: boolean;
  jcb?: boolean;
  mastercard?: boolean;
  visa?: boolean;
  crypto?: boolean;
};

/**
 * List of possible entity attributes.
 */
type EntityAttributes = {
  polygon?: WgsPoint[];
  image?: string;
  description?: string;
  website?: string;
  address?: EntityAddress;
  payment?: EntityPayment;
  email?: string;
  phone?: string;
  charge?: string[];
  openingHours?: string[];
  fee?: boolean;
  delivery?: boolean;
  drinkingWater?: boolean;
  internetAccess?: boolean;
  shower?: boolean;
  smoking?: boolean;
  takeaway?: boolean;
  toilets?: boolean;
  wheelchair?: boolean;
  rank?: number;
  capacity?: number;
  minimumAge?: number;
  clothes?: string[];
  cuisine?: string[];
  rental?: string[];
};

/**
 * Place representation with links and entity-extended attributes.
 */
export type Entity = Place & {
  linked: EntityLinked;
  attributes: EntityAttributes;
};

/**
 * Bounds for numeric attributes.
 */
type BoundNumeric = {
  min: number;
  max: number;
};

/**
 * Current bounds limiting user input fields.
 */
export type Bounds = {
  rank: BoundNumeric;
  capacity: BoundNumeric;
  minimumAge: BoundNumeric;
  rental: string[];
  clothes: string[];
  cuisine: string[];
};

/**
 * Filter for checking attribute existence.
 */
type KeywordFilterExisten = {};

/**
 * Possible attributes checked for existence.
 */
type KeywordFilterExistens = {
  image?: KeywordFilterExisten;
  description?: KeywordFilterExisten;
  website?: KeywordFilterExisten;
  address?: KeywordFilterExisten;
  payment?: KeywordFilterExisten;
  email?: KeywordFilterExisten;
  phone?: KeywordFilterExisten;
  charge?: KeywordFilterExisten;
  openingHours: KeywordFilterExisten;
};

/**
 * Filter for boolean attributes.
 */
type KeywordFilterBoolean = boolean;

/**
 * Possible boolean attributes.
 */
type KeywordFilterBooleans = {
  fee?: KeywordFilterBoolean;
  delivery?: KeywordFilterBoolean;
  drinkingWater?: KeywordFilterBoolean;
  internetAccess?: KeywordFilterBoolean;
  shower?: KeywordFilterBoolean;
  smoking?: KeywordFilterBoolean;
  takeaway?: KeywordFilterBoolean;
  toilets?: KeywordFilterBoolean;
  wheelchair?: KeywordFilterBoolean;
};

/**
 * Filter for numeric attributes.
 */
type KeywordFilterNumeric = {
  min: number;
  max: number;
};

/**
 * Possible numeric attributes.
 */
type KeywordFilterNumerics = {
  rank?: KeywordFilterNumeric;
  capacity?: KeywordFilterNumeric;
  minimumAge?: KeywordFilterNumeric;
};

/**
 * Filter for textual attributes with "contains" semantics.
 */
type KeywordFilterTextual = string;

/**
 * Possible textual attributes.
 */
type KeywordFilterTextuals = {
  name?: KeywordFilterTextual;
};

/**
 * Filter for collections with "include" and "exclude" semantics.
 */
type KeywordFilterCollect = {
  includes: string[],
  excludes: string[];
};

/**
 * Possible collections in the attributes.
 */
type KeywordFilterCollects = {
  rental?: KeywordFilterCollect;
  clothes?: KeywordFilterCollect;
  cuisine?: KeywordFilterCollect;
};

/**
 * All possible keyword filters.
 */
type KeywordFilters = {
  existens: KeywordFilterExistens;
  booleans: KeywordFilterBooleans;
  numerics: KeywordFilterNumerics;
  textuals: KeywordFilterTextuals;
  collects: KeywordFilterCollects;
};

/**
 * Keyword and keyword-specific attributes.
 */
export type KeywordAutoc = {
  keyword: string;
  attributes: string[];
};

/**
 * Condition enabling a place to be found.
 */
export type PlaceCondition = {
  keyword: string;
  filters: KeywordFilters;
};

/**
 * User-defined condition restricting search.
 */
export type KeywordCondition = PlaceCondition & {
  attributes: string[];
};

/**
 * Simple path with geometry, distance, approximate duration.
 */
type Path = {
  distance: number;
  duration: number;
  polyline: WgsPoint[];
};

/**
 * Any result upon direction request, known or new.
 */
export type DirectionAttributes = StoredAttributes & {
  path: Path;
  sequence: UiPlace[];
};

/**
 * Direction in the user interface, either stored or not.
 */
export type UiDirection = DirectionAttributes & {
  directionId?: string;
};

/**
 * Direction result as per stored in the IStorage.
 */
export type StoredDirection = DirectionAttributes & {
  directionId: string;
};

/**
 * Places request.
 */
export type PlacesRequest = {
  center: UiPlace;
  radius: number;
  conditions: PlaceCondition[];
};

/**
 * Places result as per presented to the user.
 */
export type PlacesResult = PlacesRequest & {
  places: Place[];
};

/**
 * Routes request.
 */
export type RoutesRequest = {
  source: UiPlace;
  target: UiPlace;
  distance: number;
  conditions: PlaceCondition[];
};

type RouteAttributes = RoutesRequest & StoredAttributes & {
  path: Path;
  waypoints: Place[];
};

export type UiRoute = RouteAttributes & {
  routeId?:string
};

export type StoredRoute = RouteAttributes & {
  routeId: string;
};

export type RoutesResult = UiRoute[];
