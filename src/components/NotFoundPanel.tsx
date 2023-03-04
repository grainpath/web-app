import { useNavigate } from "react-router-dom";
import { Alert, Offcanvas } from "react-bootstrap";

import { SEARCH_ADDR, LOCKER_ADDR } from "../utils/constants";
import { SearchButton, LockerButton } from "./PanelControl";

function NotFoundHead(): JSX.Element {

  const navigate = useNavigate();

  return (
    <Offcanvas.Header closeButton>
      <SearchButton onClick={() => navigate(SEARCH_ADDR)} />
      <LockerButton onClick={() => navigate(LOCKER_ADDR)} />
    </Offcanvas.Header>
  );
}

function NotFoundBody(): JSX.Element {

  return (
    <Offcanvas.Body>
      <Alert variant="warning">Oops! Unknown address...</Alert>
    </Offcanvas.Body>
  );
}

export default function NotFoundPanel(): JSX.Element {

  return(
    <>
      <NotFoundHead />
      <NotFoundBody />
    </>
  );
}
