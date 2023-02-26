import { createContext, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { ARTIFACT_ADDR, QUERY_ADDR, VAULT_ADDR } from "./utils/const";
import { store } from "./features/store";
import { context } from "./features/context";
import MapControl from "./components/MapControl";
import { PanelButton } from "./components/PanelControl";
import QueryPanel from "./components/QueryPanel";
import VaultPanel from "./components/VaultPanel";
import NotFoundPanel from "./components/NotFoundPanel";
import LoggerControl from "./components/LoggerControl";
import ArtifactPanel from "./components/ArtifactPanel";

export const AppContext = createContext(context);

export default function App(): JSX.Element {
  const [visible, setVisible] = useState(true);

  return (
    <Provider store={store}>
      <MapControl />
      <PanelButton onClick={() => setVisible(true)} />
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Offcanvas show={visible} onHide={() => setVisible(false)} backdrop={false} keyboard={false} scroll>
          <Routes>
            <Route path={QUERY_ADDR} element={<QueryPanel />} />
            <Route path={VAULT_ADDR} element={<VaultPanel />} />
            <Route path={ARTIFACT_ADDR} element={<ArtifactPanel />} />
            {/* <Route path="/point/:id" element={<PointPanel />} /> */}
            <Route path="/" element={<Navigate to={QUERY_ADDR} />} />
            <Route path="*" element={<NotFoundPanel />} />
          </Routes>
        </Offcanvas>
      </BrowserRouter>
      <LoggerControl />
    </Provider>
  );
}
