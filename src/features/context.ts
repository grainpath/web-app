import { Icon, LayerGroup, Map as X, Marker } from "leaflet";
import { SolidDataset, UrlString } from "@inrupt/solid-client";

import { LeafletMap, pinViews, PinViewType } from "../utils/leaflet";

/**
 * Use application context for all non-serializable data!
 */

type LockerDatasets = {
  places: SolidDataset;
  routes: SolidDataset
}

export type LockerContextValue = {
  data: Map<UrlString, LockerDatasets>;
};

export type SearchContextValue = {
  sequence: Marker<Icon<any>>[];
};

export type LeafletContextValue = {
  views: PinViewType;
  newmap?: LeafletMap;
};

export type AppContextValue = {
  locker: LockerContextValue;
  search: SearchContextValue;
  leaflet: LeafletContextValue;
};

export const context: AppContextValue = {
  locker: {
    data: new Map<UrlString, LockerDatasets>()
  },
  search: {
    sequence: []
  },
  leaflet: {
    views: pinViews
  }
};
