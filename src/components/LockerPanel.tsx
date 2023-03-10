import { useState } from "react";
import { Alert, Form, Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";

import { SEARCH_ADDR } from "../utils/general";
import { useAppSelector } from "../features/hooks";
import { lineContainerStyle, SimpleButtonProps } from "./PanelPrimitives";
import { SearchButton } from "./PanelPrimitives";
import PodModal from "./Locker/PodModal";
import LockerPanes from "./Locker/LockerPanes";

function LockerHead(): JSX.Element {

  const navigate = useNavigate();

  return(
    <Offcanvas.Header closeButton>
      <SearchButton onClick={() => navigate(SEARCH_ADDR)} />
    </Offcanvas.Header>
  );
}

function ConfigureButton(props: SimpleButtonProps): JSX.Element {

  return (
    <button {...props} className="standard-button" title="Pod configuration">
      <SettingsApplicationsIcon fontSize="large" />
    </button>
  );
}

function LockerContent(): JSX.Element {

  const [mod, setMod] = useState(false);
  const pod = useAppSelector(state => state.locker.podCurr);

  return (
    <>
      <Form.Group {...lineContainerStyle} className="mt-2 mb-4">
        <Form.Control type="text" placeholder="Select Pod..." defaultValue={pod} readOnly />
        <ConfigureButton onClick={() => setMod(true)} />
      </Form.Group>
      { pod && <LockerPanes pod={pod} /> }
      { mod && <PodModal onHide={() => setMod(false)} /> }
    </>
  );
}

function LockerBody(): JSX.Element {

  const isLoggedIn = useAppSelector(state => state.logger.isLoggedIn);

  return (
    <Offcanvas.Body>
      { isLoggedIn ? <LockerContent /> : <Alert variant="info">Log in to your Solid Pod to see the content.</Alert> }
    </Offcanvas.Body>
  );
}

export default function LockerPanel(): JSX.Element {

  return (
    <>
      <LockerHead />
      <LockerBody />
    </>
  );
}
