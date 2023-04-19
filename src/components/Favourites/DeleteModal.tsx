import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography
} from "@mui/material";
import { EntityKind } from "../shared-types";

type DeleteModalProps = {

  /** */
  name: string;

  /** */
  what: EntityKind;

  /** */
  onHide: () => void;

  /** */
  onDelete: () => void;
};

export default function DeleteModal({ name, what, onHide, onDelete }: DeleteModalProps): JSX.Element {

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
