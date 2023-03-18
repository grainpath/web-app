import { Map } from "leaflet"
import { LeafletMap } from "../utils/leaflet";
import { IMap, IStorage } from "../utils/interfaces";

/**
 * Use application context for all non-serializable data!
 */

type AppContextValue = {
  map?: IMap;
  storage?: IStorage;
};

export class MapFactory {

  /**
   * @param map original Leaflet Map.
   * @returns wrapper with desired functionality.
   */
  static getMap(map: Map): IMap { return new LeafletMap(map); }
}

export const context: AppContextValue = { };
