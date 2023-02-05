import { LatLng } from 'leaflet';
import { useDispatch } from 'react-redux';
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import { setMap } from '../features/mapperSlice';

const cnt = new LatLng(50.088349, 14.403679);
const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const att = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function MapExtractor(): JSX.Element {

  useDispatch()(setMap(useMap()));
  return(<></>)
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
