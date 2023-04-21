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
import { Entity } from "../../domain/types";
import { AppContext } from "../../App";
import { IdGenerator } from "../../utils/helpers";
import { useAppDispatch } from "../../features/hooks";
import { createFavouritePlace } from "../../features/favouritesSlice";

type SaveEntityModalProps = {
  entity: Entity;
  onHide: () => void;
};

export default function SaveEntityModal({ entity, onHide }: SaveEntityModalProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { storage } = useContext(AppContext);

  const [name, setName] = useState(entity.name);
  const [disabled, setDisabled] = useState(false);

  const action = async () => {
    setDisabled(true);
    try {
      const pl = { name: name, location: entity.location, keywords: entity.keywords, selected: [] };
      const st = {
        ...pl,
        grainId: entity.grainId,
        placeId: IdGenerator.generateId(pl)
      };
      await storage.createPlace(st);
      dispatch(createFavouritePlace(st));
    }
    catch (ex) { alert(ex); }
    finally { setDisabled(false); }
  };

  return (
    <Dialog open>
      <DialogTitle>Save place</DialogTitle>
      <DialogContent>
        <Stack direction="column" gap={2}>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Box maxWidth="450px">
            <Typography fontSize="small" color="grey">
              Save operation creates a <strong>local</strong> reference (object with a name,
              location, and keywords). Such references are no longer synchronized with the server.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button disabled={disabled} onClick={onHide} color="error">Discard</Button>
            <Button disabled={disabled || !(name.trim().length > 0)} onClick={() => { action(); }}>Save</Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
