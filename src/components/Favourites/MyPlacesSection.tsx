import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Skeleton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import {
  ExpandMore,
  Grain,
} from "@mui/icons-material";
import { AppContext } from "../../App";
import { StoredPlace, UiPlace, WgsPoint } from "../../domain/types";
import {
  ENTITY_ADDR,
  FAVOURITES_ADDR,
  SEARCH_PLACES_ADDR
} from "../../domain/routing";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { hidePanel, setBlock, showPanel } from "../../features/panelSlice";
import {
  createCustomPlace,
  deletePlace,
  setCustomLocation,
  setCustomName,
  setPlaces,
  setPlacesLoaded,
  updatePlace
} from "../../features/favouritesSlice";
import { setBack } from "../../features/entitySlice";
import { IdGenerator, point2place } from "../../utils/helpers";
import { PlaceButton } from "../shared-buttons";
import { BusyListItem, FreePlaceListItem, RemovablePlaceListItem } from "../shared-list-items";
import UpdateModal from "./UpdateModal";
import DeleteModal from "./DeleteModal";
import ItemListMenu from "./ItemListMenu";
import FavouriteStub from "./FavouriteStub";

type PlaceListItemProps = {

  /** The position of the place in the list */
  index: number;

  /** Place object. */
  place: StoredPlace;
};

/**
 * Interactable items in the list of places.
 */
function PlaceListItem({ index, place }: PlaceListItemProps): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { map, storage } = useContext(AppContext);

  const [showD, setShowD] = useState(false);
  const [showU, setShowU] = useState(false);

  const onPlace = () => {
    map?.clear();
    map?.addStored(place);
    map?.flyTo(place);
  };

  const onShow = () => {
    dispatch(setBack(FAVOURITES_ADDR));
    navigate(ENTITY_ADDR + "/" + place.grainId);
  };

  const onDelete = async () => {
    await storage.deletePlace(place.placeId);
    dispatch(deletePlace(index));
  };

  const onUpdate = async (name: string) => {
    const pl = { ...place, name: name };
    await storage.updatePlace(pl);
    dispatch(updatePlace({ place: pl, index: index }));
  };

  return (
    <Box>
      <BusyListItem
        label={place.name}
        l={<PlaceButton kind="stored" onPlace={onPlace} />}
        r={<ItemListMenu onShow={place.grainId ? onShow : undefined} showDelete={() => { setShowD(true); }} showUpdate={() => { setShowU(true); }} />}
      />
      {showD && <DeleteModal name={place.name} what="place" onHide={() => { setShowD(false); }} onDelete={onDelete} />}
      {showU && <UpdateModal name={place.name} what="place" onHide={() => { setShowU(false); }} onUpdate={onUpdate} />}
    </Box>
  );
}

/**
 * Dialog with the user enabling to create custom place.
 */
function CustomPlaceDialog(): JSX.Element {

  const empty = "";
  const { map, storage } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const { block } = useAppSelector(state => state.panel);
  const { name, place } = useAppSelector(state => state.favourites);

  const clickMarker = (pl: UiPlace) => {
    map?.clear();
    map?.addCustom(pl, true).withDrag((point) => { dispatch(setCustomLocation(point2place(point))); });
    map?.flyTo(pl);
  };

  const callback = (pt: WgsPoint) => {
    const pl = point2place(pt);
    map?.addCustom(pl, true).withDrag((point) => { dispatch(setCustomLocation(point2place(point))); });
    dispatch(setCustomLocation(pl));
    dispatch(showPanel());
  };

  const addMarker = () => {
    dispatch(hidePanel());
    map?.clear();
    map?.captureLocation(callback);
  };

  const removeMarker = () => {
    map?.clear();
    dispatch(setCustomLocation(undefined));
  };

  const clearDialog = () => {
    removeMarker();
    dispatch(setCustomName(empty));
  };

  const create = async () => {
    dispatch(setBlock(true));
    try {
      const pl = { name: name.trim(), location: place!.location, keywords: [], selected: [] };
      const st = {
        ...pl,
        placeId: IdGenerator.generateId(pl)
      };
      await storage.createPlace(st);
      dispatch(createCustomPlace(st));
      map?.clear();
    }
    catch (ex) { alert(ex); }
    finally { dispatch(setBlock(false)); }
  };

  return (
    <Box sx={{ mt: 4, mb: 1 }}>
      <details>
        <summary style={{ cursor: "pointer" }}>
          <Typography sx={{ display: "inline-block" }}>Create custom place</Typography>
        </summary>
        <Stack direction="column" gap={2} sx={{ mt: 2 }}>
          {place
            ? <RemovablePlaceListItem
                kind="custom"
                label={place.name}
                onPlace={() => clickMarker(place)}
                onDelete={removeMarker}
              />
            : <FreePlaceListItem
                kind="custom"
                label="Select point..."
                onPlace={addMarker}
              />
          }
          <TextField
            required
            fullWidth
            size="small"
            value={name}
            placeholder="Enter name..."
            onChange={(e) => dispatch(setCustomName(e.target.value))}
          />
          <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button color="error" disabled={block} onClick={clearDialog}>Clear</Button>
            <Button disabled={block || !place || !(name.trim().length > 0)} onClick={create}>Create</Button>
          </Box>
        </Stack>
      </details>
    </Box>
  );
}

type PlacesContentProps = {

  /** List of places available in the storage. */
  places: StoredPlace[];
};

/**
 * Places section content.
 */
function PlacesContent({ places }: PlacesContentProps): JSX.Element {

  return (
    <Box>
      {places.length > 0
        ? <Stack direction="column" gap={2}>
            {places.map((p, i) => <PlaceListItem key={i} index={i} place={p} />)}
          </Stack>
        : <FavouriteStub link={SEARCH_PLACES_ADDR} what="place" icon={(sx) => <Grain sx={sx} />} />
      }
    </Box>
  );
}

/**
 * Collapsible section with list of places available in the storage.
 */
export default function MyPlacesSection(): JSX.Element {

  const { storage } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const { places, placesLoaded } = useAppSelector(state => state.favourites);

  useEffect(() => {
    const load = async () => {
      if (!placesLoaded) {
        try {
          dispatch(setPlaces(await storage.getAllPlaces()));
          dispatch(setPlacesLoaded());
        }
        catch (ex) { alert(ex); }
      }
    }
    load();
  }, [storage, dispatch, placesLoaded]);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>My Places</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {placesLoaded
          ? <PlacesContent places={places} />
          : <Skeleton variant="rounded" height={100} />
        }
        <CustomPlaceDialog />
      </AccordionDetails>
    </Accordion>
  );
}
