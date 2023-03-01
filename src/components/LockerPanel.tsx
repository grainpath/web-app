import { useContext, useState } from "react";
import { Alert, Button, Form, Modal, Offcanvas, Tab, Tabs } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import { createSolidDataset, getSolidDataset, SolidDataset, UrlString } from "@inrupt/solid-client";

import { AppContext } from "../App";
import { SimpleButtonProps } from "./types";
import { DATASET_ADDR, SEARCH_ADDR } from "../utils/const";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { setCurrentPod } from "../features/loggerSlice";
import { SearchButton, StandardButton } from "./PanelControl";

type LockerModalProps = { onHide: () => void; }

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
    <StandardButton {...props} icon={<SettingsApplicationsIcon fontSize="large" />} title="Configure Pod" />
  );
}

function LockerPanes(): JSX.Element {

  return (
    <Tabs defaultActiveKey="points" fill className="mb-4 mt-4">
      <Tab eventKey="points" title="Points">
      </Tab>
      <Tab eventKey="results" title="Results">
      </Tab>
    </Tabs>
  );
};

function LockerModal({ onHide }: LockerModalProps): JSX.Element {

  const session = useContext(AppContext).inrupt.session;
  const datamap = useContext(AppContext).inrupt.datamap;

  const podUrls = useAppSelector(state => state.logger.podUrls) ?? [];
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [pod, setPod] = useState<UrlString | undefined>(podUrls[0]);

  const confirm = async () => {

    if (pod) {
      setLoading(true);
      let dataset: SolidDataset | undefined = undefined;

      try {
        dataset = await getSolidDataset(pod + DATASET_ADDR, { fetch: session.fetch });
      }
      catch (err: any) {
        if (typeof err.statusCode === "number" && err.statusCode === 404) { dataset = createSolidDataset(); }
      }
      finally {
        if (dataset) {
          datamap.set(pod, dataset);
          dispatch(setCurrentPod(pod));
          onHide();
        }
        else {
          alert("[Solid Error] Cannot obtain dataset from the selected Solid Pod.");
        }
        setLoading(false);
      }
    }
  };

  return (
    <Modal show={true} backdrop="static" centered={true} keyboard={false}>
      <Modal.Body>
        <Form.Label>Available Pods</Form.Label>
        <Form.Group>
          <Form.Select value={pod} disabled={loading} onChange={(e) => setPod(e.target.value)}>
            {
              podUrls.map((url, i) => <option key={i} value={url}>{url}</option>)
            }
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" disabled={loading} onClick={onHide}>Cancel</Button>
        <Button variant="primary" disabled={loading} onClick={confirm}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
}

function LockerContent(): JSX.Element {

  const [modal, setModal] = useState(false);
  const currentPod = useAppSelector(state => state.logger.currentPod);

  return (
    <>
      <Form.Group style={{ display: "flex", alignItems: "center", justifyContent: "center" }} className="mt-4 mb-4">
        <Form.Label>Pod</Form.Label>
        <Form.Control type="text" placeholder="Configure Pod..." defaultValue={currentPod} readOnly />
        <ConfigureButton onClick={() => setModal(true)} />
      </Form.Group>
      {currentPod && <LockerPanes />}
      {modal && <LockerModal onHide={() => setModal(false)} />}
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
