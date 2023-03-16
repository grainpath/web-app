import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as ReactDOMServer from "react-dom/server";
import L, { Icon, LatLng, Marker } from "leaflet";
import { Button, Offcanvas, Tab, Tabs } from "react-bootstrap";
import { AppContext } from "../App";
import { grainpathFetch, GRAINPATH_SHORT_URL, MaybePlace, Point, Result } from "../utils/grainpath";
import { LOCKER_ADDR, point2text, PLACES_ADDR, RESULT_ADDR } from "../utils/general";
import { ensureMarkerBounds } from "../utils/general";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { setMod, setTab } from "../features/searchSlice";
import { setResult } from "../features/resultSlice";
import { deleteSource, setSource, setTarget } from "../features/discoverSlice";
import { appendPlace, deletePlace, replacePlace,  } from "../features/navigateSlice";
import { KeywordsInput } from "./Search/KeywordsInput";
import {
  LockerButton,
  RemovableMarkerLine,
} from "./PanelPrimitives";
import { Grain, Route } from "@mui/icons-material";
import RoutesSection from "./Search/RoutesSection";
import PlacesSection from "./Search/PlacesSection";
import { MaybePlacePopup } from "../utils/leaflet-components";

function SearchHead(): JSX.Element {
  const navigate = useNavigate();

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

  const tab = useAppSelector(state => state.search.tab);
  const mod = useAppSelector(state => state.search.mod);

  const flyTo = (point: Point): void => {
    leaflet.newmap?.getMap().flyTo(new LatLng(point.lat, point.lon), leaflet.newmap?.getMap().getZoom());
  };

  const addDragendEvent = (marker: Marker<Icon<any>>, func: (point: Point) => void): void => {
    marker.addEventListener("dragend", () => {
      ensureMarkerBounds(marker);
      func({ lon: marker.getLatLng().lng, lat: marker.getLatLng().lat });
    });
  };

  const addPoint = useCallback((point: Point, icon: Icon<any>, draggable: boolean): Marker<Icon<any>> => {
    return L.marker(new LatLng(point.lat, point.lon), { icon: icon, draggable: draggable }).addTo(leaflet.newmap!.getLayer());
  }, [leaflet.newmap!.getLayer()]);

  const ensureSequence = useCallback(() => {
    search.sequence = sequence.map((place, i) => {

      const p = ReactDOMServer.renderToString(<MaybePlacePopup place={place} />);
      const m = addPoint(place.location, (!!place.id) ? leaflet.views.tagged : leaflet.views.custom, !place.id).bindPopup(p);

      m.addEventListener("popupopen", () => {
        if (!!place.id) {
          document.getElementById(`popup-${place.id}`)?.addEventListener("click", () => navigate(PLACES_ADDR + `/${place.id}`));
        }
      });
      addDragendEvent(m, (point: Point) => dispatch(replacePlace({place: { name: point2text(point), location: point, keywords: [] } as MaybePlace, i: i})));
      return m;
    });
  }, [addPoint, navigate, dispatch, leaflet.views, search, sequence]);

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

  const variant = (m: boolean) => m ? "primary" : "outline-primary";

  const routes = () => {  };
  const places = () => {  };

  return (
    <Offcanvas.Body>
      <Tabs className="mt-4 mb-4" activeKey={tab} fill onSelect={(key) => { dispatch(setTab(key!)); }}>
        <Tab eventKey="discover" title="Discover">
          <div className="mt-4 mb-4" style={{ display: "flex", width: "100%", justifyContent: "space-evenly" }}>
            <Button variant={variant( mod)} onClick={() => { dispatch(setMod(true));  }}><Route /> Routes</Button>
            <Button variant={variant(!mod)} onClick={() => { dispatch(setMod(false)); }}><Grain /> Places</Button>
          </div>
          { (mod) ? <RoutesSection /> : <PlacesSection /> }
          {/* <RemovableSourceMarkerItem onMarker={() => {}} label="xxx" onDelete={() => {}} />
          <RemovableTargetMarkerItem onMarker={() => {}} label="xxx" onDelete={() => {}} />
          <RemovableKnownMarkerItem onMarker={() => {}} label="xxx" onDelete={() => {}} />
          <RemovableOtherMarkerItem onMarker={() => {}} label="xxx" onDelete={() => {}} /> */}
          <KeywordsInput />
          <div className="mt-4 mb-4" style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="primary" onClick={() => { mod ? routes() : places(); }}>Discover</Button>
          </div>
        </Tab>
        <Tab eventKey="navigate" title="Navigate">
          { sequence.map((g, i) => {
              return <RemovableMarkerLine key={i} kind={(!!g.id ? "tagged" : "custom")} label={g.name}
                onMarker={() => handleSequence(i)} onDelete={() => { dispatch(deletePlace(i)); }} />
            })
          }
          {/* <AddMarkerLine label="Add next point..." onClick={() => { const cnt = getCenter(); dispatch(appendPlace({ name: point2view(cnt), location: cnt, keywords: [] } as LightPlace)); }} /> */}
          <div className="mt-4 mb-4" style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="primary">Navigate</Button>
          </div>
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
