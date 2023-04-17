import {
  Fragment,
  useContext,
  useEffect,
  useState
} from "react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { AppContext } from "../App";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { hidePanel, showPanel } from "../features/panelSlice";
import { point2place } from "../utils/helpers";
import { WgsPoint, UiPlace, StoredPlace } from "../domain/types";
import { EntityKind, PinKind } from "./shared-types";
import { PlusPinButton } from "./shared-pin-buttons";
import { setPlaces, setPlacesLoaded } from "../features/favouritesSlice";

type SelectPlaceModalProps = {
  kind: PinKind;
  onHide: () => void;
  func: (place: UiPlace) => void;
};

export function SelectPlaceModal({ kind, onHide, func }: SelectPlaceModalProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { map, storage } = useContext(AppContext);

  // custom place

  const callback = (point: WgsPoint) => {
    func(point2place(point));
    dispatch(showPanel());
  };

  const handleCustom = () => {
    onHide();
    dispatch(hidePanel());
    map?.captureLocation(callback);
  };

  // stored place

  const { places, placesLoaded } = useAppSelector(state => state.favourites);
  const [place, setPlace] = useState<StoredPlace | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!placesLoaded) {
        try {
          dispatch(setPlaces(await storage.getAllPlaces()));
          dispatch(setPlacesLoaded());
        }
        catch (ex) { alert(ex); }
      }
    };
    load();
  }, [storage, dispatch, placesLoaded]);

  const handleFavourites = () => {
    onHide();
    func(place!);
  };

  return (
    <Dialog open onClose={onHide}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <span>Select point</span>
        <IconButton size="small" onClick={onHide}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography>
          Click <PlusPinButton kind={kind} size="large" onMarker={handleCustom} /> to select a location.
        </Typography>
        <Divider>
          <Typography>OR</Typography>
        </Divider>
        <Stack direction="column" gap={2} sx={{ mt: 2 }}>
          <Typography>
            Select a place from <b>Favourites</b>.
          </Typography>
          <Autocomplete
            options={places}
            loading={!placesLoaded}
            onChange={(_, v) => { setPlace(v); }}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.placeId === value.placeId}
            renderInput={(params) => (
              <TextField
                {...params}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Fragment>
                      {!placesLoaded ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </Fragment>
                  )
                }}
              />
            )}
          />
          <Box sx={{ mt: 1, display: "flex", justifyContent: "right" }}>
            <Button color="primary" disabled={!place} onClick={() => { handleFavourites(); }}>Confirm</Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

type EditModalProps = {
  name: string;
  what: EntityKind;
  onHide: () => void;
  onSave: (name: string) => void;
};

export function EditModal({ name: oldName, what, onHide, onSave }: EditModalProps): JSX.Element {

  const [name, setName] = useState(oldName);
  const [disabled, setDisabled] = useState(false);

  const action = async () => {
    setDisabled(true);
    try {
      onSave(name);
      onHide();
    }
    catch (ex) { alert(ex); }
    finally { setDisabled(false); }
  };

  return (
    <Dialog open>
      <DialogTitle>Edit {what}</DialogTitle>
      <DialogContent>
        <Stack direction="column" gap={2}>
          <Typography>Enter new name:</Typography>
          <TextField
            fullWidth
            value={name}
            onChange={(e) => { setName(e.target.value); }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", minWidth: "300px" }}>
            <Button disabled={disabled} onClick={onHide} color="error">Discard</Button>
            <Button disabled={disabled || !(name.trim().length > 0)} onClick={() => { action(); }}>Save</Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

type DeleteModalProps = {
  name: string;
  what: EntityKind;
  onHide: () => void;
  onDelete: () => void;
};

export function DeleteModal({ name, what, onHide, onDelete }: DeleteModalProps): JSX.Element {

  const [disabled, setDisabled] = useState(false);

  const action = async () => {
    setDisabled(true);
    try {
      onDelete();
      onHide();
    }
    catch (ex) { alert(ex); }
    finally { setDisabled(false); }
  };

  return (
    <Dialog open>
      <DialogTitle>Delete {what}</DialogTitle>
      <DialogContent>
        <Stack direction="column" gap={2}>
          <Typography>
            You are about to delete <b>{name}</b>. Please confirm the action.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button disabled={disabled} onClick={onHide}>Cancel</Button>
            <Button disabled={disabled} onClick={() => { action(); }} color="error">Delete</Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
