import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Pagination,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { AppContext } from "../App";
import { UiRoute } from "../domain/types";
import { RESULT_ROUTES_ADDR, SEARCH_ROUTES_ADDR } from "../domain/routing";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { setPlaces, setPlacesLoaded } from "../features/favouritesSlice";
import {
  clearResultRoutes,
  replaceResultRoute,
  setResultRoutesIndex
} from "../features/resultRoutesSlice";
import { BackCloseMenu } from "./shared-menus";
import LoadThingsStub from "./Result/LoadThingsStub";
import { getCopyKnownGrains, getSatConditions } from "./Result/functions";
import PlacesFilter from "./Result/PlacesFilter";
import PlacesList from "./Result/PlacesList";
import { IdGenerator } from "../utils/helpers";

type SaveModalProps = {
  index: number;
  route: UiRoute;
  onHide: () => void;
};

function SaveModal({ index, route, onHide }: SaveModalProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { storage } = useContext(AppContext);

  const [name, setName] = useState(route.name);
  const [disabled, setDisabled] = useState(false);

  const action = async () => {
    setDisabled(true);
    try {
      const rt = { ...route, name: name };
      const sr = {
        ...rt,
        routeId: IdGenerator.generateId(rt)
      };
      await storage.createRoute(sr);
      dispatch(replaceResultRoute({ route: sr, index: index }));
      onHide();
    }
    catch (ex) { alert(ex); }
    finally { setDisabled(false); }
  };

  return (
    <Dialog open>
      <DialogTitle>Save route</DialogTitle>
      <DialogContent>
        <Stack direction="column" gap={2}>
          <TextField
            value={name}
            sx={{ mt: 0.5 }}
            onChange={(e) => setName(e.target.value)}
          />
          <Box maxWidth="350px">
            <Typography fontSize="small" color="grey">
              Save operation creates a <strong>local</strong> copy of this
              route. Local copies are no longer synchronized with the server.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button disabled={disabled} onClick={onHide} color="error">Discard</Button>
            <Button disabled={disabled || !(name.trim().length > 0)} onClick={() => { action(); }}>Save</Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

type ResultRoutesSectionProps = {

  /**
   * Non-empty list of routes.
   */
  result: UiRoute[];
};

function ResultRoutesSection({ result }: ResultRoutesSectionProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { map } = useContext(AppContext);
  const { index } = useAppSelector(state => state.resultRoutes);
  const { places: knownPlaces } = useAppSelector(state => state.favourites);

  const [modal, setModal] = useState(false);

  const route = useMemo(() => result[index], [result, index]);
  const {
    routeId,
    name,
    source,
    target,
    distance,
    conditions,
    path,
    waypoints
  } = route;

  const knownGrains = useMemo(() => getCopyKnownGrains(knownPlaces), [knownPlaces]);

  const satConditions = useMemo(() => getSatConditions(waypoints), [waypoints]);

  useEffect(() => {
    map?.clear();
    waypoints.forEach((place) => {
      const grain = knownGrains.get(place.grainId);
      if (grain) { grain.selected = place.selected; }
      (grain) ? map?.addStored(grain) : map?.addTagged(place);
    });
    map?.addSource(source, false);
    map?.addTarget(target, false);
    map?.drawPolyline(path.polyline);
  }, [map, source, target, path, waypoints, knownGrains]);

  const onPage = (_: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setResultRoutesIndex(value - 1));
  };

  return (
    <Stack direction="column" gap={2.7}>
      <Typography fontSize="1.2rem">
        Found <strong>{result.length}</strong> routes.
      </Typography>
      <Box display="flex" justifyContent="center" width="100%">
        <Pagination count={result.length} page={index + 1} onChange={onPage} />
      </Box>
      {(routeId)
        ? (<Alert severity="success">
            Saved as <strong>{name}</strong>.
          </Alert>)
        : (<Box>
            <Alert icon={false} severity="info" action={<Button color="inherit" size="small" onClick={() => { setModal(true); }}>Save</Button>}>
              Would you like to save this route?
            </Alert>
            {modal && <SaveModal index={index} route={route} onHide={() => { setModal(false); }} />}
          </Box>)
      }
      <Box display="flex" alignItems="center">
        <Typography fontSize="1.5rem">Distance</Typography>
        <Stack width="100%" direction="row" justifyContent="center" alignItems="center">
          <Typography fontSize="1.5rem" fontWeight="bold">{Number(path.distance.toFixed(2))}</Typography>
          <Typography fontSize="1.5rem">&nbsp;/&nbsp;</Typography>
          <Typography fontSize="1.5rem">{distance} km</Typography>
        </Stack>
      </Box>
      <Stack spacing={2} direction="row" justifyContent="center" flexWrap="wrap">
        {conditions.map((c, i) => (
          <PlacesFilter
            key={i}
            found={satConditions.has(c.keyword)}
            active={false}
            disabled={true}
            condition={c}
            onToggle={() => {}}
          />
        ))}
      </Stack>
      <PlacesList back={RESULT_ROUTES_ADDR} places={waypoints} grains={knownGrains} />
    </Stack>
  );
}

export default function ResultRoutesPanel(): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { storage } = useContext(AppContext);
  const { result } = useAppSelector((state) => state.resultRoutes);
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
    dispatch(clearResultRoutes());
    navigate(SEARCH_ROUTES_ADDR);
  };

  return (
    <Box>
      <BackCloseMenu onBack={onBack} />
      <Box sx={{ mx: 2, my: 4 }}>
        {(placesLoaded)
          ? <Box>
              {result.length > 0
                ? <ResultRoutesSection result={result} />
                : <Alert severity="warning">
                    Oops... List of routes appears to be empty. Try different search parameters.
                  </Alert>
              }
            </Box>
          : <LoadThingsStub />
        }
      </Box>
    </Box>
  );
}
