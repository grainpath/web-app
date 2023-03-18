import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import { setCenter } from "../../features/discoverSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { point2place } from "../../utils/general";
import { PLACES_ADDR } from "../../utils/routing";
import { FreeCenterListItem } from "../shared-list-items";
import { DistanceInput } from "./DistanceInput";
import SelectMaybePlaceModal from "./SelectMaybePlaceModal";

export default function DiscoverPlacesSection(): JSX.Element {

  const [modC, setModC] = useState(false);

  const nav = useNavigate();
  const map = useContext(AppContext).map!;

  const dispatch = useAppDispatch();
  const center = useAppSelector(state => state.discover.center);
  const radius = useAppSelector(state => state.discover.radius);

  useEffect(() => {
    const link = (id: string) => nav(PLACES_ADDR + `/${id}`);
    map.clear();

    if (center) {
      (center.id)
        ? (map.addStored({ ...center, id: center.id }).withLink(link, center.id))
        : (map.addCustom(center, true).withDrag(pt => dispatch(setCenter(point2place(pt)))));

      map.drawCircle(center.location, radius * 1000.0);
    }
  }, [map, nav, dispatch, center, radius]);

  return (
    <>
      <div className="mt-4">
        { (center)
          ? <></>
          : <FreeCenterListItem onClick={() => { setModC(true); }} />
        }
      </div>
      <DistanceInput />
      { modC && <SelectMaybePlaceModal kind="center" hide={() => { setModC(false); }} func={(place) => { dispatch(setCenter(place)) }} /> }
    </>
  );
}
