import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Link,
  Stack,
  Typography
} from "@mui/material";
import { Search, SwapVert } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { AppContext } from "../App";
import { RESULT_ROUTES_ADDR } from "../domain/routing";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { setBlock } from "../features/panelSlice";
import {
  clear,
  deleteCondition,
  insertCondition,
  setDistance,
  setSource,
  setTarget,
} from "../features/searchRoutesSlice";
import { point2place } from "../utils/helpers";
import { GrainPathFetcher } from "../utils/grainpath";
import {
  FreeSourceListItem,
  FreeTargetListItem,
  RemovableSourceListItem,
  RemovableTargetListItem
} from "./shared-list-items";
import { SelectPlaceModal } from "./shared-modals";
import { LogoCloseMenu, MainMenu } from "./shared-menus";
import KeywordsBox from "./Search/KeywordsBox";
import DistanceSlider from "./Search/DistanceSlider";
import { setResult } from "../features/resultRoutesSlice";

export default function SearchRoutesPanel(): JSX.Element {

  const [modS, setModS] = useState(false);
  const [modT, setModT] = useState(false);

  const navigate = useNavigate();
  const { map } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const { block } = useAppSelector(state => state.panel);
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
  }, [map, navigate, dispatch, source, target]);

  const swap = () => { dispatch(setSource(target)); dispatch(setTarget(source)); }

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
        dispatch(setResult(res));
        navigate(RESULT_ROUTES_ADDR); console.log(res);
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
              ? (<RemovableSourceListItem
                  onMarker={() => { map?.flyTo(source); }}
                  label={source.name}
                  onDelete={() => { dispatch(setSource(undefined)); }}
                />)
              : (<FreeSourceListItem onClick={() => { setModS(true); }} />)
            }
            {(target)
              ? (<RemovableTargetListItem
                  onMarker={() => { map?.flyTo(target); }}
                  label={target.name}
                  onDelete={() => { dispatch(setTarget(undefined)); }}
                />)
              : (<FreeTargetListItem onClick={() => { setModT(true); }} />)
            }
          </Stack>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button sx={{ mt: 1, textTransform: "none" }} startIcon={<SwapVert />} size="small" onClick={() => { swap(); }}>Swap points</Button>
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
          dispatch={(value) => { dispatch(setDistance(value)); }}
        />
        <Typography>
          Visit places satisfying the following conditions:
        </Typography>
        <KeywordsBox
          conditions={conditions}
          deleteCondition={(i) => dispatch(deleteCondition(i))}
          insertCondition={(condition, i) => dispatch(insertCondition({ condition: condition, i: i }))}
        />
        <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
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
            title={"Discover a route"}
            onClick={() => { load(); }}
            loading={block}
            disabled={!source || !target || !(conditions.length > 0)}
          >
            <span>Discover</span>
          </LoadingButton>
        </Box>
        {modS &&
          <SelectPlaceModal
            kind="source"
            onHide={() => setModS(false)}
            func={(place) => dispatch(setSource(place))}
          />
        }
        {modT &&
          <SelectPlaceModal
            kind="target"
            onHide={() => setModT(false)}
            func={(place) => dispatch(setTarget(place))}
          />
        }
      </Stack>
    </Box>
  );
}
