import { useContext, useEffect, useState } from "react";
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
import { ExpandMore, Grain } from "@mui/icons-material";
import { AppContext } from "../../App";
import { StoredPlace, UiPlace, WgsPoint } from "../../domain/types";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { hidePanel, setBlock, showPanel } from "../../features/panelSlice";
import { IdGenerator, point2place } from "../../utils/helpers";
import { FreeCenterListItem, RemovableCustomListItem } from "../shared-list-items";
import {
  createPlace,
  setLoaded,
  setLocation,
  setName,
  setNote,
  setPlaces
} from "../../features/favouritesSlice";
import { FavouriteStub } from "./FavouriteStub";
import { SEARCH_PLACES_ADDR } from "../../domain/routing";

function CustomPlaceDialog(): JSX.Element {

  const empty = "";
  const { map, storage } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const { block } = useAppSelector(state => state.panel);
  const { name, note, place } = useAppSelector(state => state.favourites);

  const clickMarker = (pl: UiPlace) => {
    map?.clear();
    map?.addCustom(pl, true).withDrag((point) => { dispatch(setLocation(point2place(point))); });
    map?.flyTo(pl);
  };

  const callback = (pt: WgsPoint) => {
    const pl = point2place(pt);
    map?.addCustom(pl, true).withDrag((point) => { dispatch(setLocation(point2place(point))); });
    dispatch(setLocation(pl));
    dispatch(showPanel());
  };

  const addMarker = () => {
    dispatch(hidePanel());
    map?.clear();
    map?.captureLocation(callback);
  };

  const removeMarker = () => {
    map?.clear();
    dispatch(setLocation(undefined));
  };

  const clearDialog = () => {
    removeMarker();
    dispatch(setName(empty));
    dispatch(setNote(empty));
  };

  const create = async () => {
    dispatch(setBlock(true));
    try {
      const pl = { name: name.trim(), location: place!.location, keywords: [], selected: [] };
      const st = {
        ...pl,
        placeId: IdGenerator.generateId(pl),
        stored: { note: note, updated: Date.now() }
      };
      await storage.createPlace(st);
      dispatch(createPlace(st));
    }
    catch (ex) { alert(ex); }
    finally { dispatch(setBlock(false)); }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <details style={{ cursor: "pointer" }}>
        <summary>
          <Typography sx={{ display: "inline-block" }}>Create custom place</Typography>
        </summary>
        <Stack direction="column" gap={2} sx={{ mt: 2 }}>
          {place
            ? <RemovableCustomListItem onMarker={() => clickMarker(place)} onDelete={removeMarker} label={place.name} />
            : <FreeCenterListItem onClick={addMarker} />
          }
          <TextField
            required
            fullWidth
            size="small"
            value={name}
            placeholder="Enter name..."
            onChange={(e) => dispatch(setName(e.target.value))}
          />
          <TextField
            fullWidth
            multiline
            size="small"
            value={note}
            placeholder="Enter optional note..."
            onChange={(e) => dispatch(setNote(e.target.value))}
          />
          <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button color="error" disabled={block} onClick={clearDialog}>Clear</Button>
            <Button disabled={block || !place || (name.trim().length <= 0)} onClick={create}>Create</Button>
          </Box>
        </Stack>
      </details>
    </Box>
  );
}

type PlacesContentProps = { places: StoredPlace[]; };

function PlacesContent({ places }: PlacesContentProps): JSX.Element {

  return (
    <Box>
      {places.length > 0
        ? <Stack direction="column" gap={2}>
            {places.map((p, i) => <Typography key={i}>{p.name}</Typography>)}
          </Stack>
        : <FavouriteStub link={SEARCH_PLACES_ADDR} text="places" icon={(sx) => <Grain sx={sx} />} />
      }
    </Box>
  );
}

export function MyPlacesSection(): JSX.Element {

  const { loaded, places } = useAppSelector(state => state.favourites);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>My Places</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {loaded
          ? <PlacesContent places={places} />
          : <Skeleton variant="rounded" height={100} />
        }
        <CustomPlaceDialog />
      </AccordionDetails>
    </Accordion>
  );
}
