import L from "leaflet";
import { LatLng } from "leaflet";
import { useContext, useEffect } from "react";
import { Alert, Form, Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import { useAppSelector } from "../features/hooks";
import { SEARCH_ADDR, LOCKER_ADDR } from "../utils/routing";
import { Result } from "../utils/grainpath";
import { SearchButton, LockerButton } from "./PanelPrimitives";

function ResultHead(): JSX.Element {

  const navigate = useNavigate();

  return (
    <Offcanvas.Header closeButton>
      <SearchButton onClick={() => navigate(SEARCH_ADDR)} />
      <LockerButton onClick={() => navigate(LOCKER_ADDR)} />
    </Offcanvas.Header>
  );
}

type ResultContentProps = { result: Result | null };

function ResultContent({ result }: ResultContentProps): JSX.Element {
  return (
    <>
      <Form.Group>
        <Form.Label>Distance: {(result!.distance! / 1000.0).toFixed(2)} km</Form.Label>
        <Form.Label>Duration: {(result!.duration! / 60.0).toFixed(0)} min</Form.Label>
      </Form.Group>
    </>
  );
}

function ResultBody(): JSX.Element {

  // const layer = useContext(AppContext).leaflet.map!.getLayer();
  const result = useAppSelector(state => state.result);

  useEffect(() => {
    if (result) {
      // L.polyline(result!.polyline!.map(point => new LatLng(point.lat, point.lon))).addTo(layer);
    }
  });

  return (
    <Offcanvas.Body>
      (!result) ? <Alert></Alert> : <ResultContent result={result} />
    </Offcanvas.Body>
  );
}

export default function ResultPanel(): JSX.Element {

  return (
    <>
      <ResultHead />
      <ResultBody />
    </>
  );
}
