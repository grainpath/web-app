import { useContext } from 'react';
import L, { LatLng } from 'leaflet';
import { AppContext } from '../App';
import { icons } from '../utils/icons';
import { UidPoint } from '../utils/types';
import { marker2point } from '../utils/convs';
import { setRemote } from '../features/panelsSlice';
import { erase, setSource, setTarget, } from '../features/searchSlice';
import { useAppDispatch, useAppSelector } from '../features/hooks';
import { SteadyMarkerLine } from './MarkerLine';
import { RemoteButton, EraseButton } from './Button';
import { TabsBoard } from './Search/TabsBoard';

export function SearchHeader(): JSX.Element {

  const leaflet = useContext(AppContext).leaflet;
  const dispatch = useAppDispatch();

  const handleErase = () => {

    dispatch(erase());
    leaflet.markers.forEach(marker => { leaflet.map?.removeLayer(marker); });
    leaflet.markers.clear();
  }

  return (
    <>
      <RemoteButton onClick={() => { dispatch(setRemote()) }} />
      <EraseButton onClick={handleErase} />
    </>
  );
}

export function SearchBody(): JSX.Element {

  const dispatch = useAppDispatch();
  const { leaflet } = useContext(AppContext);

  const source = useAppSelector(state => state.search.source);
  const target = useAppSelector(state => state.search.target);

  const handlePoint = (point: UidPoint | undefined, view: string, func: (point: UidPoint) => void): void => {
    if (!point) {

      const c = leaflet.count++;
      const m = L.marker(leaflet.map!.getCenter(), { icon: (icons as any)[view], draggable: true }).addTo(leaflet.map!);

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
      <TabsBoard />
    </>
  );
}
