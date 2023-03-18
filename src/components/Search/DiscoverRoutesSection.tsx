import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import {
  setSource,
  setTarget
} from "../../features/discoverSlice";
import { PLACES_ADDR } from "../../utils/routing";
import { point2place, point2text } from "../../utils/general";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import {
  FreeSourceListItem,
  FreeTargetListItem,
  RemovableSourceListItem,
  RemovableTargetListItem
} from "../shared-list-items";
import { DistanceInput } from "./DistanceInput";
import SelectMaybePlaceModal from "./SelectMaybePlaceModal";
import { IconButton, Typography } from "@mui/material";
import { Info, SwapVert } from "@mui/icons-material";

export default function RoutesSection(): JSX.Element {

  const [modS, setModS] = useState(false);
  const [modT, setModT] = useState(false);

  const nav = useNavigate();
  const map = useContext(AppContext).map!;

  const dispatch = useAppDispatch();
  const source = useAppSelector(state => state.discover.source);
  const target = useAppSelector(state => state.discover.target);

  useEffect(() => {
    const link = (id: string) => nav(PLACES_ADDR + `/${id}`);
    map.clear();

    if (source) {
      (source.id)
        ? (map.addSource(source, false).withLink(link, source.id))
        : (map.addSource(source, true).withDrag(pt => dispatch(setSource(point2place(pt)))));
    }
    if (target) {
      (target.id)
        ? (map.addTarget(target, false).withLink(link, target.id))
        : (map.addTarget(target, true).withDrag(pt => dispatch(setTarget(point2place(pt)))));
    }
  }, [nav, map, dispatch, source, target]);

  const swap = () => { dispatch(setSource(target)); dispatch(setTarget(source)); }

  return (
    <>
      <div className="mt-4" style={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
        <Typography>
          Visit interesting places with features.<sup><Info fontSize="small" /></sup>
        </Typography>
      </div>
      <div>
        <div className="mt-3">
          { (source)
            ? <RemovableSourceListItem onMarker={() => { map.flyTo(source); }} label={point2text(source.location)} onDelete={() => { dispatch(setSource(undefined)); }} />
            : <FreeSourceListItem onClick={() => { setModS(true); }} />
          }
        </div>
        <div className="mt-1" style={{ display: "flex", justifyContent: "center" }}>
          <IconButton size="small" onClick={() => { swap(); }}><SwapVert fontSize="inherit" /></IconButton>
        </div>
        <div>
          { (target)
            ? <RemovableTargetListItem onMarker={() => { map.flyTo(target); }} label={point2text(target.location)} onDelete={() => { dispatch(setTarget(undefined)); }} />
            : <FreeTargetListItem onClick={() => { setModT(true); }} />
          }
        </div>
      </div>
      <DistanceInput />
      { modS && <SelectMaybePlaceModal kind="source" hide={() => setModS(false)} func={(place) => dispatch(setSource(place))} /> }
      { modT && <SelectMaybePlaceModal kind="target" hide={() => setModT(false)} func={(place) => dispatch(setTarget(place))} /> }
    </>
  );
}
