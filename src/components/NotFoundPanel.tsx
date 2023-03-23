import { useNavigate } from "react-router-dom";
import { Alert, Offcanvas } from "react-bootstrap";

import { DISCOVER_ADDR, FAVORITE_ADDR } from "../utils/routing";
import { SearchButton, LockerButton } from "./PanelPrimitives";

export default function NotFoundPanel(): JSX.Element {

  const navigate = useNavigate();

  return(
    <>
      <Offcanvas.Header closeButton>
        <SearchButton onClick={() => navigate(DISCOVER_ADDR)} />
        <LockerButton onClick={() => navigate(FAVORITE_ADDR)} />
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Alert variant="warning">Oops! Unknown address...</Alert>
      </Offcanvas.Body>
    </>
  );
}
