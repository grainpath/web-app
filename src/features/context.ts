import { Map as LeafletRawMap } from "leaflet"
import { LeafletMap } from "../utils/leaflet";
import { Entity, KeywordAutoc } from "../domain/types";
import { IMap, IStorage } from "../domain/interfaces";
import IndexStorage from "../utils/indexStorage";
import InmemStorage from "../utils/inmemStorage";

/**
 * Use application context for all non-serializable data!
 */

type AppContextValue = {
  map?: IMap;
  storage: IStorage;
  grain: {
    autocs: Map<string, KeywordAutoc[]>;
    entity: Map<string, Entity>;
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
    autocs: new Map(),
    entity: new Map()
  }
};
