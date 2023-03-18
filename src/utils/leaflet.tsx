import L, {
  BaseIconOptions,
  Icon,
  LatLng,
  LayerGroup,
  Map,
  Marker,
  PointExpression
} from "leaflet";
import * as ReactDOMServer from "react-dom/server";
import { Badge } from "react-bootstrap";
import { Link } from "@mui/icons-material";
import { IMap, IPin } from "./interfaces";
import { LightPlace, MaybePlace, Point } from "./grainpath";

const pos = "bottomright";
const dir = process.env.PUBLIC_URL + "/assets/markers";

enum Color {
  R = "red",
  G = "green",
  B = "blue",
  V = "violet",
  Y = "grey"
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

type PointPlacePopupProps = {
  place: MaybePlace;
};

function PointPlacePopup({ place }: PointPlacePopupProps): JSX.Element {
  return (<b>{place.name}</b>);
}

type LightPlacePopupProps = {
  place: LightPlace;
};

function LightPlacePopup({ place }: LightPlacePopupProps): JSX.Element {

  return (
    <>
      <b>{place.name}</b>
      <hr style={{opacity: 0.7, margin: "0.25rem 0"}} />
      <div className="mt-2 mb-2" style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
        <Link id={place.id} fontSize="large" style={{ cursor: "pointer" }} />
        <div className="mt-1 mb-1" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", width: "150px" }}>
          {place.keywords.map((k, i) => <Badge key={i} bg="success" style={{ margin: "0.1rem", display: "block" }} pill>{k}</Badge>)}
        </div>
      </div>
    </>
  );
}

class MaybePlacePopupFactory {

  public static getPoint(place: MaybePlace): string {
    return ReactDOMServer.renderToString(<PointPlacePopup place={place} />);
  }

  public static getLight(place: LightPlace): string {
    return ReactDOMServer.renderToString(<LightPlacePopup place={place} />);
  }
}

class LeafletPin implements IPin {

  // see https://epsg.io/3857
  private ensureLonBounds (lon: number): number { return Math.min(Math.max(lon, -180.0), +180.0); }
  private ensureLatBounds (lat: number): number { return Math.min(Math.max(lat, -85.06), +85.06); }

  public readonly place: MaybePlace;
  public readonly marker: Marker<any>;

  /**
   * Adds link to a button on the popup of an identifiable place.
   * @param link typically a wrapper around `useNavigate` hook.
   * @param id any identifier that plays well with `link` function.
   */
  public withLink(link: (id: string) => void, id: string): void {
    this.marker.addEventListener("popupopen", () => {
      document.getElementById(`popup-${id}`)?.addEventListener("click", () => link(id));
    });
  }

  /**
   * Action upon event on dragend (when user releases marker on a new position).
   */
  public withDrag(drag: (point: Point) => void): void {
    this.marker.addEventListener("dragend", () => {
      const ll = this.marker.getLatLng();
      drag({ lon: this.ensureLonBounds(ll.lng), lat: this.ensureLatBounds(ll.lat) });
    });
  }

  constructor(place: MaybePlace, marker: Marker<any>) {
    this.place = place; this.marker = marker;
  }
}

export class LeafletMap implements IMap {

  private static readonly icons = {
    source: new L.Icon(new LeafletFace(Color.G)),
    target: new L.Icon(new LeafletFace(Color.R)),
    tagged: new L.Icon(new LeafletFace(Color.B)),
    stored: new L.Icon(new LeafletFace(Color.V)),
    custom: new L.Icon(new LeafletFace(Color.Y)),
  };

  private readonly color: string = "green";

  private readonly map: Map;
  private readonly palette: LayerGroup;
  private pins: LeafletPin[];

  private point2latlng(point: Point) {
    return new LatLng(point.lat, point.lon);
  }

  private latlng2point(ll: LatLng): Point {
    return { lon: ll.lng, lat: ll.lat };
  }

  private addMarker(point: Point, icon: Icon<any>, draggable: boolean): Marker<any> {
    return L.marker(new LatLng(point.lat, point.lon), { icon: icon, draggable: draggable }).addTo(this.palette);
  }

  private addLightPlace(place: LightPlace, icon: Icon<LeafletFace>): LeafletPin {
    const p = MaybePlacePopupFactory.getLight(place);
    return new LeafletPin(place, this.addMarker(place.location, icon, false).bindPopup(p));
  }

  private addPointPlace(place: MaybePlace, icon: Icon<any>, draggable: boolean) {
    const p = MaybePlacePopupFactory.getPoint(place);
    return new LeafletPin(place, this.addMarker(place.location, icon, !place.id && draggable).bindPopup(p));
  }

  private addMaybePlace(place: MaybePlace, icon: Icon<any>, draggable: boolean): LeafletPin {
    return (place.id)
      ? (this.addLightPlace({ ...place, id: place.id!}, icon))
      : (this.addPointPlace(place, icon, draggable));
  }

  private appendPin(func: () => LeafletPin): IPin {
    return this.pins[this.pins.push(func()) - 1];
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

  public flyTo(place: MaybePlace): void {
    const pin = this.pins.find(pin => pin.place === place);
    if (pin) {
      const point = pin.place.location;
      this.map.flyTo(new LatLng(point.lat, point.lon), this.map.getZoom());
      pin.marker.openPopup();
    }
  }

  public addStored(place: LightPlace): IPin {
    return this.appendPin(() => this.addLightPlace(place, LeafletMap.icons.stored));
  }

  public addTagged(place: LightPlace): IPin {
    return this.appendPin(() => this.addLightPlace(place, LeafletMap.icons.tagged));
  }

  public addCustom(place: MaybePlace, draggable: boolean = true): IPin {
    return this.appendPin(() => this.addPointPlace(place, LeafletMap.icons.custom, draggable));
  }

  public addSource(place: MaybePlace, draggable: boolean = true): IPin {
    return this.appendPin(() => this.addMaybePlace(place, LeafletMap.icons.source, draggable));
  }

  public addTarget(place: MaybePlace, draggable: boolean = true): IPin {
    return this.appendPin(() => this.addMaybePlace(place, LeafletMap.icons.target, draggable));
  }

  public drawCircle(center: Point, radius: number): void {
    if (radius < 0.0) { return; }
    L.circle(new LatLng(center.lat, center.lon), {
      color: this.color, fillColor: this.color, fillOpacity: 0.2, radius: radius
    }).addTo(this.palette);
  }

  public drawPolygon(polygon: Point[]): void {
    if (polygon.length < 4) { return; }
    L.polygon(polygon.map(pt => this.point2latlng(pt)), {
      color: this.color, fillColor: this.color, fillOpacity: 0.5
    }).addTo(this.palette);
  }

  public drawPolyline(polyline: Point[]): void {
    if (polyline.length < 2) { return; }
    L.polyline(polyline.map(pt => this.point2latlng(pt)), {
      color: this.color, fillColor: this.color, fillOpacity: 0.5
    }).addTo(this.palette);
  }

  public captureLocation(callback: (point: Point) => void): void {
    const style = this.map.getContainer().style;
    style.cursor = "crosshair";

    this.map.once("click", (e) => {
      style.cursor = "";
      callback(this.latlng2point(this.map.mouseEventToLatLng(e.originalEvent)));
    });
  }
}
