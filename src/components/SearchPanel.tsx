import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import L, { LatLng } from "leaflet";
import { Offcanvas, Tab, Tabs } from "react-bootstrap";

import { AppContext } from "../App";
import { icons } from "../utils/icons";
import { UidPoint } from "../utils/types";
import { LOCKER_ADDR } from "../utils/const";
import { marker2point } from "../utils/convs";
import { ensureMarkerBounds } from "../utils/funcs";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { erase as searchErase, setSource, setTarget, } from "../features/searchSlice";
import { erase as keywordsErase, } from "../features/keywordsSlice";
import EraseButton from "./Search/EraseButton";
import { CountInput } from "./Search/CountInput";
import { DistanceInput } from "./Search/DistanceInput";
import { KeywordsInput } from "./Search/KeywordsInput";
import { LockerButton, SteadyMarkerLine } from "./PanelControl";

function SearchHead(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const leaflet = useContext(AppContext).leaflet;

  const handleErase = () => {

    dispatch(searchErase());
    dispatch(keywordsErase());

    leaflet.markers.forEach(marker => { leaflet.map?.removeLayer(marker); });
    leaflet.markers.clear();
  }

  return (
    <Offcanvas.Header closeButton>
      <LockerButton onClick={() => navigate(LOCKER_ADDR)} />
      <EraseButton onClick={handleErase} />
    </Offcanvas.Header>
  );
}

function SearchBody(): JSX.Element {

  const dispatch = useAppDispatch();
  const { leaflet } = useContext(AppContext);

  const source = useAppSelector(state => state.search.source);
  const target = useAppSelector(state => state.search.target);

  const handlePoint = (point: UidPoint | undefined, view: string, func: (point: UidPoint) => void): void => {
    if (!point) {
      const c = leaflet.uid++;
      const m = L.marker(leaflet.map!.getCenter(), { icon: (icons as any)[view], draggable: true }).addTo(leaflet.map!);
      leaflet.markers.set(c, m);

      m.addEventListener("dragend", () => {
        ensureMarkerBounds(m);
        func(marker2point(m, c));
      });

      point = marker2point(m, c);
      func(point);
    }

    leaflet.map?.flyTo(new LatLng(point.lat, point.lon), leaflet.map.getZoom());
  };

  return (
    <Offcanvas.Body>
      <SteadyMarkerLine kind="source" point={source} onClick={() => handlePoint(source, "source", (point: UidPoint) => { dispatch(setSource(point)) })} />
      <SteadyMarkerLine kind="target" point={target} onClick={() => handlePoint(target, "target", (point: UidPoint) => { dispatch(setTarget(point)) })} />
      <Tabs defaultActiveKey="discover" fill className="mb-4 mt-4">
        <Tab eventKey="discover" title="Discover">
          <CountInput />
          <DistanceInput />
          <KeywordsInput />
        </Tab>
        <Tab eventKey="navigate" title="Navigate">
        </Tab>
      </Tabs>
    </Offcanvas.Body>
  );
}

export default function SearchPanel(): JSX.Element {

  return (
    <>
      <SearchHead />
      <SearchBody />
    </>
  );
}
