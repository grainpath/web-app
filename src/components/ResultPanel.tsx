import { Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { SEARCH_ADDR, LOCKER_ADDR } from "../utils/const";
import { SearchButton, LockerButton } from "./PanelControl";

function ResultHead(): JSX.Element {

  const navigate = useNavigate();

  return (
    <Offcanvas.Header closeButton>
      <SearchButton onClick={() => navigate(SEARCH_ADDR)} />
      <LockerButton onClick={() => navigate(LOCKER_ADDR)} />
    </Offcanvas.Header>
  );
}

function ResultBody(): JSX.Element {

  return (
    <Offcanvas.Body></Offcanvas.Body>
  );
}

export default function ResultPanel(): JSX.Element {

  return (
    <>
      <ResultHead />
      <ResultBody />
    </>
  );
}
