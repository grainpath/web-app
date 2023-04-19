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

type ItemListMenuProps = {

  /** Redirect to the something view. */
  onShow?: () => void;

  /** Shows delete modal. */
  showDelete: () => void;

  /** Shows update modal. */
  showUpdate: () => void;
};

/**
 * Place-specific menu in the storage list of places.
 */
export default function ItemListMenu({ onShow, showDelete , showUpdate }: ItemListMenuProps): JSX.Element {

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const onClose = () => { setAnchorEl(null); };

  return (
    <Box>
      <IconButton size="small" onClick={onClick}><MoreVert /></IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
        {onShow &&
          <MenuItem onClick={onShow}>
            <ListItemIcon><Link fontSize="small" /></ListItemIcon>
            <Typography>Show</Typography>
          </MenuItem>
        }
        <MenuItem onClick={() => { showUpdate(); onClose(); }}>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          <Typography>Edit</Typography>
        </MenuItem>
        <MenuItem onClick={() => { showDelete(); onClose(); }}>
          <ListItemIcon><Delete fontSize="small" /></ListItemIcon>
          <Typography>Delete</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
