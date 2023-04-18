import { useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Stack, Typography } from "@mui/material";
import { AppContext } from "../App";
import { PlacesResult } from "../domain/types";
import { RESULT_PLACES_ADDR, SEARCH_PLACES_ADDR } from "../domain/routing";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  clearResultPlaces,
  setResultPlacesFilters
} from "../features/resultPlacesSlice";
import { setPlaces, setPlacesLoaded } from "../features/favouritesSlice";
import { BackCloseMenu } from "./shared-menus";
import { SimplePinListItem } from "./shared-list-items";
import PlacesFilter from "./Result/PlacesFilter";
import LoadThingsStub from "./Result/LoadThingsStub";
import {
  getCopyKnownGrains,
  getSatConditions
} from "./Result/functions";
import PlacesList from "./Result/PlacesList";

type ResultPlacesSectionProps = {
  result: PlacesResult;
};

function ResultPlacesSection({ result }: ResultPlacesSectionProps): JSX.Element {

  const { center, radius, conditions, places: foundPlaces } = result;

  const dispatch = useAppDispatch();
  const { map } = useContext(AppContext);
  const { places: knownPlaces } = useAppSelector(state => state.favourites);
  const { filters: filterLst } = useAppSelector(state => state.resultPlaces);

  // get a set of activated filters
  const filterSet = useMemo(() => new Set(filterLst), [filterLst]);

  // create a copy of known grains found in the pile of known places
  const knownGrains = useMemo(() => getCopyKnownGrains(knownPlaces), [knownPlaces]);

  // extract conditions satisfied by the result
  const satConditions = useMemo(() => getSatConditions(foundPlaces), [foundPlaces]);

  // select places based on the activated filters
  const shownPlaces = useMemo(() => foundPlaces.filter((place) => {
    return filterSet.size === 0 || place.selected.some((keyword) => filterSet.has(keyword));
  }), [foundPlaces, filterSet]);

  // draw places based on selected filters
  useEffect(() => {
    map?.clear();
    shownPlaces.forEach((place) => {
      const grain = knownGrains.get(place.grainId);
      if (grain) { grain.selected = place.selected; } // (!) change structuredClone
      (grain) ? map?.addStored(grain) : map?.addTagged(place);
    });
    (center.placeId) ? map?.addStored(center) : map?.addCustom(center, false);
    map?.drawCircle(center.location, radius * 1000);
  }, [map, center, radius, foundPlaces, knownGrains, shownPlaces]);

  return (
    <Stack direction="column" gap={2.7}>
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
      <Stack spacing={2} direction="row" justifyContent="center" flexWrap="wrap">
        {conditions.map((c, i) => {
          const active = filterSet.has(c.keyword);
          return (
            <PlacesFilter
              key={i}
              found={satConditions.has(c.keyword)}
              active={active}
              disabled={false}
              condition={c}
              onToggle={() => {
                const fs = (active)
                  ? filterLst.filter((f) => f !== c.keyword)
                  : [...filterLst, c.keyword];
                dispatch(setResultPlacesFilters(fs));
              }}
            />
          );
        })}
      </Stack>
      <PlacesList back={RESULT_PLACES_ADDR} places={shownPlaces} grains={knownGrains} />
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
    dispatch(clearResultPlaces());
    navigate(SEARCH_PLACES_ADDR);
  };

  return (
    <Box>
      <BackCloseMenu onBack={onBack} />
      <Box sx={{ mx: 2, my: 4 }}>
        {(placesLoaded)
          ? (<Box>
              {result
                ? (<ResultPlacesSection result={result} />)
                : (<Alert severity="warning">Oops... Result appears to be empty!</Alert>)
              }
            </Box>)
          : (<LoadThingsStub />)
        }
      </Box>
    </Box>
  );
}
