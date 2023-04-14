import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Link, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { AppContext } from "../App";
import { RESULT_PLACES_ADDR } from "../domain/routing";
import { GrainPathFetcher } from "../utils/grainpath";
import { point2place } from "../utils/helpers";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { setBlock } from "../features/panelSlice";
import { setResult } from "../features/resultPlacesSlice";
import {
  deleteCondition,
  insertCondition,
  setCenter,
  setRadius
} from "../features/searchPlacesSlice";
import { SelectPlaceModal } from "./shared-modals";
import { LogoCloseMenu, MainMenu } from "./shared-menus";
import {
  FreeCenterListItem,
  RemovablePinListItem
} from "./shared-list-items";
import KeywordsBox from "./Search/KeywordsBox";
import DistanceSlider from "./Search/DistanceSlider";
import { clear } from "../features/searchPlacesSlice";

export default function SearchPlacesPanel(): JSX.Element {

  const [modC, setModC] = useState(false);

  const nav = useNavigate();
  const map = useContext(AppContext).map;

  const dispatch = useAppDispatch();
  const { center, radius, conditions } = useAppSelector(state => state.searchPlaces);

  useEffect(() => {
    map?.clear();
    const meters = radius * 1000;

    if (center) {
      (center.placeId || center.grainId)
        ? (map?.addStored(center))
        : (map?.addCustom(center, true).withDrag(pt => dispatch(setCenter(point2place(pt)))).withCirc(map, meters));

      map?.drawCircle(center.location, meters);
    }
  }, [map, nav, dispatch, center, radius]);

  const { block } = useAppSelector(state => state.panel);

  const load = () => {
    new Promise((res, _) => res(setBlock(true)))
      .then(() => GrainPathFetcher.fetchPlaces({
        center: center!,
        radius: radius,
        conditions: conditions.map((c) => {
          return { keyword: c.keyword, filters: c.filters };
        })
      }))
      .then((res) => {
        dispatch(setResult(res));
        nav(RESULT_PLACES_ADDR);
      })
      .catch((ex) => alert(ex))
      .finally(() => { setBlock(false); });
  };

  return (
    <Box>
      <LogoCloseMenu onLogo={() => { }} />
      <MainMenu value={1} />
      <Box sx={{ mx: 2 }}>
        <Box sx={{ mt: 4 }}>
          { (center)
            ? <RemovablePinListItem
                kind={center.placeId ? "stored" : "custom"}
                onMarker={() => { map?.flyTo(center); }}
                label={center.name}
                onDelete={() => { dispatch(setCenter(undefined)); }}
            />
            : <FreeCenterListItem onClick={() => { setModC(true); }} />
          }
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography>
            Radius of a circle around a point (in <Link href="https://en.wikipedia.org/wiki/Kilometre" rel="noopener noreferrer" target="_blank" title="kilometres" underline="hover">km</Link>):
          </Typography>
          <Box sx={{ mt: 4 }}>
            <DistanceSlider
              max={12}
              seq={[ 2, 4, 6, 8, 10 ]}
              step={0.1}
              distance={radius}
              dispatch={(value) => { dispatch(setRadius(value)); }}
            />
          </Box>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography>Find places satisfying the following conditions:</Typography>
        </Box>
        <Box sx={{ mt: 4 }}>
          <KeywordsBox
            conditions={conditions}
            deleteCondition={(i) => dispatch(deleteCondition(i))}
            insertCondition={(condition, i) => dispatch(insertCondition({ condition: condition, i: i }))}
          />
        </Box>
        <Box sx={{ mt: 4, display: "flex", justifyContent: "space-evenly" }}>
          <Button
            color="error"
            title="Clear form"
            onClick={() => { dispatch(clear()); }}
          >
            Clear
          </Button>
          <LoadingButton
            size="large"
            variant="contained"
            startIcon={<Search />}
            loadingPosition="start"
            title={"Search places"}
            onClick={() => { load(); }}
            loading={block}
            disabled={!center || !(conditions.length > 0)}
          >
            <span>Search</span>
          </LoadingButton>
        </Box>
        {modC &&
          <SelectPlaceModal
            kind="center"
            onHide={() => { setModC(false); }}
            func={(place) => { dispatch(setCenter(place)) }}
          />
        }
      </Box>
    </Box>
  );
}
