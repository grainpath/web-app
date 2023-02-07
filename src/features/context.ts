import { Icon, Map as LeafletMap, Marker } from 'leaflet';
import { Pin } from '../utils/icons';

/**
 * Use application context for all non-serializable data!
 */

export type LeafletContextValue = {
  map?: LeafletMap;
  count: number;
  markers: Map<number, Marker<Icon<Pin>>>;
}

export type AppContextValue = {
  leaflet: LeafletContextValue;
};

export const context: AppContextValue = {
  leaflet: { count: 0, markers: new Map<number, Marker<Icon<Pin>>>(), },
};
