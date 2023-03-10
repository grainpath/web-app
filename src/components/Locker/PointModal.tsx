import { useContext, useState } from "react";
import { Badge, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Link as LinkIcon } from "@mui/icons-material";
import { getThing, removeThing, setThing, SolidDataset } from "@inrupt/solid-client";
import { AppContext } from "../../App";
import { POINTS_ADDR } from "../../utils/general";
import { composeLockerPoint, LockerPoint, SOLID_POINTS_DATASET, storeSolidDataset } from "../../utils/solid";
import {
  standardContainerClassName,
  standardModalProps,
  UserInputPane
} from "../PanelPrimitives";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { appendPoint } from "../../features/searchSlice";
import { heavy2light } from "../../utils/grainpath";

type PointModalProps = { point: LockerPoint; onHide: () => void; };

export function PointModal({ point, onHide }: PointModalProps): JSX.Element {

  const grain = point.grain!;

  const pod = useAppSelector(state => state.locker.podCurr)!;
  const dataset = useContext(AppContext).locker.data.get(pod)!;
  const olddata = dataset.points;

  const [note, setNote] = useState(point.note!);
  const [acti, setActi] = useState(false);

  const target = `${pod}${SOLID_POINTS_DATASET}`;
  const actiS = (b: boolean) => setActi(b);
  const saveS = (d: SolidDataset) => dataset.points = d;
  const props = { targ: target, acti: actiS, save: saveS, hide: onHide };

  const dispatch = useAppDispatch();
  const sequence = useAppSelector(state => state.search.sequence);

  const list = () => { dispatch(appendPoint(heavy2light(grain))); };

  const save = () => {
    storeSolidDataset({...props, data: setThing(olddata, composeLockerPoint(note, grain))});
  };

  const remove = () => {
    storeSolidDataset({...props, data: removeThing(olddata, getThing(olddata, target + '#' + grain.id)!)});
  };

  return (
    <Modal show onHide={onHide} {...standardModalProps}>
      <Modal.Header closeButton />
      <Modal.Body>
        <div className={standardContainerClassName}>
          <h5>
            {grain.name}
            <sup><Link style={{ fontSize: "large" }} to={POINTS_ADDR + "/" + grain.id}><LinkIcon /></Link></sup>
          </h5>
        </div>
        <div className="mt-3 mb-3" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
          { grain.keywords.map((keyword, i) => <Badge key={i} bg="success" style={{ margin: "0.2rem" }}>{keyword}</Badge>) }
        </div>
        <UserInputPane note={note} setNote={setNote} modified={point.modified} />
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={acti} onClick={() => { remove(); }} className="me-auto" variant="danger">Delete</Button>
        <Button disabled={!!sequence.find((gs) => gs.id === grain.id)} onClick={list}>List</Button>
        <Button disabled={acti} onClick={() => { save(); }}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}
