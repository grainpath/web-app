import { Icon, LayerGroup, Map as LeafletMap, Marker } from "leaflet";
import { SolidDataset, UrlString } from "@inrupt/solid-client";

import { pinViews, PinViewType } from "../utils/icons";

/**
 * Use application context for all non-serializable data!
 */

export type LockerContextValue = {
  datamap: Map<UrlString, SolidDataset>;
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
    datamap: new Map<UrlString, SolidDataset>()
  },
  search: {
    sequence: []
  },
  leaflet: {
    views: pinViews
  }
};
