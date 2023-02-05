import { LatLng } from 'leaflet';
import { useContext } from 'react';
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet';

const cnt = new LatLng(50.088349, 14.403679);
const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const att = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function MapExtractor(): JSX.Element {
  return (<></>);
}

export default function Map(): JSX.Element {

  return (
    <MapContainer id={"map"} center={cnt} scrollWheelZoom={true} zoom={4} zoomControl={false}>
      <TileLayer url={url} attribution={att} />
      <ZoomControl position={"bottomright"} />
      <MapExtractor />
    </MapContainer>
  );
}
