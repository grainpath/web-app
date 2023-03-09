import { Icon, LayerGroup, Map as LeafletMap, Marker } from "leaflet";
import { SolidDataset, UrlString } from "@inrupt/solid-client";

import { pinViews, PinViewType } from "../utils/leaflet";

/**
 * Use application context for all non-serializable data!
 */

type LockerDatasets = {
  points: SolidDataset;
  shapes: SolidDataset
}

export type LockerContextValue = {
  data: Map<UrlString, LockerDatasets>;
};

export type SearchContextValue = {
  sequence: Marker<Icon<any>>[];
};

export type LeafletContextValue = {
  map?: LeafletMap;
  views: PinViewType;
  layerGroup?: LayerGroup;

  // single-purpose
  zoom?: L.Control.Zoom;
  geo?: L.Control.Locate;
}

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
