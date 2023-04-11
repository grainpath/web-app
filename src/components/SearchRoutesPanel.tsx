import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Link, Typography } from "@mui/material";
import { Search, SwapVert } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { AppContext } from "../App";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { setLoading } from "../features/panelSlice";
import { setSource, setTarget, setDistance } from "../features/searchRoutesSlice";
import { point2place, point2text } from "../utils/helpers";
import { GrainPathFetcher } from "../utils/grainpath";
import {
  FreeSourceListItem,
  FreeTargetListItem,
  RemovableSourceListItem,
  RemovableTargetListItem
} from "./shared-list-items";
import { SelectMaybePlaceModal } from "./shared-modals";
import { LogoCloseMenu, MainMenu } from "./shared-menus";
import DiscoverKeywordsInput from "./Discover/DiscoverKeywordsInput";
import DiscoverDistanceSlider from "./Discover/DiscoverDistanceSlider";
import { setResult } from "../features/resultRoutesSlice";
import { RESULT_ROUTES_ADDR } from "../domain/routing";

export default function SearchRoutesPanel(): JSX.Element {

  const [modS, setModS] = useState(false);
  const [modT, setModT] = useState(false);

  const nav = useNavigate();
  const map = useContext(AppContext).map;

  const dispatch = useAppDispatch();
  const { source, target, distance, conditions } = useAppSelector(state => state.searchRoutes);

  useEffect(() => {
    map?.clear();

    if (source) {
      (source.placeId || source.grainId)
        ? (map?.addSource(source, false))
        : (map?.addSource(source, true).withDrag(pt => dispatch(setSource(point2place(pt)))));
    }

    if (target) {
      (target.placeId || target.grainId)
        ? (map?.addTarget(target, false))
        : (map?.addTarget(target, true).withDrag(pt => dispatch(setTarget(point2place(pt)))));
    }
  }, [nav, map, dispatch, source, target]);

  const swap = () => { dispatch(setSource(target)); dispatch(setTarget(source)); }

  const { loading } = useAppSelector(state => state.panel);

  const load = () => {
    new Promise((res, _) => res(setLoading(true)))
      .then(() => GrainPathFetcher.fetchRoutes({
        source: source!,
        target: target!,
        distance: distance * 1000.0,
        conditions: conditions.map((c) => {
          return { keyword: c.keyword, filters: c.filters };
        })
      }))
      .then((res) => {
        if (res) {
          dispatch(setResult(res));
          nav(RESULT_ROUTES_ADDR);
        }
      })
      .finally(() => { setLoading(false); });
  };

  return (
    <Box>
      <LogoCloseMenu logo={() => {}} />
      <MainMenu value={0} />
      <Box>
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1.0rem" }}>
              { (source)
                ? <RemovableSourceListItem onMarker={() => { map?.flyTo(source); }} label={point2text(source.location)} onDelete={() => { dispatch(setSource(undefined)); }} />
                : <FreeSourceListItem onClick={() => { setModS(true); }} />
              }
              { (target)
                ? <RemovableTargetListItem onMarker={() => { map?.flyTo(target); }} label={point2text(target.location)} onDelete={() => { dispatch(setTarget(undefined)); }} />
                : <FreeTargetListItem onClick={() => { setModT(true); }} />
              }
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button sx={{ mt: 1, textTransform: "none" }} startIcon={<SwapVert />} size="small" onClick={() => { swap(); }}>Swap points</Button>
          </Box>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography>
            Maximum walking distance (in <Link href="https://en.wikipedia.org/wiki/Kilometre" rel="noopener noreferrer" target="_blank" title="kilometres" underline="hover">km</Link>):
          </Typography>
          <Box sx={{ mt: 2 }}>
            <DiscoverDistanceSlider
              max={30}
              seq={[ 5, 10, 15, 20, 25 ]}
              step={0.2}
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
            loading={loading}
            disabled={!source || !target}
          >
            <span>Discover</span>
          </LoadingButton>
        </Box>
        { modS && <SelectMaybePlaceModal kind="source" hide={() => setModS(false)} func={(place) => dispatch(setSource(place))} /> }
        { modT && <SelectMaybePlaceModal kind="target" hide={() => setModT(false)} func={(place) => dispatch(setTarget(place))} /> }
      </Box>
    </Box>
  );
}
