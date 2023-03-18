import { Offcanvas } from "react-bootstrap";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { showPanel, hidePanel } from "../features/panelSlice";
import { LOCKER_ADDR, PLACES_ADDR, RESULT_ADDR, SEARCH_ADDR } from "../utils/routing";
import { PanelButton } from "./PanelPrimitives";
import SearchPanel from "./SearchPanel";
import LockerPanel from "./LockerPanel";
import PlacesPanel from "./PlacesPanel";
import ResultPanel from "./ResultPanel";
import NotFoundPanel from "./NotFoundPanel";

export default function MainPanel(): JSX.Element {

  const dispatch = useAppDispatch();
  const show = useAppSelector(state => state.panel.show);
  const disabled = useAppSelector(state => state.panel.disabled);

  return (
    <HashRouter>
      <PanelButton disabled={disabled} onClick={() => dispatch(showPanel())} />
      <Offcanvas show={show} onHide={() => dispatch(hidePanel())} backdrop={false} keyboard={false} scroll>
        <Routes>
          <Route path={SEARCH_ADDR} element={<SearchPanel />} />
          <Route path={LOCKER_ADDR} element={<LockerPanel />} />
          <Route path={RESULT_ADDR} element={<ResultPanel />} />
          <Route path={PLACES_ADDR + "/:id"} element={<PlacesPanel />} />
          <Route path="/" element={<Navigate to={SEARCH_ADDR} />} />
          <Route path="*" element={<NotFoundPanel />} />
        </Routes>
      </Offcanvas>
    </HashRouter>
  );
}
