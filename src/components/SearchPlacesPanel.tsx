import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Link, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Search } from "@mui/icons-material";
import { AppContext } from "../App";
import { UiPlace } from "../domain/types";
import { RESULT_PLACES_ADDR } from "../domain/routing";
import { GrainPathFetcher } from "../utils/grainpath";
import { point2place, point2text } from "../utils/helpers";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { setLoading } from "../features/panelSlice";
import { setResult } from "../features/resultPlacesSlice";
import { setCenter, setRadius } from "../features/searchPlacesSlice";
import { LogoCloseMenu, MainMenu } from "./shared-menus";
import { SelectMaybePlaceModal } from "./shared-modals";
import {
  FreeCenterListItem,
  RemovableCustomListItem
} from "./shared-list-items";
import DiscoverKeywordsInput from "./Discover/DiscoverKeywordsInput";
import DiscoverDistanceSlider from "./Discover/DiscoverDistanceSlider";

export default function SearchPlacesPanel(): JSX.Element {

  const [modC, setModC] = useState(false);

  const nav = useNavigate();
  const map = useContext(AppContext).map;

  const dispatch = useAppDispatch();
  const { center, radius, conditions } = useAppSelector(state => state.searchPlaces);

  const meters = radius * 1000;

  useEffect(() => {
    map?.clear();

    if (center) {
      (center.placeId || center.grainId)
        ? (map?.addStored(center))
        : (map?.addCustom(center, true).withDrag(pt => dispatch(setCenter(point2place(pt)))).withCirc(map, meters));

      map?.drawCircle(center.location, meters);
    }
  }, [map, nav, dispatch, center, meters]);

  const props = (place: UiPlace) => {
    return {
      onMarker: () => { map?.flyTo(place); },
      onDelete: () => { dispatch(setCenter(undefined)); }
    };
  };

  const { loading } = useAppSelector(state => state.panel);

  const load = () => {
    new Promise((res, _) => res(setLoading(true)))
      .then(() => GrainPathFetcher.fetchPlaces({
        center: center!,
        radius: meters,
        conditions: conditions.map((c) => {
          return { keyword: c.keyword, filters: c.filters };
        })
      }))
      .then((res) => {
        if (res) {
          dispatch(setResult(res));
          nav(RESULT_PLACES_ADDR);
        }
      })
      .finally(() => { setLoading(false); });
  };

  return (
    <Box>
      <LogoCloseMenu logo={() => { }} />
      <MainMenu value={1} />
      <Box>
        <Box sx={{ mt: 4 }}>
          { (center)
            ? <RemovableCustomListItem {...props(center)} label={point2text(center.location)} />
            : <FreeCenterListItem onClick={() => { setModC(true); }} />
          }
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography>
            Radius of a circle around a point (in <Link href="https://en.wikipedia.org/wiki/Kilometre" rel="noopener noreferrer" target="_blank" title="kilometres" underline="hover">km</Link>)
          </Typography>
          <Box sx={{ mt: 2 }}>
            <DiscoverDistanceSlider
              max={12}
              seq={[ 2, 4, 6, 8, 10 ]}
              step={0.1}
              distance={radius}
              dispatch={(value) => { dispatch(setRadius(value)); }}
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
            title={"Discover places"}
            onClick={() => { load(); }}
            loading={loading}
            disabled={!center}
          >
            <span>Discover</span>
          </LoadingButton>
        </Box>
        {modC &&
          <SelectMaybePlaceModal
            kind="center"
            hide={() => { setModC(false); }}
            func={(place) => { dispatch(setCenter(place)) }}
          />
        }
      </Box>
    </Box>
  );
}
