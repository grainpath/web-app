import { LayerGroup, Map } from "leaflet";
import { HeavyPlace, MaybePlace, Point } from "./grainpath";

export interface IPin {

  withLink(func: () => void): void;

  withDrag(func: (point: Point) => void): void;
}

export interface IMap {

  clear(): void;

  addSource(place: MaybePlace): IPin;

  addTarget(place: MaybePlace): IPin;

// v--- to be removed ---v

  getMap(): Map;

  getLayer(): LayerGroup;

  setHeavyPlace(place: HeavyPlace): void;

// ^--- to be removed ---^
}
