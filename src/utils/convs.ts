import { UidPoint } from "./types";

export const marker2point = (m: L.Marker<any>, c: number): UidPoint => {
  return { uid: c, lon: m.getLatLng().lng, lat: m.getLatLng().lat, };
};
