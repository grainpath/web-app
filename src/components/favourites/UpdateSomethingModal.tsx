import { useState } from "react";
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
import { SomethingKind } from "../shared-types";

type UpdateSomethingModalProps = {

  /** Old name of `something`. */
  name: string;

  /** `Something` that will be updated. */
  what: SomethingKind;

  /** Callback for hiding modal. */
  onHide: () => void;

  /** Callback performing `update`. */
  onUpdate: (name: string) => void;
};

export default function UpdateSomethingModal({ name: oldName, what, onHide, onUpdate }: UpdateSomethingModalProps): JSX.Element {

  const [name, setName] = useState(oldName);
  const [disabled, setDisabled] = useState(false);

  const update = async () => {
    setDisabled(true);
    try {
      onUpdate(name);
      onHide();
    }
    catch (ex) { alert(ex); }
    finally { setDisabled(false); }
  };

  return (
    <Dialog open>
      <DialogTitle>Update {what}</DialogTitle>
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
            <Button disabled={disabled || !(name.trim().length > 0)} onClick={() => { update(); }}>Update</Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}