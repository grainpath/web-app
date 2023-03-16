import L, {
  BaseIconOptions,
  Icon,
  LatLng,
  LayerGroup,
  Map,
  Marker,
  PointExpression
} from "leaflet";
import { IMap, IPin } from "./interfaces";
import { MaybePlacePopupFactory } from "./leaflet-components";
import { HeavyPlace, MaybePlace, Point } from "./grainpath";

const pos = "bottomright";
const dir = process.env.PUBLIC_URL + "/assets/markers";

/**
 * Transform Leaflet point to a standard.
 */
function latLng2point(l: LatLng): Point { return { lon: l.lng, lat: l.lat } as Point; }

enum Color {
  R = "red",
  G = "green",
  B = "blue",
  V = "violet"
}

class LeafletFace implements BaseIconOptions {

  iconUrl?: string;
  shadowUrl?: string;
  iconSize?: PointExpression;
  iconAnchor?: PointExpression;
  shadowSize?: PointExpression;
  popupAnchor?: PointExpression;

  constructor(color: string) {

    this.iconUrl = dir + `/colors/marker-icon-${color}.png`;
    this.shadowUrl = dir + "/shadow/marker-shadow.png";
    this.iconSize = [25, 41];
    this.iconAnchor = [12, 41];
    this.shadowSize = [41, 41];
    this.popupAnchor = [1, -34];
  }
};

export type PinViewType = {
  source: Icon<LeafletFace>,
  target: Icon<LeafletFace>,
  custom: Icon<LeafletFace>,
  tagged: Icon<LeafletFace>
};

export const pinViews: PinViewType = {
  source: new L.Icon(new LeafletFace(Color.G)),
  target: new L.Icon(new LeafletFace(Color.R)),
  custom: new L.Icon(new LeafletFace(Color.B)),
  tagged: new L.Icon(new LeafletFace(Color.V))
};

class LeafletPin implements IPin {

  // see https://epsg.io/3857
  private ensureLonBounds (lon: number): number { return Math.min(Math.max(lon, -180.0), +180.0); }
  private ensureLatBounds (lat: number): number { return Math.min(Math.max(lat, -85.06), +85.06); }

  public readonly place: MaybePlace;
  public readonly pin: Marker<any>;

  constructor(place: MaybePlace, pin: Marker<any>) {
    this.place = place; this.pin = pin;
  }

  withLink(func: () => void): void {
    this.pin.addEventListener("popupopen", () => {
      document.getElementById(`popup-${this.place.id}`)?.addEventListener("click", func);
    });
  }

  withDrag(func: (point: Point) => void): void {
    this.pin.addEventListener("dragend", () => {
      const ll = this.pin.getLatLng();
      func({ lon: this.ensureLonBounds(ll.lng), lat: this.ensureLatBounds(ll.lat) });
    });
  }
}

export class LeafletMap implements IMap {

  private static readonly icons = {
    known: new L.Icon(new LeafletFace(Color.V)),
    other: new L.Icon(new LeafletFace(Color.B)),
    source: new L.Icon(new LeafletFace(Color.G)),
    target: new L.Icon(new LeafletFace(Color.R))
  };

  private readonly map: Map;
  private readonly palette: LayerGroup;
  private pins: LeafletPin[];

  private addMarker(point: Point, icon: Icon<any>, draggable: boolean): Marker<any> {
    return L.marker(new LatLng(point.lat, point.lon), { icon: icon, draggable: draggable }).addTo(this.palette);
  }

  private addMaybePlace(place: MaybePlace, icon: Icon<any>): LeafletPin {
    const p = MaybePlacePopupFactory.getInstance(place);
    return new LeafletPin(place, this.addMarker(place.location, icon, !place.id).bindPopup(p));
  }

  private appendPin(place: MaybePlace, icon: Icon<LeafletFace>): IPin {
    this.pins.push(this.addMaybePlace(place, icon));
    return this.pins[this.pins.length - 1];
  }

  constructor(map: Map) {

    this.map = map;
    this.palette = L.layerGroup().addTo(map);
    L.control.zoom({ position: pos }).addTo(map);
    L.control.locate({ position: pos }).addTo(map);
    this.pins = [];
  }

  public clear(): void {
    this.pins = [];
    this.palette.clearLayers();
  }

  public addKnown(place: MaybePlace): IPin {
    return this.appendPin(place, LeafletMap.icons.known);
  }

  public addOther(place: MaybePlace): IPin {
    return this.appendPin(place, LeafletMap.icons.other);
  }

  public addSource(place: MaybePlace): IPin {
    return this.appendPin(place, LeafletMap.icons.source);
  }

  public addTarget(place: MaybePlace): IPin {
    return this.appendPin(place, LeafletMap.icons.target);
  }

// to be removed --v

  public getMap(): L.Map { return this.map; }

  public getLayer(): L.LayerGroup<any> { return this.palette; }

  public setHeavyPlace(place: HeavyPlace): void {
    const ll = new LatLng(place.location.lat, place.location.lon);
    L.marker(ll, { icon: LeafletMap.icons.known, draggable: false }).addTo(this.palette);

    if (place.tags.polygon) {
      L.polygon(place.tags.polygon.map((point) => new LatLng(point.lat, point.lon)), { color: Color.G }).addTo(this.palette);
    }

    this.map.flyTo(ll, this.map.getZoom());
  }

// to be removed --^
}
