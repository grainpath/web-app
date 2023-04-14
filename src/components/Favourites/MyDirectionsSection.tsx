import { useContext, useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Skeleton,
  Typography
} from "@mui/material";
import { Directions, ExpandMore } from "@mui/icons-material";
import { AppContext } from "../../App";
import { StoredDirection } from "../../domain/types";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { setDirections, setDirectionsLoaded } from "../../features/favouritesSlice";
import { FavouriteStub } from "./FavouriteStub";
import { SEARCH_DIRECT_ADDR } from "../../domain/routing";

type DirectionsContentProps = {
  directions: StoredDirection[];
};

function DirectionsContent({ directions }: DirectionsContentProps): JSX.Element {

  return (
    <Box>
      {directions.length > 0
        ? <></>
        : <FavouriteStub link={SEARCH_DIRECT_ADDR} what="direction" icon={(sx) => <Directions sx={sx} />} />
      }
    </Box>
  );
}

export default function MyDirectionsSection(): JSX.Element {

  const { storage } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const { directions, directionsLoaded } = useAppSelector(state => state.favourites);

  useEffect(() => {
    const load = async () => {
      if (!directionsLoaded) {
        try {
          dispatch(setDirections(await storage.getAllDirections()));
          dispatch(setDirectionsLoaded());
        }
        catch (ex) { alert(ex); }
      }
    }
    load();
  }, [storage, dispatch, directionsLoaded]);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>My Directions</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {directionsLoaded
          ? <DirectionsContent directions={directions} />
          : <Skeleton variant="rounded" height={100} />
        }
      </AccordionDetails>
    </Accordion>
  );
}
