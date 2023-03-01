import { createContext, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

import { SEARCH_ADDR, LOCKER_ADDR, RESULT_ADDR, POINTS_ADDR } from "./utils/const";
import { store } from "./features/store";
import { context } from "./features/context";
import MapControl from "./components/MapControl";
import { PanelButton } from "./components/PanelControl";
import SearchPanel from "./components/SearchPanel";
import LockerPanel from "./components/LockerPanel";
import ResultPanel from "./components/ResultPanel";
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
            <Route path={RESULT_ADDR} element={<ResultPanel />} />
            <Route path={POINTS_ADDR} element={<PointsPanel />} />
            <Route path="/" element={<Navigate to={SEARCH_ADDR} />} />
            <Route path="*" element={<NotFoundPanel />} />
          </Routes>
        </Offcanvas>
      </HashRouter>
      <LoggerControl />
    </Provider>
  );
}
