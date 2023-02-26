import { useNavigate } from "react-router-dom";
import { Offcanvas } from "react-bootstrap";
import { QueryButton, VaultButton } from "./PanelControl";
import { QUERY_ADDR, VAULT_ADDR } from "../utils/const";

export default function NotFoundPanel(): JSX.Element {

  const navigate = useNavigate();

  return(
    <>
      <Offcanvas.Header closeButton>
        <QueryButton onClick={() => navigate(QUERY_ADDR)} />
        <VaultButton onClick={() => navigate(VAULT_ADDR)} />
      </Offcanvas.Header>
      <Offcanvas.Body>
        Oops! Unknown address...
      </Offcanvas.Body>
    </>
  );
}
