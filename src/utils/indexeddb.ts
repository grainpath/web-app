import { IStorage } from "../domain/interfaces";
import { StoredDirection, StoredPlace, StoredRoute } from "../domain/types";

export class IndexedDbStorage implements IStorage {

  private static db = "grainpath";

  private static places = "places";
  private static routes = "routes";
  private static directions = "directions";

  private static openErrorMessage = "[DB error] Cannot open database."
  private static openErrorHandler = () => new Error(IndexedDbStorage.openErrorMessage);

  private static createErrorMessage = "[DB error] Cannot save object.";
  private static createErrorHandler = () => new Error(IndexedDbStorage.createErrorMessage);

  private static getDb(e: Event) { return (e.target as IDBOpenDBRequest).result; }

  private static create<T>(item: T, store: string): Promise<void> {
    return new Promise((res, rej) => {
      const r1 = indexedDB.open(IndexedDbStorage.db);
      r1.onsuccess = (evt) => {
        const r2 = IndexedDbStorage
          .getDb(evt)
          .transaction(store, "readwrite")
          .objectStore(store)
          .add(item);
        r2.onsuccess = () => res();
        r2.onerror = () => rej(IndexedDbStorage.createErrorHandler());
      };
      r1.onerror = () => { rej(IndexedDbStorage.openErrorHandler()); }
    })
  }

  public IndexedDbStorage() {
    const request = indexedDB.open(IndexedDbStorage.db);
    request.onupgradeneeded = function (e) {
      const db = (e.target as IDBOpenDBRequest).result;
      db.createObjectStore(IndexedDbStorage.places, { keyPath: "placeId" })
        .createIndex("grainId", "grainId", { unique: true });
      db.createObjectStore(IndexedDbStorage.routes, { keyPath: "routeId" });
      db.createObjectStore(IndexedDbStorage.directions, { keyPath: "directionId" });
    }
    request.onerror = () => { alert(IndexedDbStorage.openErrorMessage); }
  }

  public createPlace(place: StoredPlace): Promise<void> {
    return IndexedDbStorage.create(place, IndexedDbStorage.places);
  }

  public createRoute(route: StoredRoute): Promise<void> {
    return IndexedDbStorage.create(route, IndexedDbStorage.routes);
  }

  public createDirection(direction: StoredDirection): Promise<void> {
    return IndexedDbStorage.create(direction, IndexedDbStorage.directions);
  }

  public tryGetPlace(placeId: string): StoredPlace | undefined {
    throw new Error("Method not implemented.");
  }

  public tryGetGrain(grainId: string): StoredPlace | undefined {
    throw new Error("Method not implemented.");
  }

  public tryGetRoute(routeId: string): StoredRoute | undefined {
    throw new Error("Method not implemented.");
  }

  tryGetDirection(directionId: string): StoredDirection | undefined {
    throw new Error("Method not implemented.");
  }

  updatePlace(place: StoredPlace): void {
  }

  updateRoute(route: StoredRoute): void {
  }

  updateDirection(direction: StoredDirection): void {
  }

  deletePlace(placeId: string): void {
  }

  deleteRoute(routeId: string): void {
  }

  deleteDirection(directionId: string): void {
  }
}
