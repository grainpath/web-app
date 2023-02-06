import { useContext } from 'react';
import L, { LatLng } from 'leaflet';
import { icons } from '../utils/icons';
import { UidPoint } from '../utils/types';
import { AppContext } from '../App';
import { setRemote } from '../features/panelsSlice';
import { erase, setSource, setTarget, } from '../features/searchSlice';
import { useAppDispatch, useAppSelector } from '../features/hooks';
import { SteadyMarkerLine } from './MarkerLine';
import { RemoteButton, EraseButton } from './Button';

export function SearchHeader(): JSX.Element {

  const dispatch = useAppDispatch();

  return (
    <>
      <RemoteButton onClick={() => { dispatch(setRemote()) }} />
      <EraseButton onClick={() => { dispatch(erase()) }} />
    </>
  );
}

export function SearchBody(): JSX.Element {

  const { leaflet } = useContext(AppContext);

  const source = useAppSelector(state => state.search.source);
  const target = useAppSelector(state => state.search.target);
  const dispatch = useAppDispatch();

  const handlePoint = (point: UidPoint | undefined, view: string, func: (point: UidPoint) => void): void => {
    if (!point) {

      const c = leaflet.count++;
      const m = L.marker(leaflet.map!.getCenter(), { icon: (icons as any)[view], draggable: true }).addTo(leaflet.map!);

      const marker2point = (m: L.Marker<any>, c: number): UidPoint => {
        return { uid: c, lon: m.getLatLng().lng, lat: m.getLatLng().lat, };
      };

      leaflet.markers.set(c, m);
      m.addEventListener('dragend', () => { func(marker2point(m, c)) });

      point = marker2point(m, c);
      func(point);
    }

    leaflet.map?.flyTo(new LatLng(point.lat, point.lon), leaflet.map.getZoom());
  };

  return (
    <>
      <SteadyMarkerLine kind={'source'} point={source} onClick={() => handlePoint(source, 'source', (point: UidPoint) => { dispatch(setSource(point)) })} />
      <SteadyMarkerLine kind={'target'} point={target} onClick={() => handlePoint(target, 'target', (point: UidPoint) => { dispatch(setTarget(point)) })} />
    </>
  );
}
