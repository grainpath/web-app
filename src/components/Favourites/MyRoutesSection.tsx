import { useContext, useEffect, useMemo } from "react";
import { AppContext } from "../../App";
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
import { StoredPlace, StoredRoute } from "../../domain/types";
import { SEARCH_ROUTES_ADDR } from "../../domain/routing";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { setPlaces, setPlacesLoaded, setRoutes, setRoutesLoaded } from "../../features/favouritesSlice";
import { FavouriteStub } from "./FavouriteStub";
import { MenuRouteListItem } from "../shared-list-items";
import { PlaceMenu } from "./MyPlacesSection";


type RouteListItemProps = {
  index: number;
  route: StoredRoute;
  grains: Map<string, StoredPlace>;
};

function RouteListItem({ index, route, grains }: RouteListItemProps): JSX.Element {

  const { map } = useContext(AppContext);
  const { name, source, target, path, waypoints } = route;

  const onIcon = () => {
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
    
  };

  return (
    <MenuRouteListItem
      label={name}
      onIcon={onIcon}
      menu={<PlaceMenu onShow={onShow} showEdit={() => { }} showDelete={() => { }} />} />
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
