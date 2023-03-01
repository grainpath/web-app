import { Icon, Map as LeafletMap, Marker } from "leaflet";
import { Session } from "@inrupt/solid-client-authn-browser";
import { SolidDataset, UrlString } from "@inrupt/solid-client";

import { Pin } from "../utils/icons";

/**
 * Use application context for all non-serializable data!
 */

export type InruptContextValue = {
  session: Session;
  datamap: Map<UrlString, SolidDataset>;
};

export type LeafletContextValue = {
  uid: number;
  map?: LeafletMap;
  zoom?: L.Control.Zoom;
  geo?: L.Control.Locate;
  markers: Map<number, Marker<Icon<Pin>>>;
}

export type AppContextValue = {
  inrupt: InruptContextValue;
  leaflet: LeafletContextValue;
};

export const context: AppContextValue = {
  inrupt: {
    session: new Session(),
    datamap: new Map<UrlString, SolidDataset>()
  },
  leaflet: {
    uid: 0,
    markers: new Map<number, Marker<Icon<Pin>>>()
  }
};
