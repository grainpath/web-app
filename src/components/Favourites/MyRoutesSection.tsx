import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Skeleton,
  Stack,
  Typography
} from "@mui/material";
import { ExpandMore, Route } from "@mui/icons-material";
import { AppContext } from "../../App";
import { StoredPlace, StoredRoute } from "../../domain/types";
import {
  FAVOURITES_ADDR,
  RESULT_ROUTES_ADDR,
  SEARCH_ROUTES_ADDR
} from "../../domain/routing";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import {
  deleteFavouriteRoute,
  setFavouritePlaces,
  setFavouritePlacesLoaded,
  setFavouriteRoutes,
  setFavouriteRoutesLoaded,
  updateFavouriteRoute
} from "../../features/favouritesSlice";
import {
  setResultRoutes,
  setResultRoutesBack
} from "../../features/resultRoutesSlice";
import { RouteButton } from "../shared-buttons";
import { BusyListItem } from "../shared-list-items";
import DeleteModal from "./DeleteModal";
import UpdateModal from "./UpdateModal";
import ListItemMenu from "./ListItemMenu";
import FavouriteStub from "./FavouriteStub";

type RoutesListItemProps = {

  /** Index of a route in the list. */
  index: number;

  /** Route in consideration. */
  route: StoredRoute;

  /** Known places with grainId. */
  grains: Map<string, StoredPlace>;
};

function RoutesListItem({ index, route, grains }: RoutesListItemProps): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { map, storage } = useContext(AppContext);
  const { name, source, target, path, waypoints } = route;

  const [showU, setShowU] = useState(false);
  const [showD, setShowD] = useState(false);

  const onRoute = () => {
    map?.clear();
    waypoints.forEach((place) => {
      const grain = grains.get(place.grainId);
      (grain) ? map?.addStored(grain) : map?.addTagged(place);
    });
    map?.addSource(source, false);
    map?.addTarget(target, false);
    map?.drawPolyline(path.polyline);
    map?.flyTo(source);
  }

  const onShow = () => {
    dispatch(setResultRoutes([route]));
    dispatch(setResultRoutesBack(FAVOURITES_ADDR));
    navigate(RESULT_ROUTES_ADDR);
  };

  const onUpdate = async (name: string) => {
    const rt = { ...route, name: name };
    await storage.updateRoute(rt);
    dispatch(updateFavouriteRoute({ route: rt, index: index }));
  };

  const onDelete = async () => {
    await storage.deleteRoute(route.routeId);
    dispatch(deleteFavouriteRoute(index));
  };

  return (
    <Box>
      <BusyListItem
        label={name}
        l={<RouteButton onRoute={onRoute} />}
        r={<ListItemMenu onShow={onShow} showUpdate={() => { setShowU(true); }} showDelete={() => { setShowD(true); }} />}
      />
      {showU && <UpdateModal name={name} what="route" onHide={() => { setShowU(false); }} onUpdate={onUpdate} />}
      {showD && <DeleteModal name={name} what="route" onHide={() => { setShowD(false); }} onDelete={onDelete} />}
    </Box>
  );
}

type RoutesListProps = {

  /** List of stored routes. */
  routes: StoredRoute[];
};

function RoutesList({ routes }: RoutesListProps): JSX.Element {

  const { places } = useAppSelector(state => state.favourites);

  const grains = useMemo(() => {
    return places.reduce((map, place) => {
      if (place.grainId) { map.set(place.grainId, place); }
      return map;
    }, new Map<string, StoredPlace>());
  }, [places]);

  return (
    <Box>
      {routes.length > 0
        ? <Stack direction="column" gap={2} sx={{ mb: 2 }}>
            {routes.map((r, i) => <RoutesListItem key={i} index={i} route={r} grains={grains} />)}
          </Stack>
        : <FavouriteStub link={SEARCH_ROUTES_ADDR} what="route" icon={(sx) => <Route sx={sx} />} />
      }
    </Box>
  )
}

export default function MyRoutesSection(): JSX.Element {

  const { storage } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const { placesLoaded, routes, routesLoaded } = useAppSelector(state => state.favourites);

  useEffect(() => {
    const load = async () => {
      if (!routesLoaded) {
        try {
          dispatch(setFavouriteRoutes(await storage.getAllRoutes()));
          dispatch(setFavouriteRoutesLoaded());
        }
        catch (ex) { alert(ex); }
      }
      if (!placesLoaded) {
        try {
          dispatch(setFavouritePlaces(await storage.getAllPlaces()));
          dispatch(setFavouritePlacesLoaded());
        }
        catch (ex) { alert(ex); }
      }
    }
    load();
  }, [storage, dispatch, placesLoaded, routesLoaded]);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>My Routes</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {routesLoaded
          ? <RoutesList routes={routes} />
          : <Skeleton variant="rounded" height={100} />
        }
      </AccordionDetails>
    </Accordion>
  );
}
