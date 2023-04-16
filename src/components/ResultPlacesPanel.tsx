import {
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Skeleton,
  Stack,
  Typography
} from "@mui/material";
import { Favorite, Link } from "@mui/icons-material";
import { AppContext } from "../App";
import {
  Place,
  PlacesResult,
  StoredPlace
} from "../domain/types";
import {
  RESULT_PLACES_ADDR,
  SEARCH_PLACES_ADDR
} from "../domain/routing";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { setSelectedFilters } from "../features/resultPlacesSlice";
import { setPlaces, setPlacesLoaded } from "../features/favouritesSlice";
import { BackCloseMenu } from "./shared-menus";
import { MenuPinListItem, SimplePinListItem } from "./shared-list-items";
import ListItemLink from "./Result/ListItemLink";
import PlacesFilter from "./Result/PlacesFilter";

type ResultPlacesSectionProps = {
  result: PlacesResult;
};

function ResultPlacesSection({ result }: ResultPlacesSectionProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { map } = useContext(AppContext);
  const { center, radius, conditions, places: foundPlaces } = result;
  const { places: knownPlaces } = useAppSelector(state => state.favourites);

  const [knownGrains, setKnownGrains] = useState(new Map<string, StoredPlace>());
  const [satConditions, setSatConditions] = useState(new Set<string>());
  const { selectedFilters } = useAppSelector(state => state.resultPlaces);

  // identify known grains in the pile of found places
  useEffect(() => {
    const m = knownPlaces
      .filter(p => !!p.grainId)
      .reduce((m, v) => { return m.set(v.grainId!, v); }, new Map<string, StoredPlace>())
    setKnownGrains(m);
  }, [knownPlaces]);

  // identify conditions that are satisfied
  useEffect(() => {
    setSatConditions(foundPlaces.reduce((s, p) => {
      p.selected.forEach(f => s.add(f));
      return s;
    }, new Set<string>()))
  }, [foundPlaces]);

  // select place based on filter configuration
  const filterPlace = useCallback((place: Place): boolean => {
    const set = new Set(selectedFilters);
    return set.size === 0 || place.selected.some((c) => set.has(c));
  }, [selectedFilters]);

  // draw places based on selected filters
  useEffect(() => {
    map?.clear();
    foundPlaces
      .filter((place) => filterPlace(place))
      .forEach((place) => {
        const grain = knownGrains.get(place.grainId);
        (grain) ? map?.addStored(grain) : map?.addTagged(place);
      });
    (center.placeId)
      ? map?.addStored(center)
      : map?.addCustom(center, false);
    map?.drawCircle(center.location, radius * 1000);
  }, [map, center, radius, foundPlaces, knownGrains, filterPlace]);

  return (
    <Stack direction="column" gap={4}>
      <Stack direction="column" gap={2}>
        <Typography fontSize="1.2rem">
          Found <strong>{foundPlaces.length}</strong> places at a distance at most <strong>{radius}</strong>&nbsp;km around the center point:
        </Typography>
        <SimplePinListItem
          kind={center.placeId ? "stored" : "custom"}
          label={center.name}
          onMarker={() => { map?.flyTo(center); }}
        />
      </Stack>
      <Stack spacing={2} direction="row" justifyContent="center" sx={{ flexWrap: "wrap" }}>
        {conditions.map((c, i) => {
          const active = new Set(selectedFilters).has(c.keyword);
          return (
            <PlacesFilter
              key={i}
              found={satConditions.has(c.keyword)}
              active={active}
              condition={c}
              onToggle={() => {
                const fs = (active)
                  ? (selectedFilters.filter((f) => f !== c.keyword))
                  : ([...selectedFilters, c.keyword]);
                dispatch(setSelectedFilters(fs));
              }}
            />
          );
        })}
      </Stack>
      <Stack direction="column" gap={2}>
        {foundPlaces
          .filter((place) => filterPlace(place))
          .map((place, i) => {
            const grain = knownGrains.get(place.grainId);
            return (grain)
              ? (<MenuPinListItem
                  key={i}
                  kind="stored"
                  label={grain.name}
                  onMarker={() => { map?.flyTo(grain); }}
                  menu={<ListItemLink icon={<Favorite />} back={RESULT_PLACES_ADDR} grainId={place.grainId} />}
                />)
              : (<MenuPinListItem
                  key={i}
                  kind="tagged"
                  label={place.name}
                  onMarker={() => { map?.flyTo(place); }}
                  menu={<ListItemLink icon={<Link />} back={RESULT_PLACES_ADDR} grainId={place.grainId} />}
                />);
        })}
      </Stack>
    </Stack>
  );
}

export default function ResultPlacesPanel(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { storage } = useContext(AppContext);
  const { result } = useAppSelector((state) => state.resultPlaces);
  const { placesLoaded } = useAppSelector((state) => state.favourites);

  useEffect(() => {
    const load = async () => {
      if (!placesLoaded) {
        dispatch(setPlaces(await storage.getAllPlaces()));
        dispatch(setPlacesLoaded());
      }
    };
    load();
  }, [storage, dispatch, placesLoaded]);

  const onBack = () => {
    dispatch(setSelectedFilters([]));
    navigate(SEARCH_PLACES_ADDR);
  };

  return (
    <Box>
      <BackCloseMenu onBack={onBack} />
      <Box sx={{ mx: 2, my: 4 }}>
        {(placesLoaded)
          ? (<Box>
              {result
                ? <ResultPlacesSection result={result} />
                : <Alert severity="warning">Oops... Result appears to be empty!</Alert>
              }
            </Box>)
          : (<Stack direction="column" gap={2}>
              <Skeleton variant="rounded" height={100} />
              <Skeleton variant="rounded" height={100} />
              <Skeleton variant="rounded" height={200} />
            </Stack>)
        }
      </Box>
    </Box>
  );
}
