import { LightPlace, MaybePlace, Point } from "./grainpath";

export interface IPin {

  /**
   * Calls `drag` on a new position.
   */
  withDrag(drag: (point: Point) => void): void;

  /**
   * Ensures popup with /places link to some id.
   */
  withLink(link: (id: string) => void, id: string): void;
}

export interface IMap {

  /**
   * Delete all existing, user-defined objects from a map.
   */
  clear(): void;

  /**
   * Move map center to the place location and open popup. Prior to the flight,
   * place should be created in the map.
   */
  flyTo(place: MaybePlace): void;

  /**
   * Pins of this kind are always non-draggable.
   * @param place describe an object stored in the IStorage.
   */
  addStored(place: LightPlace): IPin;

  /**
   * Places from the server unknown to the user have potential
   * to become stored.
   */
  addTagged(place: LightPlace): IPin;

  /**
   * Custom pins in @b Navigate tab are all draggable. But the very same pins
   * are non-draggable in the result, because attached to a constructed path.
   * @param place describe an object.
   * @param draggable draggability of a pin.
   */
  addCustom(place: MaybePlace, draggable: boolean): IPin;

  /**
   * A stored place or a custom location.
   */
  addSource(place: MaybePlace, draggable: boolean): IPin;

  /**
   * A stored place or a custom location.
   */
  addTarget(place: MaybePlace, draggable: boolean): IPin;

  /**
   * @param center User-defined center of a circle.
   * @param radius Maximum distance from a center (in meters!).
   */
  drawCircle(center: Point, radius: number): void;

  /**
   * @param polygon Closed sequence of points with at least 4 items (first and last must be the same).
   */
  drawPolygon(polygon: Point[]): void;

  /**
   * @param polyline Sequence of points with at least 2 items.
   */
  drawPolyline(polyline: Point[]): void;

  /**
   * @param handle callback should be called with user-clicked position.
   */
  captureLocation(handle: (point: Point) => void): void;
}

export interface IStorage {

  /**
   * Existence of a particular item in the database.
   */
  has(id: string): boolean;

  get(id: string): boolean;
}
