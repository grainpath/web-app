import { Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { SEARCH_ADDR, LOCKER_ADDR } from "../utils/general";
import { SearchButton, LockerButton } from "./PanelPrimitives";

function RoutesHead(): JSX.Element {

  const navigate = useNavigate();

  return (
    <Offcanvas.Header closeButton>
      <SearchButton onClick={() => navigate(SEARCH_ADDR)} />
      <LockerButton onClick={() => navigate(LOCKER_ADDR)} />
    </Offcanvas.Header>
  );
}

function RoutesBody(): JSX.Element {

  return (
    <Offcanvas.Body></Offcanvas.Body>
  );
}

export default function RoutesPanel(): JSX.Element {

  return (
    <>
      <RoutesHead />
      <RoutesBody />
    </>
  );
}
