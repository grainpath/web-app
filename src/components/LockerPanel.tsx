import { useContext, useState } from "react";
import { Alert, Button, Form, Modal, Offcanvas, Tab, Tabs } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import { getStringNoLocale, getThingAll, Thing, UrlString } from "@inrupt/solid-client";

import { AppContext } from "../App";
import { ns } from "../utils/general";
import { SimpleButtonProps } from "./PanelPrimitives";
import { SEARCH_ADDR } from "../utils/general";
import { fetchSolidDataset, SOLID_POINTS_DATASET, SOLID_SHAPES_DATASET } from "../utils/solid";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { setPodCurr } from "../features/lockerSlice";
import { SearchButton } from "./PanelPrimitives";
import LockerItem from "./Locker/LockerItem";

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
    <button {...props} className="standard-button" style={{ marginLeft: "10px" }} title="Settings">
      <SettingsApplicationsIcon fontSize="large" />
    </button>
  );
}

// locker panes

type LockerPanesProps = { pod: string }

function LockerPanes({ pod }: LockerPanesProps): JSX.Element {

  const { points, shapes } = useContext(AppContext).locker.data.get(pod)!;

  const [pts, sts] = [points, shapes].map((dataset) => {
    return getThingAll(dataset).map((thing) => {
      return { thing: thing, label: getStringNoLocale(thing, ns.skos.prefLabel)! };
    });
  });

  const seePoint = (thing: Thing): void => {
    console.log(thing.url);
  };

  const delPoint = (thing: Thing): void => {
    console.log(thing.url);
  };

  const seeShape = (thing: Thing): void => {
    console.log(thing.url);
  };

  const delShape = (thing: Thing): void => {
    console.log(thing.url);
  };

  return (
    <Tabs className="mb-4 mt-4" defaultActiveKey="points" fill>
      <Tab eventKey="points" title="Points">
        {
          pts.map((p, i) => {
            return <LockerItem key={i} label={p.label} onSee={() => seePoint(p.thing)} onDel={() => delPoint(p.thing)} />
          })
        }
      </Tab>
      <Tab eventKey="shapes" title="Shapes">
        {
          sts.map((s, i) => {
            return <LockerItem key={i} label={s.label} onSee={() => seeShape(s.thing)} onDel={() => delShape(s.thing)} />
          })
        }
      </Tab>
    </Tabs>
  );
};

// locker modal

type LockerModalProps = { onHide: () => void; }

/**
 * Performs acquisition of both @b points and @b shapes datasets.
 */
function LockerModal({ onHide }: LockerModalProps): JSX.Element {

  const data = useContext(AppContext).locker.data;

  const podCurr = useAppSelector(state => state.locker.podCurr);
  const podList = useAppSelector(state => state.locker.podList);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [pod, setPod] = useState<UrlString | undefined>(podCurr ?? podList[0]);

  const confirm = async () => {

    try {
      setLoading(true);

      const points = await fetchSolidDataset(pod + SOLID_POINTS_DATASET);
      const shapes = await fetchSolidDataset(pod + SOLID_SHAPES_DATASET);

      if (!points || !shapes) {
        return alert("[Solid Error] Cannot obtain datasets from the selected Solid Pod.");
      }

      data.set(pod!, { points: points, shapes: shapes });
      dispatch(setPodCurr(pod!));
      onHide();
    }
    finally { setLoading(false); }
  };

  return (
    <Modal show={true} backdrop="static" centered={true} keyboard={false}>
      <Modal.Body>
        <Form.Label>Available Pods</Form.Label>
        <Form.Group>
          <Form.Select value={pod} disabled={loading} onChange={(e) => setPod(e.target.value)}>
            {
              podList.map((url, i) => <option key={i} value={url}>{url}</option>)
            }
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" disabled={loading} onClick={onHide}>Cancel</Button>
        <Button variant="primary" disabled={!pod || loading} onClick={confirm}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
}

function LockerContent(): JSX.Element {

  const [modal, setModal] = useState(false);
  const pod = useAppSelector(state => state.locker.podCurr);

  return (
    <>
      <Form.Group style={{ display: "flex", alignItems: "center", justifyContent: "center" }} className="mt-2 mb-4">
        <Form.Control type="text" placeholder="Select Pod..." defaultValue={pod} readOnly />
        <ConfigureButton onClick={() => setModal(true)} />
      </Form.Group>
      {pod && <LockerPanes pod={pod} />}
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
