import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  ButtonProps,
  Icon,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
  styled
} from "@mui/material";
import { SESSION_SOLID_ADDR } from "../domain/routing";
import { SolidProvider } from "../utils/solidProvider";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { showPanel } from "../features/panelSlice";
import { setLogin, setSolid } from "../features/sessionSlice";
import { setSolidRedirect, setSolidWebId } from "../features/solidSlice";
import { SESSION_SOLID_ICON } from "./session/icons";
import SolidLoginDialog from "./session/SolidLoginDialog";

const SessionButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#FFFFFF",
  }
}));

export default function SessionProvider():JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // state

  const {
    login,
    solid
  } = useAppSelector(state => state.session);

  // menu

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const clickMenuAction = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const closeMenuAction = () => { setAnchorEl(null); };

  // solid

  const {
    redirect: solidRedirect
  } = useAppSelector(state => state.solid);

  const [solidLoginDialog, setSolidLoginDialog] = useState(false);

  useEffect(() => {
    if (!solidRedirect) {
      SolidProvider.redirect(
        (webId: string) => {
          dispatch(setLogin());
          dispatch(setSolid());
          dispatch(setSolidWebId(webId));
          navigate(SESSION_SOLID_ADDR);
        },
        (error: string | null) => { console.log(`[Solid error] ${error}`); },
        () => {
          console.log("Solid logged out.");
        }
      );
      dispatch(setSolidRedirect());
    }
  }, [solidRedirect]);

  // session

  const sessionAction = () => {
    dispatch(showPanel());
    if (solid) { navigate(SESSION_SOLID_ADDR); }
  };

  return (
    <Box sx={{ position: "absolute", top: "10px", right: "10px", zIndex: 1000 }}>
      {!login
        ? <Box>
            <SessionButton onClick={clickMenuAction} variant="outlined" color="primary">
              Log in
            </SessionButton>
            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={closeMenuAction}>
              <MenuItem onClick={() => { setSolidLoginDialog(true); closeMenuAction(); }}>
                <ListItemIcon>
                  <Icon sx={{ display: "flex" }}>
                    <img src={SESSION_SOLID_ICON} />
                  </Icon>
                </ListItemIcon>
                <Typography>Solid</Typography>
              </MenuItem>
            </Menu>
          </Box>
        : <SessionButton onClick={sessionAction} variant="outlined" color="success">
            Session
          </SessionButton>
      }
      {solidLoginDialog && <SolidLoginDialog onHide={() => { setSolidLoginDialog(false); }} />}
    </Box>
  );
}
