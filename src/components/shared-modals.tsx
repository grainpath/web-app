import { useContext, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { AppContext } from "../App";
import { useAppDispatch } from "../features/hooks";
import { hidePanel, showPanel } from "../features/panelSlice";
import { point2place } from "../utils/helpers";
import { WgsPoint, UiPlace } from "../domain/types";
import { EntityKind, PinKind } from "./shared-types";
import { PlusPinButton } from "./shared-pin-buttons";

type SelectPlaceModalProps = {
  kind: PinKind;
  onHide: () => void;
  func: (place: UiPlace) => void;
};

export function SelectPlaceModal({ kind, onHide, func }: SelectPlaceModalProps): JSX.Element {

  const [place, setPlace] = useState<string | undefined>(undefined);

  const dispatch = useAppDispatch();
  const map = useContext(AppContext).map;

  const callback = (point: WgsPoint) => {
    func(point2place(point));
    dispatch(showPanel());
  };

  const handleCustom = () => {
    onHide();
    dispatch(hidePanel());
    map?.captureLocation(callback);
  };

  const handleFavourites = () => {
    // TODO: handle favorite point by Id!
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
        <Divider>OR</Divider>
        <Box sx={{ mt: 2 }}>
          <Typography>
            Select your <i>Favourite</i> place and confirm.
          </Typography>
          <Select value={place} sx={{ mt: 2, width: "100%" }} onChange={(e) => setPlace(e.target.value as string)}>
            <MenuItem value={undefined}></MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
          </Select>
          <Box sx={{ mt: 1, display: "flex", justifyContent: "right" }}>
            <Button color="primary" onClick={() => { handleFavourites(); }}>Confirm</Button>
          </Box>
        </Box>
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

export function EditModal({ name, what, onHide, onSave }: EditModalProps): JSX.Element {

  const [newName, setNewName] = useState(name);
  const [disabled, setDisabled] = useState(false);

  const action = async () => {
    setDisabled(true);
    try {
      onSave(newName);
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
            value={newName}
            
            onChange={(e) => { setNewName(e.target.value); }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button disabled={disabled} onClick={onHide} color="error">Discard</Button>
            <Button disabled={disabled || !(newName.trim().length > 0)} onClick={() => { action(); }}>Save</Button>
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
            You are about to delete <b>{name}</b>. Please, confirm the action.
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
