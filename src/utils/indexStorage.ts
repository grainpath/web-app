import { IStorage } from "../domain/interfaces";
import {
  StoredDirec,
  StoredPlace,
  StoredRoute
} from "../domain/types";

/**
 * Wrapper over standard IndexedDB.
 */
export default class IndexStorage implements IStorage {

  private static db = "grainpath";

  private static places = "places";
  private static routes = "routes";
  private static direcs = "direcs";

  private static generateError = (msg: string) => new Error(`[DB error] ${msg}`);

  private static openErrorMsg = "Cannot open database.";
  private static openError = () => this.generateError(this.openErrorMsg);

  private static createError = () => this.generateError("Cannot create an object.");

  private static getAllError = (store: string) => this.generateError(`Cannot get all ${store}.`);

  private static updateError = () => this.generateError("Cannot update object.");

  private static deleteError = () => this.generateError("Cannot delete object.");

  private static getDb(e: Event) { return (e.target as IDBOpenDBRequest).result; }

  constructor() {
    const request = indexedDB.open(IndexStorage.db);
    request.onupgradeneeded = function (e) {
      const db = (e.target as IDBOpenDBRequest).result;
      db.createObjectStore(IndexStorage.places, { keyPath: "placeId" });
      db.createObjectStore(IndexStorage.routes, { keyPath: "routeId" });
      db.createObjectStore(IndexStorage.direcs, { keyPath: "direcId" });
    }
    request.onerror = () => { alert(IndexStorage.openErrorMsg); }
  }

  // [C]reate

  private static createT<T>(store: string, item: T): Promise<void> {
    return new Promise((res, rej) => {
      const r1 = indexedDB.open(IndexStorage.db);
      r1.onsuccess = (evt) => {
        const r2 = IndexStorage
          .getDb(evt)
          .transaction(store, "readwrite")
          .objectStore(store)
          .add(item);
        r2.onsuccess = () => { res(); };
        r2.onerror = () => { rej(IndexStorage.createError()); };
      };
      r1.onerror = () => { rej(IndexStorage.openError()); };
    });
  }

  public createPlace(place: StoredPlace): Promise<void> {
    return IndexStorage.createT(IndexStorage.places, place);
  }

  public createRoute(route: StoredRoute): Promise<void> {
    return IndexStorage.createT(IndexStorage.routes, route);
  }

  public createDirec(direc: StoredDirec): Promise<void> {
    return IndexStorage.createT(IndexStorage.direcs, direc);
  }

  // [R]ead

  private getAllT<T>(store: string): Promise<T[]> {
    return new Promise((res, rej) => {
      const r1 = indexedDB.open(IndexStorage.db);
      r1.onsuccess = (evt) => {
        const r2 = IndexStorage
          .getDb(evt)
          .transaction(store)
          .objectStore(store)
          .getAll();
        r2.onsuccess = (e) => { res((e.target as IDBRequest<T[]>).result); };
        r2.onerror = () => { rej(IndexStorage.getAllError(store)); };
      };
      r1.onerror = () => { rej(IndexStorage.openError()); }
    });
  }

  public getAllPlaces(): Promise<StoredPlace[]> {
    return this.getAllT(IndexStorage.places);
  }

  public getAllRoutes(): Promise<StoredRoute[]> {
    return this.getAllT(IndexStorage.routes);
  }

  public getAllDirecs(): Promise<StoredDirec[]> {
    return this.getAllT(IndexStorage.direcs);
  }

  // [U]pdate

  private updateT<T>(store: string, item: T): Promise<void> {
    return new Promise((res, rej) => {
      const r1 = indexedDB.open(IndexStorage.db);
      r1.onsuccess = (evt) => {
        const r2 = IndexStorage
          .getDb(evt)
          .transaction(store, "readwrite")
          .objectStore(store)
          .put(item)
        r2.onsuccess = () => { res(); };
        r2.onerror = () => { rej(IndexStorage.updateError()); };
      }
      r1.onerror = () => { rej(IndexStorage.openError()); };
    });
  }

  public updatePlace(place: StoredPlace): Promise<void> {
    return this.updateT(IndexStorage.places, place);
  }

  public updateRoute(route: StoredRoute): Promise<void> {
    return this.updateT(IndexStorage.routes, route);
  }

  public updateDirec(direc: StoredDirec): Promise<void> {
    return this.updateT(IndexStorage.direcs, direc);
  }

  // [D]elete

  private deleteT(store: string, itemId: string): Promise<void> {
    return new Promise((res, rej) => {
      const r1 = indexedDB.open(IndexStorage.db);
      r1.onsuccess = (evt) => {
        const r2 = IndexStorage
          .getDb(evt)
          .transaction(store, "readwrite")
          .objectStore(store)
          .delete(itemId)
        r2.onsuccess = () => { res(); };
        r2.onerror = () => { rej(IndexStorage.deleteError()); };
      }
      r1.onerror = () => { rej(IndexStorage.openError()); };
    });
  }

  public deletePlace(placeId: string): Promise<void> {
    return this.deleteT(IndexStorage.places, placeId);
  }

  public deleteRoute(routeId: string): Promise<void> {
    return this.deleteT(IndexStorage.routes, routeId);
  }

  public deleteDirec(direcId: string): Promise<void> {
    return this.deleteT(IndexStorage.direcs, direcId);
  }
}
