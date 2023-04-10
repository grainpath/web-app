import {
  WgsPoint,
  StoredDirection,
  StoredPlace,
  StoredRoute,
  UiPlace,
} from "./types";

export interface IPin {

  /**
   * Calls `drag` on a new position.
   */
  withDrag(drag: (point: WgsPoint) => void): IPin;

  /**
   * Clear shapes and draw new circle.
   * @param map Currently used map.
   * @param radius (in meters!)
   */
  withCirc(map: IMap, radius: number): IPin;
}

export interface IMap {

  /**
   * Delete all existing, user-defined objects from a map.
   */
  clear(): void;

  /**
   * Delete all shapes (circles, polygons, polylines, etc.), markers should
   * be left untouched.
   */
  clearShapes(): void;

  /**
   * Move map center to the place location and open popup. Prior to the flight,
   * place should be created in the map.
   */
  flyTo(place: UiPlace): void;

  /**
   * Pins of this kind are always non-draggable.
   * @param place describe an object stored in the IStorage.
   */
  addStored(place: UiPlace): IPin;

  /**
   * Places from the server unknown to the user have potential
   * to become stored.
   */
  addTagged(place: UiPlace): IPin;

  /**
   * Custom pins in @b Navigate tab are all draggable. But the very same pins
   * are non-draggable in the result, because attached to a constructed path.
   * @param place describe an object.
   * @param draggable draggability of a pin.
   */
  addCustom(place: UiPlace, draggable: boolean): IPin;

  /**
   * Anything that has a location.
   */
  addSource(place: UiPlace, draggable: boolean): IPin;

  /**
   * Anything that has a location.
   */
  addTarget(place: UiPlace, draggable: boolean): IPin;

  /**
   * @param center User-defined center of a circle.
   * @param radius Radius of a circle (in meters!).
   */
  drawCircle(center: WgsPoint, radius: number): void;

  /**
   * @param polygon Closed sequence of points with at least 4 items (first and last must be the same).
   */
  drawPolygon(polygon: WgsPoint[]): void;

  /**
   * @param polyline Sequence of points with at least 2 items.
   */
  drawPolyline(polyline: WgsPoint[]): void;

  /**
   * @param handle callback should be called with user-clicked position.
   */
  captureLocation(handle: (point: WgsPoint) => void): void;
}

/**
 * Wraps CRUD operations over an arbitrary object storage.
 */
export interface IStorage {

  // [C]reate

  createPlace(place: StoredPlace): void;

  createRoute(route: StoredRoute): void;

  createDirection(direction: StoredDirection): void;

  // [R]ead

  /**
   * Get place by locally defined Id.
   */
  tryGetPlace(placeId: string): StoredPlace | undefined;

  /**
   * Get place by remote Id.
   */
  tryGetGrain(grainId: string): StoredPlace | undefined;

  /**
   * Get route by locally defined Id.
   */
  tryGetRoute(routeId: string): StoredRoute | undefined;

  /**
   * Get direction by locally defined Id.
   */
  tryGetDirection(directionId: string): StoredDirection | undefined;

  // [U]pdate

  update(place: StoredPlace): void;

  update(route: StoredRoute): void;

  update(direction: StoredDirection): void;

  // [D]elete

  deletePlace(placeId: string): void;

  deleteRoute(routeId: string): void;

  deleteDirection(directionId: string): void;
}
