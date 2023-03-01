import { useContext } from "react";
import L, { LatLng } from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

import { AppContext } from "../App";

const pos = "bottomright";

function FeatureSetter(): JSX.Element {

  const { leaflet } = useContext(AppContext);

  leaflet.map = useMap();
  leaflet.zoom = leaflet.zoom ?? L.control.zoom({ position: pos }).addTo(leaflet.map!);
  leaflet.geo = leaflet.geo ?? L.control.locate({ position: pos }).addTo(leaflet.map!);

  return (<></>);
}

export default function MapControl(): JSX.Element {

  const cnt = new LatLng(50.088349, 14.403679);
  const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const att = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://grainpath.github.io/docs/" target="_blank">GrainPath Docs</a>';

  return (
    <MapContainer id={"map"} center={cnt} scrollWheelZoom={true} zoom={4} zoomControl={false}>
      <TileLayer url={url} attribution={att} />
      <FeatureSetter />
    </MapContainer>
  );
}
