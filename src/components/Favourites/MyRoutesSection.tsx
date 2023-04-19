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
  deleteRoute,
  setPlaces,
  setPlacesLoaded,
  setRoutes,
  setRoutesLoaded,
  updateRoute
} from "../../features/favouritesSlice";
import {
  setResultBack,
  setResultRoutes
} from "../../features/resultRoutesSlice";
import { RouteButton } from "../shared-buttons";
import { BusyListItem } from "../shared-list-items";
import DeleteModal from "./DeleteModal";
import UpdateModal from "./UpdateModal";
import ItemListMenu from "./ItemListMenu";
import FavouriteStub from "./FavouriteStub";

type RouteListItemProps = {
  index: number;
  route: StoredRoute;
  grains: Map<string, StoredPlace>;
};

function RouteListItem({ index, route, grains }: RouteListItemProps): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { map, storage } = useContext(AppContext);
  const { name, source, target, path, waypoints } = route;

  const [showD, setShowD] = useState(false);
  const [showU, setShowU] = useState(false);

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
    dispatch(setResultBack(FAVOURITES_ADDR));
    navigate(RESULT_ROUTES_ADDR);
  };

  const onDelete = async () => {
    await storage.deleteRoute(route.routeId);
    dispatch(deleteRoute(index));
  };

  const onUpdate = async (name: string) => {
    const rt = { ...route, name: name };
    await storage.updateRoute(rt);
    dispatch(updateRoute({ route: rt, index: index }));
  };

  return (
    <Box>
      <BusyListItem
        label={name}
        l={<RouteButton onRoute={onRoute} />}
        r={<ItemListMenu onShow={onShow} showDelete={() => { setShowD(true); }} showUpdate={() => { setShowU(true); }} />}
      />
      {showD && <DeleteModal name={route.name} what="route" onHide={() => { setShowD(false); }} onDelete={onDelete} />}
      {showU && <UpdateModal name={route.name} what="route" onHide={() => { setShowU(false); }} onUpdate={onUpdate} />}
    </Box>
  );
}

type RoutesContentProps = {
  routes: StoredRoute[];
};

function RoutesContent({ routes }: RoutesContentProps): JSX.Element {

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
            {routes.map((r, i) => <RouteListItem key={i} index={i} route={r} grains={grains} />)}
          </Stack>
        : <FavouriteStub link={SEARCH_ROUTES_ADDR} what="route" icon={(sx) => <Route sx={sx} />} />
      }
    </Box>
  )
}

export function MyRoutesSection(): JSX.Element {

  const { storage } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const { placesLoaded, routes, routesLoaded } = useAppSelector(state => state.favourites);

  useEffect(() => {
    const load = async () => {
      if (!routesLoaded) {
        try {
          dispatch(setRoutes(await storage.getAllRoutes()));
          dispatch(setRoutesLoaded());
        }
        catch (ex) { alert(ex); }
      }
      if (!placesLoaded) {
        try {
          dispatch(setPlaces(await storage.getAllPlaces()));
          dispatch(setPlacesLoaded());
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
          ? <RoutesContent routes={routes} />
          : <Skeleton variant="rounded" height={100} />
        }
      </AccordionDetails>
    </Accordion>
  );
}
