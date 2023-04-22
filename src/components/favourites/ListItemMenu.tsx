import { useState } from "react";
import {
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography
} from "@mui/material";
import {
  Delete,
  Edit,
  Link,
  MoreVert
} from "@mui/icons-material";

type ListItemMenuProps = {

  /** Redirect to the something view. */
  onShow?: () => void;

  /** Shows delete modal. */
  showDelete: () => void;

  /** Shows update modal. */
  showUpdate: () => void;
};

/**
 * `Something`-specific menu in the storage list of `something`.
 */
export default function ListItemMenu({ onShow, showDelete , showUpdate }: ListItemMenuProps): JSX.Element {

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const clickAction = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const closeAction = () => { setAnchorEl(null); };

  return (
    <Box>
      <IconButton size="small" onClick={clickAction}><MoreVert /></IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeAction}>
        {onShow &&
          <MenuItem onClick={onShow}>
            <ListItemIcon><Link fontSize="small" /></ListItemIcon>
            <Typography>Show</Typography>
          </MenuItem>
        }
        <MenuItem onClick={() => { showUpdate(); closeAction(); }}>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          <Typography>Edit</Typography>
        </MenuItem>
        <MenuItem onClick={() => { showDelete(); closeAction(); }}>
          <ListItemIcon><Delete fontSize="small" /></ListItemIcon>
          <Typography>Delete</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
