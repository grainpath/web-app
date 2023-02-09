import { useContext } from 'react';
import L, { LatLng } from 'leaflet';
import { Tab, Tabs } from 'react-bootstrap';
import { AppContext } from '../../App';
import { icons } from '../../utils/icons';
import { UidPoint } from '../../utils/types';
import { marker2point } from '../../utils/convs';
import { setRemote } from '../../features/panelsSlice';
import { erase, setSource, setTarget, } from '../../features/searchSlice';
import { useAppDispatch, useAppSelector } from '../../features/hooks';
import EraseButton from './EraseButton';
import { CountInput } from './CountInput';
import { DistanceInput } from './DistanceInput';
import { KeywordsInput } from './KeywordsInput';
import { RemoteButton, SteadyMarkerLine } from '../PanelControl';

export function SearchHeader(): JSX.Element {

  const dispatch = useAppDispatch();
  const leaflet = useContext(AppContext).leaflet;
  const isLoggedIn = useAppSelector(state => state.logger.isLoggedIn);

  const handleErase = () => {

    dispatch(erase());
    leaflet.markers.forEach(marker => { leaflet.map?.removeLayer(marker); });
    leaflet.markers.clear();
  }

  return (
    <>
      <RemoteButton onClick={() => { dispatch(setRemote()); }} disabled={!isLoggedIn} />
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
      <Tabs defaultActiveKey='discover' fill className='mb-4 mt-4'>
        <Tab eventKey='discover' title='Discover'>
          <CountInput />
          <DistanceInput />
          <KeywordsInput />
        </Tab>
        <Tab eventKey='navigate' title='Navigate'>
        </Tab>
      </Tabs>
    </>
  );
}
