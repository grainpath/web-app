import { useContext, useState } from "react";
import { Badge, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Link as LinkIcon } from "@mui/icons-material";
import { POINTS_ADDR } from "../../utils/general";
import { composeLockerPoint, LockerPoint, SOLID_POINTS_DATASET } from "../../utils/solid";
import {
  standardContainerClassName,
  standardModalProps,
  UserInputPane
} from "../PanelPrimitives";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { appendPoint } from "../../features/searchSlice";
import { heavy2light } from "../../utils/grainpath";
import { saveSolidDatasetAt, setThing } from "@inrupt/solid-client";
import { AppContext } from "../../App";
import { fetch } from "@inrupt/solid-client-authn-browser";

type PointModalProps = { point: LockerPoint; onHide: () => void; };

export function PointModal({ point, onHide }: PointModalProps): JSX.Element {

  const grain = point.grain!;
  const pod = useAppSelector(state => state.locker.podCurr)!;
  const dataset = useContext(AppContext).locker.data.get(pod)!;
  const olddata = dataset.points;

  const [load, setLoad] = useState(false);
  const [note, setNote] = useState(point.note!);

  const dispatch = useAppDispatch();
  const sequence = useAppSelector(state => state.search.sequence);

  const list = () => { dispatch(appendPoint(heavy2light(grain))); };

  const save = async () => {
    setLoad(true);
    const newdata = setThing(olddata, composeLockerPoint(note, grain));

    try {
      const target = `${pod}${SOLID_POINTS_DATASET}`;
      dataset.points = await saveSolidDatasetAt(target, newdata, { fetch: fetch });
      onHide();
    }
    catch (ex) { alert(ex); }
    finally { setLoad(false); }
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
        <Button disabled={!!sequence.find((gs) => gs.id === grain.id)} onClick={list}>List</Button>
        <Button disabled={load} onClick={() => { save(); }}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}
