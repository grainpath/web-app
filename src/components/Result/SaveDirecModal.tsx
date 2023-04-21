import { useContext, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { AppContext } from "../../App";
import { UiDirec } from "../../domain/types";
import { IdGenerator } from "../../utils/helpers";
import { useAppDispatch } from "../../features/hooks";
import { createFavouriteDirec } from "../../features/favouritesSlice";
import { setResultDirecs } from "../../features/resultDirecsSlice";

type SaveDirecModalProps = {

  /** Direction to be saved. */
  direc: UiDirec;

  /** Action hiding modal. */
  onHide: () => void;
};

/**
 * Modal for saving a direction appeared in the result.
 */
export default function SaveDirecModal({ direc, onHide }: SaveDirecModalProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { storage } = useContext(AppContext);

  const [name, setName] = useState(direc.name);
  const [disabled, setDisabled] = useState(false);

  const save = async () => {
    setDisabled(true);
    try {
      const dr = { ...direc, name: name };
      const sd = {
        ...dr,
        direcId: IdGenerator.generateId(dr)
      };
      await storage.createDirec(sd);
      dispatch(createFavouriteDirec(sd));
      dispatch(setResultDirecs(sd));
      onHide();
    }
    catch (ex) { alert(ex); }
    finally { setDisabled(false); }
  };

  return (
    <Dialog open>
      <DialogTitle>Save direction</DialogTitle>
      <DialogContent>
        <Stack direction="column" gap={2}>
          <TextField
            value={name}
            sx={{ mt: 0.5 }}
            onChange={(e) => setName(e.target.value)}
          />
          <Box maxWidth="350px">
            <Typography fontSize="small" color="grey">
              Save operation creates a <strong>local</strong> copy of this
              direction. Local copies are no longer synchronized with the server.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button disabled={disabled} onClick={onHide} color="error">Discard</Button>
            <Button disabled={disabled || !(name.trim().length > 0)} onClick={() => { save(); }}>Save</Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
