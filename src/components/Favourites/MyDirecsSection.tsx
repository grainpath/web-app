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
import { Directions, ExpandMore } from "@mui/icons-material";
import { AppContext } from "../../App";
import { StoredDirec, StoredPlace } from "../../domain/types";
import {
  FAVOURITES_ADDR,
  RESULT_DIRECS_ADDR,
  SEARCH_DIRECS_ADDR
} from "../../domain/routing";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import {
  deleteFavouriteDirec,
  setFavouriteDirecs,
  setFavouriteDirecsLoaded,
  setFavouriteRoutes,
  setFavouriteRoutesLoaded,
  updateFavouriteDirec
} from "../../features/favouritesSlice";
import {
  setResultDirecs,
  setResultDirecsBack
} from "../../features/resultDirecsSlice";
import { DirecButton } from "../shared-buttons";
import { BusyListItem } from "../shared-list-items";
import UpdateModal from "./UpdateModal";
import DeleteModal from "./DeleteModal";
import ListItemMenu from "./ListItemMenu";
import FavouriteStub from "./FavouriteStub";

type DirecsListItemProps = {

  /** Index of a direction in the list. */
  index: number;

  /** Direction under consideration. */
  direc: StoredDirec;

  /** Ids of all stored places. */
  knowns: Map<string, StoredPlace>;
};

function DirecsListItem({ index, direc, knowns }: DirecsListItemProps): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { map, storage } = useContext(AppContext);
  const { name, path, sequence } = direc;

  const [showU, setShowU] = useState(false);
  const [showD, setShowD] = useState(false);

  const onDirec = () => {
    map?.clear();
    sequence.forEach((place) => {
      place.placeId && knowns.has(place.placeId)
        ? map?.addStored(knowns.get(place.placeId)!)
        : map?.addCustom(place, false);
    });
    map?.drawPolyline(path.polyline);
    map?.flyTo(sequence[0]);
  };

  const onShow = () => {
    dispatch(setResultDirecs(direc));
    dispatch(setResultDirecsBack(FAVOURITES_ADDR));
    navigate(RESULT_DIRECS_ADDR);
  };

  const onUpdate = async (name: string) => {
    const dr = { ...direc, name: name };
    await storage.updateDirec(dr);
    dispatch(updateFavouriteDirec({ direc: dr, index: index }));
  };

  const onDelete = async () => {
    await storage.deleteDirec(direc.direcId);
    dispatch(deleteFavouriteDirec(index));
  };

  return (
    <Box>
      <BusyListItem
        label={name}
        l={<DirecButton onDirec={onDirec} />}
        r={<ListItemMenu onShow={onShow} showUpdate={() => { setShowU(true); }} showDelete={() => { setShowD(true); }} />}
      />
      {showU && <UpdateModal name={name} what="direction" onHide={() => { setShowU(false); }} onUpdate={onUpdate} />}
      {showD && <DeleteModal name={name} what="direction" onHide={() => { setShowD(false); }} onDelete={onDelete} />}
    </Box>
  );
}

type DirecsListProps = {

  /** List of stored directions. */
  direcs: StoredDirec[];
};

function DirecsList({ direcs }: DirecsListProps): JSX.Element {

  const { places } = useAppSelector(state => state.favourites);

  const knowns = useMemo(() => (
    places.reduce((map, place) => map.set(place.placeId, place), new Map<string, StoredPlace>())
  ), [places]);

  return (
    <Box>
      {direcs.length > 0
        ? <Stack direction="column" gap={2} sx={{ mb: 2 }}>
            {direcs.map((d, i) => <DirecsListItem key={i} index={i} direc={d} knowns={knowns} />)}
          </Stack>
        : <FavouriteStub link={SEARCH_DIRECS_ADDR} what="direction" icon={(sx) => <Directions sx={sx} />} />
      }
    </Box>
  );
}

export default function MyDirecsSection(): JSX.Element {

  const { storage } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const { placesLoaded, direcs, direcsLoaded } = useAppSelector(state => state.favourites);

  useEffect(() => {
    const load = async () => {
      if (!placesLoaded) {
        try {
          dispatch(setFavouriteRoutes(await storage.getAllRoutes()));
          dispatch(setFavouriteRoutesLoaded());
        }
        catch (ex) { alert(ex); }
      }
      if (!direcsLoaded) {
        try {
          dispatch(setFavouriteDirecs(await storage.getAllDirecs()));
          dispatch(setFavouriteDirecsLoaded());
        }
        catch (ex) { alert(ex); }
      }
    }
    load();
  }, [storage, dispatch, direcsLoaded]);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>My Directions</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {direcsLoaded
          ? <DirecsList direcs={direcs} />
          : <Skeleton variant="rounded" height={100} />
        }
      </AccordionDetails>
    </Accordion>
  );
}
