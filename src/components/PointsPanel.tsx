import { useEffect, useState } from "react";
import { Alert, Offcanvas, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { LOCKER_ADDR, SEARCH_ADDR } from "../utils/general";
import { HeavyGrain, grainpathFetch, GRAINPATH_HEAVY_URL } from "../utils/grainpath";
import { useAppSelector } from "../features/hooks";
import { appendList } from "../features/pointsSlice";
import { centerContainerProps, LockerButton, SearchButton } from "./PanelPrimitives";
import HeavyGrainView from "./Points/HeavyGrainView";

/**
 * Fetches and shows HeavyGrain by @b id, non-existent entities are reported.
 */
export default function PointsPanel(): JSX.Element {

  const { id } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const list = useAppSelector(state => state.points.list);

  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState<HeavyGrain | undefined>(undefined);

  useEffect(() => {

    let ignore = false;

    const fetcher = async () => {
      let next;
      const prev = list.find((grain) => grain.id === id);

      try {
        if (!prev) {
          setLoading(true);
          const res = await grainpathFetch(GRAINPATH_HEAVY_URL, { id: id });

          switch (res.status) {
            case 200: next = (await res.json()) as HeavyGrain; break;
            case 404: break;
            default:  throw new Error("[Heavy Error] " + res.status + ": " + res.statusText);
          }
        }
      }
      catch (ex) { alert(ex); }

      if (!ignore) {
        setLoading(false);
        setCurrent(prev ?? next);
        if (!prev && next) { dispatch(appendList(next)); };
      }
    };
    fetcher();
    return () => { ignore = true; };
  }, [id, list, dispatch]);

  const view = (current)
    ? <HeavyGrainView grain={current} />
    : <Alert variant="warning">Point <b>{id}</b> has not been found.</Alert>;

  return (
    <>
      <Offcanvas.Header closeButton>
        <SearchButton onClick={() => navigate(SEARCH_ADDR)} />
        <LockerButton onClick={() => navigate(LOCKER_ADDR)} />
      </Offcanvas.Header>
      <Offcanvas.Body>
        { loading ? <div {...centerContainerProps}><Spinner animation="grow" role="status" /></div> : view }
      </Offcanvas.Body>
    </>
  );
}
