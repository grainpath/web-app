import { useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as ReactDOMServer from "react-dom/server";
import L, { Icon, LatLng, Marker } from "leaflet";
import { Button, Offcanvas, Tab, Tabs } from "react-bootstrap";

import { AppContext } from "../App";
import { Point } from "../domain/types";
import { LOCKER_ADDR, POINTS_ADDR } from "../utils/constants";
import { ensureLatLngBounds, ensureMarkerBounds, latLng2point } from "../utils/functions";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { appendPoint, erase, setSource, setTarget, updatePoint } from "../features/searchSlice";
import EraseButton from "./Search/EraseButton";
import { CountInput } from "./Search/CountInput";
import { DistanceInput } from "./Search/DistanceInput";
import { KeywordsInput } from "./Search/KeywordsInput";
import { LightGrainPopup, LockerButton, SteadyMarkerLine } from "./PanelControl";

function SearchHead(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <Offcanvas.Header closeButton>
      <LockerButton onClick={() => navigate(LOCKER_ADDR)} />
      <EraseButton onClick={() => dispatch(erase())} />
    </Offcanvas.Header>
  );
}

function SearchBody(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { search, leaflet } = useContext(AppContext);

  const source = useAppSelector(state => state.search.source);
  const target = useAppSelector(state => state.search.target);
  const sequence = useAppSelector(state => state.search.sequence);

  const flyTo = (point: Point): void => {
    leaflet.map?.flyTo(new LatLng(point.lat, point.lon), leaflet.map?.getZoom());
  };

  const getCenter = (): Point => {
    return latLng2point(ensureLatLngBounds(leaflet.map!.getCenter()));
  }

  const addDragendEvent = (marker: Marker<Icon<any>>, func: (point: Point) => void): void => {
    marker.addEventListener("dragend", () => {
      ensureMarkerBounds(marker);
      func({ lon: marker.getLatLng().lng, lat: marker.getLatLng().lat });
    })
  };

  const addPoint = useCallback((point: Point, icon: Icon<any>, draggable: boolean): Marker<Icon<any>> => {
    return L.marker(new LatLng(point.lat, point.lon), { icon: icon, draggable: draggable }).addTo(leaflet.layerGroup!);
  }, [leaflet.layerGroup]);

  const ensureSource = useCallback(() => {
    if (!!source) {
      const m = addPoint(source, leaflet.views.source, true);
      addDragendEvent(m, (point: Point) => dispatch(setSource(point)));
    }
  }, [addPoint, dispatch, source, leaflet.views]);

  const ensureTarget = useCallback(() => {
    if (!!target) {
      const m = addPoint(target, leaflet.views.target, true);
      addDragendEvent(m, (point: Point) => dispatch(setTarget(point)));
    }
  }, [addPoint, dispatch, target, leaflet.views]);

  const ensureSequence = useCallback(() => {
    search.sequence = sequence.map((g, i) => {

      const p = ReactDOMServer.renderToString(<LightGrainPopup grain={g} />);
      const m = addPoint(g.location, (!!g.id) ? leaflet.views.tagged : leaflet.views.custom, !g.id).bindPopup(p);

      m.addEventListener("popupopen", () => {
        if (!!g.id) {
          document.getElementById(`popup-${g.id}`)?.addEventListener("click", () => navigate(POINTS_ADDR + `/${g.id}`));
        }
      });
      addDragendEvent(m, (point: Point) => dispatch(updatePoint({point: point, i: i})));
      return m;
    });
  }, [addPoint, navigate, dispatch, leaflet.views, search, sequence]);

  // construct fresh map layout from the state

  useEffect(() => {
    leaflet.layerGroup?.clearLayers();
    ensureSource();
    ensureTarget();
    ensureSequence();
  }, [leaflet.layerGroup, ensureSource, ensureTarget, ensureSequence]);

  // button handlers

  const handleBoundary = (point: Point | undefined, func: (point: Point) => void): void => {
    if (!point) {
      point = getCenter();
      func(point);
    }
    flyTo(point);
  };

  const handleSequence = (i: number): void => {
    flyTo(sequence[i].location);
    search.sequence[i].openPopup();
  };

  return (
    <Offcanvas.Body>
      <SteadyMarkerLine kind="source" point={source} onClick={() => handleBoundary(source, (point) => dispatch(setSource(point)))} />
      <SteadyMarkerLine kind="target" point={target} onClick={() => handleBoundary(target, (point) => dispatch(setTarget(point)))} />
      <Tabs defaultActiveKey="discover" fill className="mb-4 mt-4">
        <Tab eventKey="discover" title="Discover">
          <CountInput />
          <DistanceInput />
          <KeywordsInput />
        </Tab>
        <Tab eventKey="navigate" title="Navigate">
          {
            sequence.map((g, i) => <Button key={i} onClick={() => handleSequence(i)}>{i}</Button>)
          }
          <Button onClick={() => { dispatch(appendPoint({ location: getCenter(), keywords: [], tags: {} })); }} />
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
