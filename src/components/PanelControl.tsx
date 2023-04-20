import { useCallback, useContext, useEffect } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Menu } from "@mui/icons-material";
import { Box, Drawer, Fab, useMediaQuery } from "@mui/material";
import { AppContext } from "../App";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { showPanel } from "../features/panelSlice";
import {
  ENTITY_ADDR,
  FAVOURITES_ADDR,
  RESULT_DIRECT_ADDR,
  RESULT_PLACES_ADDR,
  RESULT_ROUTES_ADDR,
  SEARCH_DIRECT_ADDR,
  SEARCH_PLACES_ADDR,
  SEARCH_ROUTES_ADDR,
} from "../domain/routing";
import SearchDirectPanel from "./SearchDirectPanel";
import SearchPlacesPanel from "./SearchPlacesPanel";
import SearchRoutesPanel from "./SearchRoutesPanel";
import ResultDirectPanel from "./ResultDirectPanel";
import ResultPlacesPanel from "./ResultPlacesPanel";
import ResultRoutesPanel from "./ResultRoutesPanel";
import EntityPanel from "./EntityPanel";
import FavouritesPanel from "./FavouritesPanel";
import NotFoundPanel from "./NotFoundPanel";

export default function MainPanel(): JSX.Element {

  const dispatch = useAppDispatch();
  const { show } = useAppSelector(state => state.panel);

  const map = useContext(AppContext).map;
  const panel = useCallback(() => { dispatch(showPanel()); }, [dispatch]);

  const width = useMediaQuery("(max-width: 500px)") ? "100%" : "400px";

  useEffect(() => { panel(); }, [map, panel]);

  return (
    <HashRouter>
      <Box sx={{ position: "absolute", top: "10px", left: "10px" }}>
        <Fab color="primary" size="small" onClick={panel}>
          <Menu />
        </Fab>
      </Box>
      <Drawer open={show} variant="persistent" PaperProps={{ sx: { width: width } }}>
        <Routes>
          <Route path={SEARCH_ROUTES_ADDR} element={<SearchRoutesPanel />} />
          <Route path={SEARCH_PLACES_ADDR} element={<SearchPlacesPanel />} />
          <Route path={SEARCH_DIRECT_ADDR} element={<SearchDirectPanel />} />
          <Route path={RESULT_ROUTES_ADDR} element={<ResultRoutesPanel />} />
          <Route path={RESULT_PLACES_ADDR} element={<ResultPlacesPanel />} />
          <Route path={RESULT_DIRECT_ADDR} element={<ResultDirectPanel />} />
          <Route path={ENTITY_ADDR + "/:id"} element={<EntityPanel />} />
          <Route path={FAVOURITES_ADDR} element={<FavouritesPanel />} />
          <Route path="/" element={<Navigate to={SEARCH_ROUTES_ADDR} />} />
          <Route path="*" element={<NotFoundPanel />} />
        </Routes>
      </Drawer>
    </HashRouter>
  );
}
