import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Link,
  Stack,
  Typography
} from "@mui/material";
import { SwapVert } from "@mui/icons-material";
import { AppContext } from "../App";
import { RESULT_ROUTES_ADDR, SEARCH_ROUTES_ADDR } from "../domain/routing";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { setBlock } from "../features/panelSlice";
import {
  clearSearchRoutes,
  deleteSearchRoutesCondition,
  insertSearchRoutesCondition,
  setSearchRoutesDistance,
  setSearchRoutesSource,
  setSearchRoutesTarget,
} from "../features/searchRoutesSlice";
import {
  setResultRoutesBack,
  setResultRoutes
} from "../features/resultRoutesSlice";
import { point2place } from "../utils/helpers";
import { GrainPathFetcher } from "../utils/grainpath";
import {
  FreePlaceListItem,
  RemovablePlaceListItem,
} from "./shared-list-items";
import SelectPlaceModal from "./shared/SelectPlaceModal";
import { LogoCloseMenu, MainMenu } from "./shared-menus";
import DistanceSlider from "./search/DistanceSlider";
import KeywordsBox from "./search/KeywordsBox";
import BottomButtons from "./search/BottomButtons";

export default function SearchRoutesPanel(): JSX.Element {

  const [modS, setModS] = useState(false);
  const [modT, setModT] = useState(false);

  const navigate = useNavigate();
  const { map } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const { source, target, distance, conditions } = useAppSelector(state => state.searchRoutes);

  useEffect(() => {
    map?.clear();

    if (source) {
      (source.placeId || source.grainId)
        ? (map?.addSource(source, false))
        : (map?.addSource(source, true).withDrag(pt => dispatch(setSearchRoutesSource(point2place(pt)))));
    }

    if (target) {
      (target.placeId || target.grainId)
        ? (map?.addTarget(target, false))
        : (map?.addTarget(target, true).withDrag(pt => dispatch(setSearchRoutesTarget(point2place(pt)))));
    }
  }, [map, navigate, dispatch, source, target]);

  const swap = () => { dispatch(setSearchRoutesSource(target)); dispatch(setSearchRoutesTarget(source)); }

  const load = () => {
    new Promise<void>((res, _) => { dispatch(setBlock(true)); res(); })
      .then(() => GrainPathFetcher.fetchRoutes({
        source: source!,
        target: target!,
        distance: distance,
        conditions: conditions.map((c) => {
          return { keyword: c.keyword, filters: c.filters };
        })
      }))
      .then((res) => {
        dispatch(setResultRoutes(res));
        dispatch(setResultRoutesBack(SEARCH_ROUTES_ADDR));
        navigate(RESULT_ROUTES_ADDR);
      })
      .catch((ex) => { alert(ex); })
      .finally(() => { dispatch(setBlock(false)); });
  };

  return (
    <Box>
      <LogoCloseMenu onLogo={() => { }} />
      <MainMenu panel={0} />
      <Stack direction="column" gap={4} sx={{ mx: 2, my: 4 }}>
        <Typography>Find routes between two points:</Typography>
        <Stack direction="column" gap={1}>
          <Stack direction="column" gap={2}>
            {(source)
              ? <RemovablePlaceListItem
                  kind="source"
                  label={source.name}
                  onPlace={() => { map?.flyTo(source); }}
                  onDelete={() => { dispatch(setSearchRoutesSource(undefined)); }}
                />
              : <FreePlaceListItem
                  kind="source"
                  label="Select starting point..."
                  onPlace={() => { setModS(true); }}
                />
            }
            {(target)
              ? <RemovablePlaceListItem
                  kind="target"
                  label={target.name}
                  onPlace={() => { map?.flyTo(target); }}
                  onDelete={() => { dispatch(setSearchRoutesTarget(undefined)); }}
                />
              : <FreePlaceListItem
                  kind="target"
                  label="Select destination..."
                  onPlace={() => { setModT(true); }}
                />
            }
          </Stack>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              size="small"
              startIcon={<SwapVert />}
              onClick={() => { swap(); }}
              sx={{ mt: 1, textTransform: "none" }}
            >
              Swap points
            </Button>
          </Box>
        </Stack>
        <Typography>
          With maximum walking distance (in <Link href="https://en.wikipedia.org/wiki/Kilometre" rel="noopener noreferrer" target="_blank" title="kilometres" underline="hover">km</Link>):
        </Typography>
        <DistanceSlider
          max={30}
          seq={[ 5, 10, 15, 20, 25 ]}
          step={0.2}
          distance={distance}
          dispatch={(value) => { dispatch(setSearchRoutesDistance(value)); }}
        />
        <Typography>
          Visit places satisfying the following conditions:
        </Typography>
        <KeywordsBox
          conditions={conditions}
          deleteCondition={(i) => dispatch(deleteSearchRoutesCondition(i))}
          insertCondition={(condition, i) => dispatch(insertSearchRoutesCondition({ condition: condition, i: i }))}
        />
        <BottomButtons
          disabled={!source || !target || !(conditions.length > 0)}
          onClear={() => { dispatch(clearSearchRoutes()); }}
          onSearch={() => { load(); }}
        />
        {modS &&
          <SelectPlaceModal
            kind="source"
            onHide={() => setModS(false)}
            onSelect={(place) => dispatch(setSearchRoutesSource(place))}
          />
        }
        {modT &&
          <SelectPlaceModal
            kind="target"
            onHide={() => setModT(false)}
            onSelect={(place) => dispatch(setSearchRoutesTarget(place))}
          />
        }
      </Stack>
    </Box>
  );
}
