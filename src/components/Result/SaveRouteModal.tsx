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
import { UiRoute } from "../../domain/types";
import { IdGenerator } from "../../utils/helpers";
import { useAppDispatch } from "../../features/hooks";
import { createRoute } from "../../features/favouritesSlice";
import { replaceResultRoute } from "../../features/resultRoutesSlice";

type SaveRouteModalProps = {

  /** */
  index: number;

  /** */
  route: UiRoute;

  /** */
  onHide: () => void;
};

export default function SaveRouteModal({ index, route, onHide }: SaveRouteModalProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { storage } = useContext(AppContext);

  const [name, setName] = useState(route.name);
  const [disabled, setDisabled] = useState(false);

  const action = async () => {
    setDisabled(true);
    try {
      const rt = { ...route, name: name };
      const sr = {
        ...rt,
        routeId: IdGenerator.generateId(rt)
      };
      await storage.createRoute(sr);
      dispatch(createRoute(sr));
      dispatch(replaceResultRoute({ route: sr, index: index }));
      onHide();
    }
    catch (ex) { alert(ex); }
    finally { setDisabled(false); }
  };

  return (
    <Dialog open>
      <DialogTitle>Save route</DialogTitle>
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
              route. Local copies are no longer synchronized with the server.
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
