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

  /** Action upon clicking on a logo. */
  onLogo: () => void;
};

/**
 * Upper menu with logo and close buttons.
 */
export function LogoCloseMenu({ onLogo: _ }: LogoCloseMenuProps): JSX.Element {

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

  /** Action navigating back. */
  onBack?: () => void;
};

/**
 * Upper menu with back and close buttons.
 */
export function BackCloseMenu({ onBack }: BackCloseMenuProps): JSX.Element {

  const dispatch = useAppDispatch();

  return (
    <Box sx={{ mx: 2, my: 2, display: "flex", justifyContent: "space-between" }}>
      <Box>
        {(!!onBack) && <Button startIcon={<ArrowBack />} onClick={onBack}>Back</Button>}
      </Box>
      <IconButton size="small" onClick={() => { dispatch(hidePanel()); }}>
        <Close fontSize="medium" />
      </IconButton>
    </Box>
  );
}

type MainMenuProps = {

  /** Identifier of a panel that is currently shown. */
  panel: number;
};

/**
 * Standard four-section menu (routes, places, directions, and favourites).
 */
export function MainMenu({ panel }: MainMenuProps): JSX.Element {

  const navigate = useNavigate();
  const { block } = useAppSelector(state => state.panel);

  return (
    <Box sx={{ borderTop: 1, borderBottom: 1, borderColor: "divider" }}>
      <BottomNavigation showLabels value={panel}>
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
