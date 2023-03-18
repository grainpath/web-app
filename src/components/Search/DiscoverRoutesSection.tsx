import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Link, Typography } from "@mui/material";
import { Search, SwapVert } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { AppContext } from "../../App";
import { PLACES_ADDR } from "../../utils/routing";
import { point2place, point2text } from "../../utils/general";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { setSource, setTarget, setDistance } from "../../features/discoverSlice";
import {
  FreeSourceListItem,
  FreeTargetListItem,
  RemovableSourceListItem,
  RemovableTargetListItem
} from "../shared-list-items";
import DiscoverKeywordsInput from "./DiscoverKeywordsInput";
import SelectMaybePlaceModal from "./SelectMaybePlaceModal";
import DiscoverDistanceSlider from "./DiscoverDistanceSlider";

export default function RoutesSection(): JSX.Element {

  const [modS, setModS] = useState(false);
  const [modT, setModT] = useState(false);

  const nav = useNavigate();
  const map = useContext(AppContext).map!;

  const dispatch = useAppDispatch();
  const { mod, disabled, loadRoutes } = useAppSelector(state => state.search);
  const { source, target, distance } = useAppSelector(state => state.discover);

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

  const load = () => {
    // TODO: Implement API call.
  };

  return (
    <Box>
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "1.0rem" }}>
            { (source)
              ? <RemovableSourceListItem onMarker={() => { map.flyTo(source); }} label={point2text(source.location)} onDelete={() => { dispatch(setSource(undefined)); }} />
              : <FreeSourceListItem onClick={() => { setModS(true); }} />
            }
            { (target)
              ? <RemovableTargetListItem onMarker={() => { map.flyTo(target); }} label={point2text(target.location)} onDelete={() => { dispatch(setTarget(undefined)); }} />
              : <FreeTargetListItem onClick={() => { setModT(true); }} />
            }
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button sx={{ mt: 1, textTransform: "none" }} startIcon={<SwapVert />} size="small" onClick={() => { swap(); }}>Swap points</Button>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography>
          Distance you are willing to walk (in <Link href="https://en.wikipedia.org/wiki/Kilometre" rel="noopener noreferrer" target="_blank" title="kilometres" underline="hover">km</Link>)
        </Typography>
        <Box sx={{ mt: 2 }}>
          <DiscoverDistanceSlider
            max={30}
            seq={[ 5, 10, 15, 20, 25 ]}
            distance={distance}
            dispatch={(value) => { dispatch(setDistance(value)); }}
          />
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <DiscoverKeywordsInput />
      </Box>
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <LoadingButton
          size="large"
          variant="contained"
          startIcon={<Search />}
          loadingPosition="start"
          title={"Discover a route"}
          onClick={() => { load(); }}
          loading={loadRoutes}
          disabled={(mod && (!source || !target)) || (disabled && !loadRoutes)}
        >
          <span>Discover</span>
        </LoadingButton>
      </Box>
      { modS && <SelectMaybePlaceModal kind="source" hide={() => setModS(false)} func={(place) => dispatch(setSource(place))} /> }
      { modT && <SelectMaybePlaceModal kind="target" hide={() => setModT(false)} func={(place) => dispatch(setTarget(place))} /> }
    </Box>
  );
}
