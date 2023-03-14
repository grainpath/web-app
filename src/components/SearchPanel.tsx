import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as ReactDOMServer from "react-dom/server";
import L, { Icon, LatLng, Marker } from "leaflet";
import { Button, Offcanvas, Tab, Tabs } from "react-bootstrap";
import { AppContext } from "../App";
import { grainpathFetch, GRAINPATH_SHORT_URL, LightPlace, Point, Result } from "../utils/grainpath";
import { LOCKER_ADDR, point2view, PLACES_ADDR, RESULT_ADDR } from "../utils/general";
import { ensureLatLngBounds, ensureMarkerBounds, latLng2point } from "../utils/general";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { setSource, setTarget } from "../features/discoverSlice";
import { appendPlace, deletePlace, replacePlace,  } from "../features/navigateSlice";
import { DistanceInput } from "./Search/DistanceInput";
import { KeywordsInput } from "./Search/KeywordsInput";
import { LightPlacePopup, LockerButton, RemovableMarkerLine, SteadyMarkerLine } from "./PanelPrimitives";
import { setResult } from "../features/resultSlice";

function SearchHead(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <Offcanvas.Header closeButton>
      <LockerButton onClick={() => navigate(LOCKER_ADDR)} />
    </Offcanvas.Header>
  );
}

function SearchBody(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { search, leaflet } = useContext(AppContext);

  const source = useAppSelector(state => state.discover.source);
  const target = useAppSelector(state => state.discover.target);
  const sequence = useAppSelector(state => state.navigate.sequence);

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
      const m = addPoint(source.location, leaflet.views.source, true);
      addDragendEvent(m, (point: Point) => dispatch(setSource({ name: point2view(point), location: point, keywords: [] } as LightPlace)));
    }
  }, [addPoint, dispatch, source, leaflet.views]);

  const ensureTarget = useCallback(() => {
    if (!!target) {
      const m = addPoint(target.location, leaflet.views.target, true);
      addDragendEvent(m, (point: Point) => dispatch(setTarget({ name: point2view(point), location: point, keywords: [] } as LightPlace)));
    }
  }, [addPoint, dispatch, target, leaflet.views]);

  const ensureSequence = useCallback(() => {
    search.sequence = sequence.map((place, i) => {

      const p = ReactDOMServer.renderToString(<LightPlacePopup place={place} />);
      const m = addPoint(place.location, (!!place.id) ? leaflet.views.tagged : leaflet.views.custom, !place.id).bindPopup(p);

      m.addEventListener("popupopen", () => {
        if (!!place.id) {
          document.getElementById(`popup-${place.id}`)?.addEventListener("click", () => navigate(PLACES_ADDR + `/${place.id}`));
        }
      });
      addDragendEvent(m, (point: Point) => dispatch(replacePlace({place: { name: point2view(point), location: point, keywords: [] } as LightPlace, i: i})));
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

  const [comm, setComm] = useState(false);

  const short = async () => {
    try {
      setComm(true);
      const response = await grainpathFetch(GRAINPATH_SHORT_URL, { source: source, target: target, waypoints: sequence.map(place => place.location) });
      const result = (await response.json()) as Result;
      dispatch(setResult(result));
      navigate(RESULT_ADDR);
    }
    finally { setComm(false); }
  };

  return (
    <Offcanvas.Body>
      <SteadyMarkerLine kind="source" label={source ? point2view(source.location) : undefined}
        onMarker={() => handleBoundary(source?.location, (point) => { dispatch(setSource({name: point2view(point), location: point, keywords: []} as LightPlace)); })} />
      <SteadyMarkerLine kind="target" label={target ? point2view(target.location) : undefined}
        onMarker={() => handleBoundary(target?.location, (point) => { dispatch(setTarget({name: point2view(point), location: point, keywords: []} as LightPlace)); })} />
      <Tabs className="mb-4 mt-4" defaultActiveKey="discover" fill>
        <Tab eventKey="discover" title="Discover">
          <DistanceInput />
          <KeywordsInput />
        </Tab>
        <Tab eventKey="navigate" title="Navigate">
          { sequence.map((g, i) => {
              return <RemovableMarkerLine key={i} kind={(!!g.id ? "tagged" : "custom")} label={g.name}
                onMarker={() => handleSequence(i)} onDelete={() => { dispatch(deletePlace(i)); }} />
            })}
          <Button onClick={() => { const cnt = getCenter(); dispatch(appendPlace({ name: point2view(cnt), location: cnt, keywords: [] } as LightPlace)); }}>A</Button>
          <Button onClick={() => { short(); }} disabled={comm}>B</Button>
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
