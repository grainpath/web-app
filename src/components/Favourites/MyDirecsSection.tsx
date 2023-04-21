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
import { StoredDirec } from "../../domain/types";
import { SEARCH_DIRECS_ADDR } from "../../domain/routing";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import {
  setFavouriteDirecs,
  setFavouriteDirecsLoaded
} from "../../features/favouritesSlice";
import FavouriteStub from "./FavouriteStub";

type DirecsContentProps = {

  /** List of stored directions. */
  direcs: StoredDirec[];
};

function DirecsContent({ direcs }: DirecsContentProps): JSX.Element {

  return (
    <Box>
      {direcs.length > 0
        ? <></>
        : <FavouriteStub link={SEARCH_DIRECS_ADDR} what="direction" icon={(sx) => <Directions sx={sx} />} />
      }
    </Box>
  );
}

export default function MyDirecsSection(): JSX.Element {

  const { storage } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const { direcs: directions, direcsLoaded: directionsLoaded } = useAppSelector(state => state.favourites);

  useEffect(() => {
    const load = async () => {
      if (!directionsLoaded) {
        try {
          dispatch(setFavouriteDirecs(await storage.getAllDirecs()));
          dispatch(setFavouriteDirecsLoaded());
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
          ? <DirecsContent direcs={directions} />
          : <Skeleton variant="rounded" height={100} />
        }
      </AccordionDetails>
    </Accordion>
  );
}
