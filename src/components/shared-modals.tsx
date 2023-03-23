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
  Typography
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { AppContext } from "../App";
import { useAppDispatch } from "../features/hooks";
import { hidePanel, showPanel } from "../features/panelSlice";
import { point2place } from "../utils/general";
import { MaybePlace, Point } from "../utils/grainpath";
import { PinKind, PlusPinButton } from "./shared-pin-buttons";

type SelectMaybePlaceModalProps = {
  kind: PinKind;
  hide: () => void;
  func: (place: MaybePlace) => void;
}

export function SelectMaybePlaceModal({ kind, hide, func }: SelectMaybePlaceModalProps): JSX.Element {

  const [place, setPlace] = useState<string | undefined>(undefined);

  const dispatch = useAppDispatch();
  const map = useContext(AppContext).map;

  const callback = (point: Point) => {
    func(point2place(point));
    dispatch(showPanel());
  };

  const handleCustom = () => {
    hide();
    dispatch(hidePanel());
    map?.captureLocation(callback);
  };

  const handleFavorite = () => {
    // TODO: handle favorite point by Id!
  }

  return (
    <Dialog open onClose={hide}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <span>Select point</span>
        <IconButton size="small" onClick={hide}>
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
            Select your <i>Favorite</i> point and confirm.
          </Typography>
          <Select value={place} sx={{ mt: 2, width: "100%" }} onChange={(e) => setPlace(e.target.value as string)}>
            <MenuItem value={undefined}></MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
          </Select>
          <Box sx={{ mt: 1, display: "flex", justifyContent: "right" }}>
            <Button color="primary" onClick={() => { handleFavorite(); }}>Confirm</Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
