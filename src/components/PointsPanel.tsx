import { useContext, useEffect, useState } from "react";
import { Alert, Badge, Button, Image, Offcanvas, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import L, { LatLng } from "leaflet";

import { AppContext } from "../App";
import { HeavyGrain } from "../domain/types";
import { point2view } from "../utils/functions";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { appendPoint } from "../features/searchSlice";
import { appendList, setCurr } from "../features/pointsSlice";
import { grainpathFetch, LOCKER_ADDR, SEARCH_ADDR } from "../utils/constants";
import { CenteredContainer, LockerButton, SearchButton } from "./PanelControl";

type HeavyGrainViewProps = {
  grain: HeavyGrain;
};

function HeavyGrainView({ grain }: HeavyGrainViewProps): JSX.Element {

  const opacity = 0.7;
  const point = grain.location;

  const {
    name,
    description,
    image
  } = grain.tags;

  const dispatch = useAppDispatch();
  const sequence = useAppSelector(state => state.search.sequence);

  const leaflet = useContext(AppContext).leaflet;

  useEffect(() => {

    leaflet.layerGroup?.clearLayers();

    const l = new LatLng(point.lat, point.lon);
    L.marker(l, { icon: leaflet.views.tagged, draggable: false }).addTo(leaflet.layerGroup!);

    if (grain.polygon) {
      L.polygon(grain.polygon?.map((point) => new LatLng(point.lat, point.lon)), { color: "green" }).addTo(leaflet.layerGroup!);
    }

    leaflet.map?.flyTo(l, leaflet.map?.getZoom());
  }, [leaflet, point.lon, point.lat, grain.polygon]);

  const enlist = () => {
    dispatch(appendPoint({ id: grain.id, location: point, keywords: grain.keywords, tags: { name: name } }));
  };

  return (
    <>
      <h4>{name ?? "Noname" }</h4>
      <hr style={{ opacity: opacity, margin: "0.5rem 0" }}/>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <small style={{ opacity: opacity }}>{point2view(point)}</small>
      </div>
      { image &&
        <div>
          <a href={image} rel="noopener noreferrer" target="_blank">
            <Image src={image} className="mt-2 mb-2" style={{ width: "100%" }} rounded />
          </a>
        </div>
      }
      <div className="mt-2 mb-2" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        {
          grain.keywords.map((keyword, i) => <h6><Badge key={i} bg="success" style={{ margin: "0 0.2rem", display: "block" }} pill>{keyword}</Badge></h6>)
        }
      </div>
      { description && <div className="mt-2 mb-2"><small>{description}</small></div> }
      <Button disabled={!!sequence.find((gs) => gs.id === grain.id)} onClick={enlist}>Enlist</Button>
    </>
  );
}

function PointsHead(): JSX.Element {

  const navigate = useNavigate();

  return (
    <Offcanvas.Header closeButton>
      <SearchButton onClick={() => navigate(SEARCH_ADDR)} />
      <LockerButton onClick={() => navigate(LOCKER_ADDR)} />
    </Offcanvas.Header>
  );
}

function PointsBody(): JSX.Element {

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const curr = useAppSelector(state => state.points.curr);
  const list = useAppSelector(state => state.points.list);

  useEffect(() => {

    let ignore = false;

    const fetcher = async () => {
      let cand = list.find((grain) => grain.id === id);

      try {
        setLoading(true);

        if (!cand) {
          const res = await grainpathFetch("/heavy", { id: id });
  
          if (res.ok) {
            cand = (await res.json()) as HeavyGrain;
            if (!!cand) { dispatch(appendList(cand)); }
          }
  
          else if (res.status === 404) { dispatch(setCurr(undefined)); }
          else { throw new Error("[Heavy Error] " + res.status + ": " + res.statusText); }
        }
      }
      catch (ex) { alert(ex); }

      if (!ignore) {
        setLoading(false);
        dispatch(setCurr(cand));
      }
    };
    fetcher();
    return () => { ignore = true; };
  }, [id, list, dispatch, navigate]);

  const view = (curr)
    ? <HeavyGrainView grain={curr} />
    : <Alert variant="warning">Point <b>{id}</b> has not been found.</Alert>;

  return (
    <Offcanvas.Body>
      { loading ? <CenteredContainer element={<Spinner animation="grow" role="status" />} /> : view }
    </Offcanvas.Body>
  );
}

export default function PointsPanel(): JSX.Element {

  return (
    <>
      <PointsHead />
      <PointsBody />
    </>
  );
}
