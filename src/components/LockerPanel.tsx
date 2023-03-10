import { useContext, useState } from "react";
import { Alert, Form, Offcanvas, Tab, Tabs } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import { getThingAll, Thing } from "@inrupt/solid-client";

import { AppContext } from "../App";
import { lineContainerStyle, SimpleButtonProps } from "./PanelPrimitives";
import { SEARCH_ADDR } from "../utils/general";
import { SearchButton } from "./PanelPrimitives";
import LockerItem from "./Locker/LockerItem";
import PodModal from "./Locker/PodModal";
import { useAppSelector } from "../features/hooks";
import { PointModal } from "./Locker/PointModal";
import { extractLockerPoint, extractLockerPointName } from "../utils/solid";

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

type LockerPanesProps = { pod: string };

function LockerPanes({ pod }: LockerPanesProps): JSX.Element {

  const [ptmod, setPtmod] = useState(false);
  const [shmod, setShmod] = useState(false);
  const [thing, setThing] = useState<Thing | undefined>(undefined);

  const { points, shapes } = useContext(AppContext).locker.data.get(pod)!;
  const [pts, shs] = [points, shapes].map((dataset) => getThingAll(dataset));

  const detailPoint = (t: Thing): void => {
    setThing(t); setPtmod(true);
  };

  const detailShape = (t: Thing): void => {
    console.log(t.url);
  };

  return (
    <>
      <Tabs className="mb-4 mt-4" defaultActiveKey="points" fill>
        <Tab eventKey="points" title="Points">
          { pts.map((t, i) => <LockerItem key={i} label={extractLockerPointName(t)!} onDelete={() => {}} onDetail={() => detailPoint(t)} />) }
        </Tab>
        <Tab eventKey="shapes" title="Shapes">
          { shs.map((t, i) => <LockerItem key={i} label={extractLockerPointName(t)!} onDelete={() => {}} onDetail={() => detailShape(t)} />) }
        </Tab>
      </Tabs>
      { ptmod && <PointModal point={extractLockerPoint(thing!)} onHide={() => setPtmod(false)} /> }
      {/* { shmod && <ShapeModal /> } */}
    </>
  );
};

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
