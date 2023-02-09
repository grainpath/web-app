import { LatLng } from 'leaflet';
import { useContext } from 'react';
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import { AppContext } from '../App';

function MapExtractor(): JSX.Element {

  const { leaflet } = useContext(AppContext);
  leaflet.map = useMap();

  return(<></>);
}

export default function MapControl(): JSX.Element {

  const cnt = new LatLng(50.088349, 14.403679);
  const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const att = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="https://grainpath.github.io/docs/" target="_blank">GrainPath docs</a>';

  return (
    <MapContainer id={"map"} center={cnt} scrollWheelZoom={true} zoom={4} zoomControl={false}>
      <TileLayer url={url} attribution={att} />
      <ZoomControl position={"bottomright"} />
      <MapExtractor />
    </MapContainer>
  );
}
