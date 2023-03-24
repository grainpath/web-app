import { Map as LeafletRawMap } from "leaflet"
import { LeafletMap } from "../utils/leaflet";
import { IMap, IStorage } from "../utils/interfaces";
import {
  AutocItem,
  BoundItem
} from "../utils/grainpath";

/**
 * Use application context for all non-serializable data!
 */

type AppContextValue = {
  map?: IMap;
  storage?: IStorage;
  grain: {
    autoc: Map<string, AutocItem[]>;
    bound?: BoundItem;
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
  grain: {
    autoc: new Map<string, AutocItem[]>()
  }
};
