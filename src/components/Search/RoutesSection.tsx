import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import {
  deleteSource,
  deleteTarget,
  setSource,
  setTarget
} from "../../features/discoverSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { PLACES_ADDR, point2place, point2text } from "../../utils/general";
import { Point } from "../../utils/grainpath";
import { IPin } from "../../utils/interfaces";
import {
  FreeSourceMarkerItem,
  FreeTargetMarkerItem,
  RemovableSourceMarkerItem,
  RemovableTargetMarkerItem
} from "../PanelPrimitives";
import { DistanceInput } from "./DistanceInput";
import SelectMaybePlaceModal from "./SelectPointModal";

export default function RoutesSection(): JSX.Element {

  const [modS, setModS] = useState(false);
  const [modT, setModT] = useState(false);

  const nav = useNavigate();
  const map = useContext(AppContext).leaflet.newmap!;

  const dispatch = useAppDispatch();
  const source = useAppSelector(state => state.discover.source);
  const target = useAppSelector(state => state.discover.target);

  useEffect(() => {
    const handleWith = (pin: IPin, drag: (pt: Point) => void, id?: string): void => {
      id ? pin.withLink(() => nav(PLACES_ADDR + `/${id}`)) : pin.withDrag(drag);
    };

    map.clear();
    if (source) { handleWith(map.addSource(source), (pt) => dispatch(setSource(point2place(pt))), source.id); }
    if (target) { handleWith(map.addTarget(target), (pt) => dispatch(setTarget(point2place(pt))), target.id); }
  }, [nav, map, dispatch, source, target]);

  return (
    <>
      { (source)
        ? <RemovableSourceMarkerItem onMarker={() => {}} label={point2text(source.location)} onDelete={() => { dispatch(deleteSource()); }} />
        : <FreeSourceMarkerItem onMarker={() => { setModS(true); }} />
      }
      { (target)
        ? <RemovableTargetMarkerItem onMarker={() => {}} label={point2text(target.location)} onDelete={() => { dispatch(deleteTarget()); }} />
        : <FreeTargetMarkerItem onMarker={() => { setModT(true); }} />
      }
      <DistanceInput />
      { modS && <SelectMaybePlaceModal hide={() => setModS(false)} func={(place) => dispatch(setSource(place))} /> }
      { modT && <SelectMaybePlaceModal hide={() => setModT(false)} func={(place) => dispatch(setTarget(place))} /> }
    </>
  );
}
