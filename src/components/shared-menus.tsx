import { useNavigate } from "react-router-dom";
import {
  ArrowBack,
  Close,
  Directions,
  Favorite,
  Search
} from "@mui/icons-material";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  IconButton
} from "@mui/material";
import {
  DISCOVER_ADDR,
  NAVIGATE_ADDR,
  FAVORITE_ADDR
} from "../utils/routing";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { hidePanel } from "../features/panelSlice";

type LogoCloseMenuProps = {
  logo: () => void;
};

export function LogoCloseMenu({ logo }: LogoCloseMenuProps): JSX.Element {

  const dispatch = useAppDispatch();

  return (
    <Box sx={{ mx: 2, my: 1, display: "flex", justifyContent: "right" }}>
      <IconButton size="small" onClick={() => { dispatch(hidePanel()); }}>
        <Close fontSize="medium" />
      </IconButton>
    </Box>
  );
}

type BackCloseMenuProps = {
  back: () => void;
};

export function BackCloseMenu({ back }: BackCloseMenuProps): JSX.Element {

  const dispatch = useAppDispatch();

  return (
    <Box sx={{ mx: 2, my: 1, display: "flex", justifyContent: "space-between" }}>
      <Button startIcon={<ArrowBack />} onClick={back}>Back</Button>
      <IconButton size="small" onClick={() => { dispatch(hidePanel()); }}>
        <Close fontSize="medium" />
      </IconButton>
    </Box>
  );
}

type MainMenuProps = {
  value: number;
};

export function MainMenu({ value }: MainMenuProps): JSX.Element {

  const navigate = useNavigate();
  const { loading } = useAppSelector(state => state.panel);

  return (
    <Box sx={{ borderTop: 1, borderBottom: 1, borderColor: "divider" }}>
      <BottomNavigation showLabels value={value}>
        <BottomNavigationAction
          label="Discover"
          icon={<Search />}
          disabled={loading}
          onClick={() => { navigate(DISCOVER_ADDR); }}
        />
        <BottomNavigationAction
          label="Navigate"
          icon={<Directions />}
          disabled={loading}
          onClick={() => { navigate(NAVIGATE_ADDR); }}
        />
        <BottomNavigationAction
          label="Favorite"
          icon={<Favorite />}
          disabled={loading}
          onClick={() => { navigate(FAVORITE_ADDR); }}
        />
      </BottomNavigation>
    </Box>
  );
}
