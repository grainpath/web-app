import { createContext, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

import { LOCKER_ADDR, PLACES_ADDR, ROUTES_ADDR, SEARCH_ADDR } from "./utils/general";
import { store } from "./features/store";
import { context } from "./features/context";
import MapControl from "./components/MapControl";
import { PanelButton } from "./components/PanelPrimitives";
import SearchPanel from "./components/SearchPanel";
import LockerPanel from "./components/LockerPanel";
import PlacesPanel from "./components/PlacesPanel";
import RoutesPanel from "./components/RoutesPanel";
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
            <Route path={ROUTES_ADDR} element={<RoutesPanel />} />
            <Route path={PLACES_ADDR + "/:id"} element={<PlacesPanel />} />
            <Route path="/" element={<Navigate to={SEARCH_ADDR} />} />
            <Route path="*" element={<NotFoundPanel />} />
          </Routes>
        </Offcanvas>
      </HashRouter>
      <LoggerControl />
    </Provider>
  );
}
