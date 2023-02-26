import { Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { QUERY_ADDR, VAULT_ADDR } from "../utils/const";
import { QueryButton, VaultButton } from "./PanelControl";

function ArtifactHeader(): JSX.Element {

  const navigate = useNavigate();

  return (
    <Offcanvas.Header closeButton>
      <QueryButton onClick={() => navigate(QUERY_ADDR)} />
      <VaultButton onClick={() => navigate(VAULT_ADDR)} />
    </Offcanvas.Header>
  );
}

function ArtifactBody(): JSX.Element {

  return (<Offcanvas.Body></Offcanvas.Body>);
}

export default function ArtifactPanel(): JSX.Element {

  return (
    <>
      <ArtifactHeader />
      <ArtifactBody />
    </>
  );
}
