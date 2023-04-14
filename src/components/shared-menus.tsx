import { useNavigate } from "react-router-dom";
import {
  ArrowBack,
  Close,
  Directions,
  Favorite,
  Grain,
  Route
} from "@mui/icons-material";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  IconButton
} from "@mui/material";
import {
  FAVOURITES_ADDR,
  SEARCH_DIRECT_ADDR,
  SEARCH_PLACES_ADDR,
  SEARCH_ROUTES_ADDR
} from "../domain/routing";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { hidePanel } from "../features/panelSlice";

type LogoCloseMenuProps = {
  onLogo: () => void;
};

export function LogoCloseMenu({ onLogo: logo }: LogoCloseMenuProps): JSX.Element {

  const dispatch = useAppDispatch();

  return (
    <Box sx={{ mx: 2, my: 2, display: "flex", justifyContent: "right" }}>
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
  const { block } = useAppSelector(state => state.panel);

  return (
    <Box sx={{ borderTop: 1, borderBottom: 1, borderColor: "divider" }}>
      <BottomNavigation showLabels value={value}>
        <BottomNavigationAction
          label="Routes"
          icon={<Route />}
          disabled={block}
          onClick={() => { navigate(SEARCH_ROUTES_ADDR); }}
        />
        <BottomNavigationAction
          label="Places"
          icon={<Grain />}
          disabled={block}
          onClick={() => { navigate(SEARCH_PLACES_ADDR); }}
        />
        <BottomNavigationAction
          label="Directions"
          icon={<Directions />}
          disabled={block}
          onClick={() => { navigate(SEARCH_DIRECT_ADDR); }}
        />
        <BottomNavigationAction
          label="Favourites"
          icon={<Favorite />}
          disabled={block}
          onClick={() => { navigate(FAVOURITES_ADDR); }}
        />
      </BottomNavigation>
    </Box>
  );
}
