import { useContext, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { getThing, saveSolidDatasetAt, setThing } from "@inrupt/solid-client";

import { AppContext } from "../../App";
import { HeavyGrain } from "../../utils/grainpath";
import { useAppSelector } from "../../features/hooks";
import {
  composeLockerPoint,
  extractLockerPoint,
  SOLID_POINTS_DATASET
} from "../../utils/solid";
import { standardModalProps, UserInputPane } from "../PanelPrimitives";

type SaveModalProps = {
  grain: HeavyGrain;
  onHide: () => void;
};

export default function SaveModal({ grain, onHide }: SaveModalProps): JSX.Element {

  const pod = useAppSelector(state => state.locker.podCurr)!;
  const dataset = useContext(AppContext).locker.data.get(pod)!;
  const olddata = dataset.points;

  const point = extractLockerPoint(getThing(olddata, pod + SOLID_POINTS_DATASET + "#" + grain.id));

  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState(point.note ?? "");

  const save = async () => {
    setLoading(true);
    const newdata = setThing(olddata, composeLockerPoint(note, grain));

    try {
      const target = `${pod}${SOLID_POINTS_DATASET}`;
      dataset.points = await saveSolidDatasetAt(target, newdata, { fetch: fetch })
      onHide();
    }
    catch (ex) { alert(ex); }
    finally { setLoading(false);  }
  };

  const confirm = () => { save(); };

  return (
    <Modal show {...standardModalProps}>
      <Modal.Body>
        <UserInputPane note={note} setNote={setNote} modified={point.modified} />
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={loading} variant="danger" onClick={onHide}>Discard</Button>
        <Button disabled={loading} variant="primary" onClick={confirm}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
}
