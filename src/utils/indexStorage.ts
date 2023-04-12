import { IStorage } from "../domain/interfaces";
import { StoredDirection, StoredPlace, StoredRoute } from "../domain/types";

/**
 * Wrapper over standard IndexedDB.
 */
export class IndexStorage implements IStorage {

  private static db = "grainpath";

  private static places = "places";
  private static routes = "routes";
  private static directions = "directions";

  private static openErrorMessage = "[DB error] Cannot open database."
  private static openErrorHandler = () => new Error(IndexStorage.openErrorMessage);

  private static createErrorMessage = "[DB error] Cannot save object.";
  private static createErrorHandler = () => new Error(IndexStorage.createErrorMessage);

  private static getDb(e: Event) { return (e.target as IDBOpenDBRequest).result; }

  public IndexedDbStorage() {
    const request = indexedDB.open(IndexStorage.db);
    request.onupgradeneeded = function (e) {
      const db = (e.target as IDBOpenDBRequest).result;
      db.createObjectStore(IndexStorage.places, { keyPath: "placeId" })
        .createIndex("by_grainId", "grainId", { unique: true });
      db.createObjectStore(IndexStorage.routes, { keyPath: "routeId" });
      db.createObjectStore(IndexStorage.directions, { keyPath: "directionId" });
    }
    request.onerror = () => { alert(IndexStorage.openErrorMessage); }
  }

  private static create<T>(store: string, item: T): Promise<void> {
    return new Promise((res, rej) => {
      const r1 = indexedDB.open(IndexStorage.db);
      r1.onsuccess = (evt) => {
        const r2 = IndexStorage
          .getDb(evt)
          .transaction(store, "readwrite")
          .objectStore(store)
          .add(item);
        r2.onsuccess = () => res();
        r2.onerror = () => rej(IndexStorage.createErrorHandler());
      };
      r1.onerror = () => { rej(IndexStorage.openErrorHandler()); }
    })
  }

  public createPlace(place: StoredPlace): Promise<void> {
    return IndexStorage.create(IndexStorage.places, place);
  }

  public createRoute(route: StoredRoute): Promise<void> {
    return IndexStorage.create(IndexStorage.routes, route);
  }

  public createDirection(direction: StoredDirection): Promise<void> {
    return IndexStorage.create(IndexStorage.directions, direction);
  }

  public tryGetGrain(grainId: string): Promise<StoredPlace | undefined> {
    throw new Error("Method not implemented.");
  }

  public tryGetPlace(placeId: string): Promise<StoredPlace | undefined> {
    throw new Error("Method not implemented.");
  }

  public tryGetRoute(routeId: string): Promise<StoredRoute | undefined> {
    throw new Error("Method not implemented.");
  }

  public tryGetDirection(directionId: string): Promise<StoredDirection | undefined> {
    throw new Error("Method not implemented.");
  }

  public updatePlace(place: StoredPlace): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public updateRoute(route: StoredRoute): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public updateDirection(direction: StoredDirection): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public deletePlace(placeId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public deleteRoute(routeId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public deleteDirection(directionId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
