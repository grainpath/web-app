import { Map as LeafletRawMap } from "leaflet"
import { LeafletMap } from "../utils/leaflet";
import { KeywordAutoc } from "../domain/types";
import { IMap, IStorage } from "../domain/interfaces";
import { IndexStorage } from "../utils/indexStorage";
import { InmemStorage } from "../utils/inmemStorage";

/**
 * Use application context for all non-serializable data!
 */

type AppContextValue = {
  map?: IMap;
  storage: IStorage;
  grain: {
    autoc: Map<string, KeywordAutoc[]>;
  }
};

class StorageFactory {
  static getStorage(): IStorage {
    return indexedDB ? new IndexStorage() : new InmemStorage();
  }
}

export class MapFactory {

  /**
   * @param map original Leaflet Map.
   * @returns wrapper with desired functionality.
   */
  static getMap(map: LeafletRawMap): IMap { return new LeafletMap(map); }
}

export const context: AppContextValue = {
  storage: StorageFactory.getStorage(),
  grain: {
    autoc: new Map<string, KeywordAutoc[]>()
  }
};
