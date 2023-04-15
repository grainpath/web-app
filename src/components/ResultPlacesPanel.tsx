import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Checkbox,
  IconButton,
  Skeleton,
  Stack,
  Typography
} from "@mui/material";
import { Favorite, Link } from "@mui/icons-material";
import { AppContext } from "../App";
import { PlaceCondition, PlacesResult, StoredPlace } from "../domain/types";
import { ENTITY_ADDR, SEARCH_PLACES_ADDR } from "../domain/routing";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { setPlaces, setPlacesLoaded } from "../features/favouritesSlice";
import { BackCloseMenu } from "./shared-menus";
import { MenuPinListItem, SimplePinListItem } from "./shared-list-items";
import PlaceConditionModal from "./Result/PlaceConditionModal";

type ResultPlacesMenuProps = {
  icon: JSX.Element;
  grainId: string;
};

function ResultPlacesMenu({ icon, grainId }: ResultPlacesMenuProps): JSX.Element {

  const nav = useNavigate();
  const handle = () => { nav(ENTITY_ADDR + "/" + grainId); };

  return (
    <IconButton size="small" onClick={handle}>
      {icon}
    </IconButton>
  );
}

type ResultPlacesFilterProps = {
  found: boolean;
  condition: PlaceCondition;
  onClick: (value: boolean) => void;
};

function ResultPlacesFilter({ found, condition, onClick }: ResultPlacesFilterProps): JSX.Element {

  const [value, setValue] = useState(false);
  const [modal, setModal] = useState(false);
  useEffect(() => { onClick(value); }, [value]);

  return (
    <Box>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <Checkbox disabled={!found} checked={value} onChange={() => { setValue(!value); }} />
        <div onClick={() => { setModal(true); }} style={{ cursor: "pointer" }}>
          <Typography sx={{ textDecorationLine: found ? undefined : "line-through", color: found ? undefined : "grey" }}>
            {condition.keyword}
          </Typography>
        </div>
      </Stack>
      {modal && <PlaceConditionModal onHide={() => { setModal(false); }} condition={condition} />}
    </Box>
  );
}

type ResultPlacesSectionProps = {
  result: PlacesResult;
};

function ResultPlacesSection({ result }: ResultPlacesSectionProps): JSX.Element {

  const { map } = useContext(AppContext);
  const { center, radius, conditions, places: foundPlaces } = result;
  const { places: knownPlaces } = useAppSelector(state => state.favourites);

  const [knownGrains, setKnownGrains] = useState(new Map<string, StoredPlace>());
  const [foundConditions, setFoundConditions] = useState(new Set<string>());

  useEffect(() => {
    const m = knownPlaces
      .filter(p => Boolean(p.grainId))
      .reduce((m, v) => { return m.set(v.grainId!, v); }, new Map<string, StoredPlace>())
    setKnownGrains(m);
  }, [knownPlaces]);

  useEffect(() => {
    setFoundConditions(foundPlaces.reduce((s, p) => {
      p.selected.forEach(f => s.add(f));
      return s;
    }, new Set<string>()))
  }, [foundPlaces]);

  useEffect(() => {
    map?.clear();
    map?.drawCircle(center.location, radius * 1000);
    foundPlaces.forEach((place) => {
      const grain = knownGrains.get(place.grainId);
      (grain) ? map?.addStored(grain) : map?.addTagged(place);
    });
    (center.placeId) ? map?.addStored(center) : map?.addCustom(center, false);
  }, [map, center, radius, foundPlaces, knownGrains]);

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
          return <ResultPlacesFilter key={i} condition={c} found={foundConditions?.has(c.keyword)} onClick={() => {}} />
        })}
      </Stack>
      <Stack direction="column" gap={2}>
        {foundPlaces.map((place, i) => {
          const grain = knownGrains.get(place.grainId);
          return (grain)
            ? <MenuPinListItem
                key={i}
                kind="stored"
                label={grain.name}
                onMarker={() => { map?.flyTo(grain); }}
                menu={<ResultPlacesMenu icon={<Favorite />} grainId={place.grainId} />}
              />
            : <MenuPinListItem
                key={i}
                kind="tagged"
                label={place.name}
                onMarker={() => { map?.flyTo(place); }}
                menu={<ResultPlacesMenu icon={<Link />} grainId={place.grainId} />}
              />
        })}
      </Stack>
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
      <BackCloseMenu onBack={() => nav(SEARCH_PLACES_ADDR)} />
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
