import L, { BaseIconOptions, PointExpression } from 'leaflet';

const path = './assets/markers/';

class Pin implements BaseIconOptions {

  iconUrl?: string;
  shadowUrl?: string;
  iconSize?: PointExpression;
  iconAnchor?: PointExpression;
  shadowSize?: PointExpression;
  popupAnchor: PointExpression;

  constructor(color: string) {

    this.iconUrl = path + `colors/marker-icon-${color}.png`;
    this.shadowUrl = path + 'colors/marker-shadow.png';
    this.iconSize = [25, 41];
    this.iconAnchor = [12, 41];
    this.shadowSize = [41, 41];
    this.popupAnchor = [1, -34];
  }
}

export const markers = {
  source: new L.Icon(new Pin('green')),
  target: new L.Icon(new Pin('red')),
  custom: new L.Icon(new Pin('blue')),
  tagged: new L.Icon(new Pin('violet')),
}
