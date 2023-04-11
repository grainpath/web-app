import { Map as LeafletRawMap } from "leaflet"
import { LeafletMap } from "../utils/leaflet";
import { KeywordAutoc } from "../domain/types";
import { IMap, IStorage } from "../domain/interfaces";
import { IndexedDbStorage } from "../utils/indexeddb";

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

export class MapFactory {

  /**
   * @param map original Leaflet Map.
   * @returns wrapper with desired functionality.
   */
  static getMap(map: LeafletRawMap): IMap { return new LeafletMap(map); }
}

export const context: AppContextValue = {
  storage: new IndexedDbStorage(),
  grain: {
    autoc: new Map<string, KeywordAutoc[]>()
  }
};
