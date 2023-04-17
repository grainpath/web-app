import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import {
  Delete,
  Edit,
  ExpandMore,
  Grain,
  Link,
  MoreVert
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
import {
  FreeCenterListItem,
  MenuPinListItem,
  RemovablePinListItem
} from "../shared-list-items";
import { DeleteModal, EditModal } from "../shared-modals";
import { FavouriteStub } from "./FavouriteStub";

type PlaceMenuProps = {

  /** Shows edit modal. */
  showEdit: () => void;

  /** Redirect to the entity view. */
  onVisit?: () => void;

  /** Shows delete modal. */
  showDelete: () => void;
};

/**
 * Place-specific menu in the storage list of places.
 */
function PlaceMenu({ showEdit, onVisit, showDelete }: PlaceMenuProps): JSX.Element {

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const onClose = () => { setAnchorEl(null); };

  return (
    <Box>
      <IconButton size="small" onClick={onClick}><MoreVert /></IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
        <MenuItem onClick={() => { showEdit(); onClose(); }}>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          <Typography>Edit</Typography>
        </MenuItem>
        {Boolean(onVisit) &&
          <MenuItem onClick={onVisit}>
            <ListItemIcon><Link fontSize="small" /></ListItemIcon>
            <Typography>Visit</Typography>
          </MenuItem>
        }
        <MenuItem onClick={() => { showDelete(); onClose(); }}>
          <ListItemIcon><Delete fontSize="small" /></ListItemIcon>
          <Typography>Delete</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}

type PlaceListItemProps = {

  /**  */
  index: number;

  /**  */
  place: StoredPlace;
};

function PlaceListItem({ index, place }: PlaceListItemProps): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { map, storage } = useContext(AppContext);

  const [showE, showEdit] = useState(false);
  const [showD, showDelete] = useState(false);

  const onMarker = () => {
    map?.clear();
    map?.addStored(place);
    map?.flyTo(place);
  };

  const onSave = async (newName: string) => {
    const pl = { ...place, name: newName };
    await storage.updatePlace(pl);
    dispatch(updatePlace({ place: pl, index: index }));
  };

  const onVisit = () => {
    dispatch(setBack(FAVOURITES_ADDR));
    navigate(ENTITY_ADDR + "/" + place.grainId);
  };

  const onDelete = async () => {
    await storage.deletePlace(place.placeId);
    dispatch(deletePlace(index));
  };

  return (
    <Box>
      <MenuPinListItem
        kind="stored"
        onMarker={onMarker}
        label={place.name}
        menu={<PlaceMenu showEdit={() => { showEdit(true); }} onVisit={place.grainId ? onVisit : undefined} showDelete={() => { showDelete(true); }} />}
      />
      {showE && <EditModal name={place.name} what="place" onHide={() => { showEdit(false) }} onSave={(newName) => { onSave(newName); }} />}
      {showD && <DeleteModal name={place.name} what="place" onHide={() => { showDelete(false); }} onDelete={() => { onDelete(); }} />}
    </Box>
  );
}

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
            ? <RemovablePinListItem kind="custom" onMarker={() => clickMarker(place)} onDelete={removeMarker} label={place.name} />
            : <FreeCenterListItem onClick={addMarker} />
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

  /** */
  places: StoredPlace[];
};

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
