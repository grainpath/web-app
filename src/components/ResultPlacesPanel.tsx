import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Skeleton,
  Stack,
  Typography
} from "@mui/material";
import { AppContext } from "../App";
import { PlacesResult } from "../domain/types";
import { SEARCH_PLACES_ADDR } from "../domain/routing";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { setPlaces, setPlacesLoaded } from "../features/favouritesSlice";
import { BackCloseMenu } from "./shared-menus";

type ResultPlacesSectionProps = {
  result: PlacesResult;
};

function ResultPlacesSection({ result }: ResultPlacesSectionProps): JSX.Element {

  const { map } = useContext(AppContext);
  const { center, radius, places: foundPlaces } = result;
  const { places: knownPlaces } = useAppSelector(state => state.favourites);

  const [knownGrains, setKnownGrains] = useState(new Set<string>());

  useEffect(() => {
    setKnownGrains(new Set(knownPlaces.map(p => p.grainId).filter(p => p !== undefined) as string[]));
  }, [knownPlaces]);

  useEffect(() => {
    map?.clear();
    map?.drawCircle(center.location, radius * 1000);
    foundPlaces.forEach((pl) => {
      knownGrains.has(pl.grainId) ? map?.addStored(pl) : map?.addTagged(pl);
    });
    (center.placeId) ? map?.addStored(center) : map?.addCustom(center, false);
  }, [map, center, radius, foundPlaces, knownGrains]);

  return (
    <Stack direction="column" gap={2}>
      <Typography>Radius {radius} km</Typography>
      <Typography>Found {foundPlaces.length} places</Typography>
    </Stack>
  );
}

export default function ResultPlacesPanel(): JSX.Element {

  const nav = useNavigate();
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

  return (
    <Box>
      <BackCloseMenu back={() => nav(SEARCH_PLACES_ADDR)} />
      <Box sx={{ mx: 2, my: 4 }}>
        {placesLoaded
          ? <Box>
              {result
                ? <ResultPlacesSection result = { result } />
                : <Alert severity="warning">Oops... Result appears to be empty!</Alert>
              }
            </Box>
          : <Stack direction="column" gap={2}>
              <Skeleton variant="rounded" height={100} />
              <Skeleton variant="rounded" height={200} />
            </Stack>
        }
      </Box>
    </Box>
  );
}
