import { useCallback, useContext, useEffect } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Box, Drawer, Fab, useMediaQuery } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { showPanel } from "../features/panelSlice";
import {
  DISCOVER_ADDR,
  NAVIGATE_ADDR,
  FAVORITE_ADDR,
  PLACES_ADDR,
  RESULT_PLACES_ADDR,
  RESULT_ROUTES_ADDR
} from "../utils/routing";
import { AppContext } from "../App";
import DiscoverPanel from "./DiscoverPanel";
import NavigatePanel from "./NavigatePanel";
import FavoritePanel from "./FavoritePanel";
import PlacesPanel from "./PlacesPanel";
import ResultPanel from "./ResultPanel";
import NotFoundPanel from "./NotFoundPanel";
import { Menu } from "@mui/icons-material";

export default function MainPanel(): JSX.Element {

  const dispatch = useAppDispatch();
  const { show } = useAppSelector(state => state.panel);

  const map = useContext(AppContext).map;
  const panel = useCallback(() => { dispatch(showPanel()); }, [dispatch]);

  useEffect(() => { panel(); }, [map, panel]);

  const small = useMediaQuery("(max-width: 500px)");
  const width = (small) ? ("100%") : ("400px");

  return (
    <HashRouter>
      <Box sx={{ position: "absolute", top: "10px", left: "10px" }}>
        <Fab color="primary" size="small" onClick={panel}>
          <Menu />
        </Fab>
      </Box>
      <Drawer open={show} variant="persistent" PaperProps={{ sx: { width: width } }}>
        <Routes>
          <Route path={DISCOVER_ADDR} element={<DiscoverPanel />} />
          <Route path={NAVIGATE_ADDR} element={<NavigatePanel />} />
          <Route path={FAVORITE_ADDR} element={<FavoritePanel />} />
          <Route path={RESULT_PLACES_ADDR} element={<ResultPanel />} />
          <Route path={RESULT_ROUTES_ADDR} element={<ResultPanel />} />
          <Route path={PLACES_ADDR + "/:id"} element={<PlacesPanel />} />
          <Route path="/" element={<Navigate to={DISCOVER_ADDR} />} />
          <Route path="*" element={<NotFoundPanel />} />
        </Routes>
      </Drawer>
    </HashRouter>
  );
}
