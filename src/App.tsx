import { createContext, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

import {
  LOCKER_ADDR,
  NOT_FOUND_ADDR,
  POINTS_ADDR,
  SEARCH_ADDR,
  SHAPES_ADDR
} from "./utils/constants";
import { store } from "./features/store";
import { context } from "./features/context";
import MapControl from "./components/MapControl";
import { PanelButton } from "./components/PanelControl";
import SearchPanel from "./components/SearchPanel";
import LockerPanel from "./components/LockerPanel";
import ShapesPanel from "./components/ShapesPanel";
import PointsPanel from "./components/PointsPanel";
import NotFoundPanel from "./components/NotFoundPanel";
import LoggerControl from "./components/LoggerControl";

export const AppContext = createContext(context);

export default function App(): JSX.Element {
  const [visible, setVisible] = useState(true);

  return (
    <Provider store={store}>
      <MapControl />
      <PanelButton onClick={() => setVisible(true)} />
      <HashRouter>
        <Offcanvas show={visible} onHide={() => setVisible(false)} backdrop={false} keyboard={false} scroll>
          <Routes>
            <Route path={SEARCH_ADDR} element={<SearchPanel />} />
            <Route path={LOCKER_ADDR} element={<LockerPanel />} />
            <Route path={SHAPES_ADDR} element={<ShapesPanel />} />
            <Route path={POINTS_ADDR} element={<PointsPanel />} />
            <Route path={NOT_FOUND_ADDR} element={<NotFoundPanel />} />
            <Route path="/" element={<Navigate to={SEARCH_ADDR} />} />
            <Route path="*" element={<NotFoundPanel />} />
          </Routes>
        </Offcanvas>
      </HashRouter>
      <LoggerControl />
    </Provider>
  );
}
