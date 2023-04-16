import { IStorage } from "../domain/interfaces";
import { StoredDirection, StoredPlace, StoredRoute } from "../domain/types";

/**
 * Wrapper over standard (k, v) collection.
 */
export default class InmemStorage implements IStorage {

  private readonly places = new Map<string, StoredPlace>();
  private readonly routes = new Map<string, StoredRoute>();
  private readonly directions = new Map<string, StoredDirection>();

  // [C]reate

  private createT<T>(store: Map<string, T>, key: string, value: T): Promise<void> {
    return new Promise((res, _) => { store.set(key, value); res(); });
  }

  public createPlace(place: StoredPlace): Promise<void> {
    return this.createT(this.places, place.placeId, place);
  }

  public createRoute(route: StoredRoute): Promise<void> {
    return this.createT(this.routes, route.routeId, route);
  }

  public createDirection(direction: StoredDirection): Promise<void> {
    return this.createT(this.directions, direction.directionId, direction);
  }

  // [R]ead

  public getAllT<T>(store: Map<string, T>): Promise<T[]> {
    return new Promise((res, _) => { res(Array.from(store.values())); })
  }

  public getAllPlaces(): Promise<StoredPlace[]> {
    return this.getAllT(this.places);
  }

  public getAllRoutes(): Promise<StoredRoute[]> {
    return this.getAllT(this.routes);
  }

  public getAllDirections(): Promise<StoredDirection[]> {
    return this.getAllT(this.directions);
  }

  // [U]pdate

  private updateT<T>(store: Map<string, T>, key: string, value: T): Promise<void> {
    return new Promise((res, _) => { store.set(key, value); res(); });
  }

  public updatePlace(place: StoredPlace): Promise<void> {
    return this.updateT(this.places, place.placeId, place);
  }

  public updateRoute(route: StoredRoute): Promise<void> {
    return this.updateT(this.routes, route.routeId, route);
  }

  public updateDirection(direction: StoredDirection): Promise<void> {
    return this.updateT(this.directions, direction.directionId, direction);
  }

  // [D]elete

  public deleteT<T>(store: Map<string, T>, key: string): Promise<void> {
    return new Promise((res, _) => { store.delete(key); res(); });
  }

  public deletePlace(placeId: string): Promise<void> {
    return this.deleteT(this.places, placeId);
  }

  public deleteRoute(routeId: string): Promise<void> {
    return this.deleteT(this.routes, routeId);
  }

  public deleteDirection(directionId: string): Promise<void> {
    return this.deleteT(this.directions, directionId);
  }
}
