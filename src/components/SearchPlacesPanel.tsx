import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Link,
  Stack,
  Typography
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { AppContext } from "../App";
import { RESULT_PLACES_ADDR } from "../domain/routing";
import { GrainPathFetcher } from "../utils/grainpath";
import { point2place } from "../utils/helpers";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { setBlock } from "../features/panelSlice";
import { clear } from "../features/searchPlacesSlice";
import { setResultPlaces } from "../features/resultPlacesSlice";
import {
  deleteCondition,
  insertCondition,
  setCenter,
  setRadius
} from "../features/searchPlacesSlice";
import { SelectPlaceModal } from "./shared-modals";
import { LogoCloseMenu, MainMenu } from "./shared-menus";
import {
  FreePlaceListItem,
  RemovablePlaceListItem
} from "./shared-list-items";
import DistanceSlider from "./Search/DistanceSlider";
import KeywordsBox from "./Search/KeywordsBox";
import BottomButtons from "./Search/BottomButtons";

export default function SearchPlacesPanel(): JSX.Element {

  const [modC, setModC] = useState(false);

  const navigate = useNavigate();
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
  }, [map, navigate, dispatch, center, radius]);

  const load = () => {
    new Promise<void>((res, _) => { dispatch(setBlock(true)); res(); })
      .then(() => GrainPathFetcher.fetchPlaces({
        center: center!,
        radius: radius,
        conditions: conditions.map((c) => {
          return { keyword: c.keyword, filters: c.filters };
        })
      }))
      .then((res) => {
        dispatch(setResultPlaces(res));
        navigate(RESULT_PLACES_ADDR);
      })
      .catch((ex) => { alert(ex); })
      .finally(() => { dispatch(setBlock(false)); });
  };

  return (
    <Box>
      <LogoCloseMenu onLogo={() => { }} />
      <MainMenu panel={1} />
      <Stack direction="column" gap={4} sx={{ mx: 2, my: 4 }}>
        <Box>
          <Typography>Find places around the center point:</Typography>
        </Box>
        <Box>
          {(center)
            ? <RemovablePlaceListItem
                kind={center.placeId ? "stored" : "custom"}
                label={center.name}
                onPlace={() => { map?.flyTo(center); }}
                onDelete={() => { dispatch(setCenter(undefined)); }}
              />
            : <FreePlaceListItem
                kind="center"
                label="Select point..."
                onPlace={() => { setModC(true); }}
              />
          }
        </Box>
        <Box>
          <Typography>
            At a distance at most (in <Link href="https://en.wikipedia.org/wiki/Kilometre" rel="noopener noreferrer" target="_blank" title="kilometres" underline="hover">km</Link>):
          </Typography>
        </Box>
        <Box>
          <DistanceSlider
            max={12}
            seq={[ 2, 4, 6, 8, 10 ]}
            step={0.1}
            distance={radius}
            dispatch={(value) => { dispatch(setRadius(value)); }}
          />
        </Box>
        <Typography>
          Satisfying the following conditions:
        </Typography>
        <KeywordsBox
          conditions={conditions}
          deleteCondition={(i) => dispatch(deleteCondition(i))}
          insertCondition={(condition, i) => dispatch(insertCondition({ condition: condition, i: i }))}
        />
        <BottomButtons
          disabled={!center || !(conditions.length > 0)}
          onClear={() => { dispatch(clear()); }}
          onSearch={() => { load(); }}
        />
        {modC &&
          <SelectPlaceModal
            kind="center"
            onHide={() => { setModC(false); }}
            onSelect={(place) => { dispatch(setCenter(place)) }}
          />
        }
      </Stack>
    </Box>
  );
}
