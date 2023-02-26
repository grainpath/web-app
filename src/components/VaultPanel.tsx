import { Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../features/hooks";
import { QUERY_ADDR } from "../utils/const";
import { QueryButton } from "./PanelControl";

export default function VaultPanel(): JSX.Element {

  const navigate = useNavigate();
  const isLoggedIn = useAppSelector(state => state.logger.isLoggedIn);

  return (
    <>
      <Offcanvas.Header closeButton>
        <QueryButton onClick={() => navigate(QUERY_ADDR)} />
      </Offcanvas.Header>
      <Offcanvas.Body>
      </Offcanvas.Body>
    </>
  );
}
