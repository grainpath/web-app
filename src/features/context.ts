import { Icon, Map as LeafletMap, Marker } from "leaflet";
import { Session } from "@inrupt/solid-client-authn-browser";
import { Pin } from "../utils/icons";

/**
 * Use application context for all non-serializable data!
 */

export type InruptContextValue = {
  session: Session;
}

export type LeafletContextValue = {
  uid: number;
  map?: LeafletMap;
  geo?: L.Control.Locate;
  zoom?: L.Control.Zoom;
  markers: Map<number, Marker<Icon<Pin>>>;
}

export type AppContextValue = {
  inrupt: InruptContextValue;
  leaflet: LeafletContextValue;
};

export const context: AppContextValue = {
  inrupt: { session: new Session() },
  leaflet: {
    uid: 0,
    markers: new Map<number, Marker<Icon<Pin>>>()
  }
};
