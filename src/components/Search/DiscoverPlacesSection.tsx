import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { AppContext } from "../../App";
import { point2place } from "../../utils/general";
import { PLACES_ADDR } from "../../utils/routing";
import { setCenter, setRadius } from "../../features/discoverSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { FreeCenterListItem } from "../shared-list-items";
import SelectMaybePlaceModal from "./SelectMaybePlaceModal";
import { LoadingButton } from "@mui/lab";
import { Search } from "@mui/icons-material";
import DiscoverKeywordsInput from "./DiscoverKeywordsInput";
import DiscoverDistanceSlider from "./DiscoverDistanceSlider";

export default function DiscoverPlacesSection(): JSX.Element {

  const [modC, setModC] = useState(false);

  const nav = useNavigate();
  const map = useContext(AppContext).map!;

  const dispatch = useAppDispatch();
  const { center, radius } = useAppSelector(state => state.discover);
  const { mod, disabled, loadPlaces } = useAppSelector(state => state.search);

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

  const load = () => {
    // TODO: Implement API call.
  };;

  return (
    <Box>
      <Box sx={{ mt: 4 }}>
        { (center)
          ? <></>
          : <FreeCenterListItem onClick={() => { setModC(true); }} />
        }
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography>
          Radius of a circle around a point (in <a href="https://en.wikipedia.org/wiki/Kilometre" rel="noopener noreferrer" target="_blank" title="kilometres">km</a>)
        </Typography>
        <DiscoverDistanceSlider
          max={15}
          seq={[ 3, 6, 9, 12 ]}
          distance={radius}
          dispatch={(value) => { dispatch(setRadius(value)); }}
        />
      </Box>
      <DiscoverKeywordsInput />
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <LoadingButton
          size="large"
          variant="contained"
          startIcon={<Search />}
          loadingPosition="start"
          title={"Discover places"}
          onClick={() => { load(); }}
          loading={loadPlaces}
          disabled={(!mod && !center) || (disabled && !loadPlaces)}
        >
          <span>Discover</span>
        </LoadingButton>
      </Box>
      { modC && <SelectMaybePlaceModal kind="center" hide={() => { setModC(false); }} func={(place) => { dispatch(setCenter(place)) }} /> }
    </Box>
  );
}
