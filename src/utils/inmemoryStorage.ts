import { IStorage } from "../domain/interfaces";
import { StoredDirection, StoredPlace, StoredRoute } from "../domain/types";

/**
 * Wrapper over standard (k, v) collection.
 */
export class InMemoryStorage implements IStorage {

  private readonly places = new Map<string, StoredPlace>();
  private readonly routes = new Map<string, StoredRoute>();
  private readonly directions = new Map<string, StoredDirection>();

  public InMemoryStorage() { }

  private create<T>(store: Map<string, T>, key: string, value: T): Promise<void> {
    return new Promise((res, _) => { store.set(key, value); res(); });
  }

  public createPlace(place: StoredPlace): Promise<void> {
    return this.create(this.places, place.placeId, place);
  }

  public createRoute(route: StoredRoute): Promise<void> {
    return this.create(this.routes, route.routeId, route);
  }

  public createDirection(direction: StoredDirection): Promise<void> {
    return this.create(this.directions, direction.directionId, direction);
  }

  public tryGetGrain(grainId: string): Promise<StoredPlace | undefined> {
    return new Promise((res, _) => {
      for (const place of Array.from(this.places.values())) {
        if (place.grainId === grainId) { res(place); }
      }
      res(undefined);
    });
  };

  private tryGet<T>(store: Map<string, T>, key: string): Promise<T | undefined> {
    return new Promise((res, _) => { res(store.get(key)); });
  }

  public tryGetPlace(placeId: string): Promise<StoredPlace | undefined> {
    return this.tryGet(this.places, placeId);
  }

  public tryGetRoute(routeId: string): Promise<StoredRoute | undefined> {
    return this.tryGet(this.routes, routeId);
  }

  public tryGetDirection(directionId: string): Promise<StoredDirection | undefined> {
    return this.tryGet(this.directions, directionId);
  }

  private update<T>(store: Map<string, T>, key: string, value: T): Promise<void> {
    return new Promise((res, _) => { store.set(key, value); res(); });
  }

  public updatePlace(place: StoredPlace): Promise<void> {
    return this.update(this.places, place.placeId, place);
  }

  public updateRoute(route: StoredRoute): Promise<void> {
    return this.update(this.routes, route.routeId, route);
  }

  public updateDirection(direction: StoredDirection): Promise<void> {
    return this.update(this.directions, direction.directionId, direction);
  }

  public delete<T>(store: Map<string, T>, key: string): Promise<void> {
    return new Promise((res, _) => { store.delete(key); res(); });
  }

  public deletePlace(placeId: string): Promise<void> {
    return this.delete(this.places, placeId);
  }

  public deleteRoute(routeId: string): Promise<void> {
    return this.delete(this.routes, routeId);
  }

  public deleteDirection(directionId: string): Promise<void> {
    return this.delete(this.directions, directionId);
  }
}
