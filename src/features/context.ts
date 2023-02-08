import { Icon, Map as LeafletMap, Marker } from 'leaflet';
import { Session } from '@inrupt/solid-client-authn-browser';
import { Pin } from '../utils/icons';

/**
 * Use application context for all non-serializable data!
 */

export type LeafletContextValue = {
  map?: LeafletMap;
  count: number;
  markers: Map<number, Marker<Icon<Pin>>>;
}

export type InruptContextValue = {
  session: Session;
}

export type AppContextValue = {
  inrupt: InruptContextValue;
  leaflet: LeafletContextValue;
};

export const context: AppContextValue = {
  inrupt: { session: new Session() },
  leaflet: { count: 0, markers: new Map<number, Marker<Icon<Pin>>>(), },
};
