import { useContext, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { getThing,  setThing, SolidDataset } from "@inrupt/solid-client";

import { AppContext } from "../../App";
import { HeavyGrain } from "../../utils/grainpath";
import { useAppSelector } from "../../features/hooks";
import {
  composeLockerPoint,
  extractLockerPoint,
  SOLID_POINTS_DATASET,
  storeSolidDataset
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

  const save = () => {
    storeSolidDataset({
      targ: `${pod}${SOLID_POINTS_DATASET}`,
      data: setThing(olddata, composeLockerPoint(note, grain)),
      hide: onHide,
      acti: (b: boolean) => setLoading(b),
      save: (d: SolidDataset) => dataset.points = d,
    });
  };

  return (
    <Modal show {...standardModalProps}>
      <Modal.Body>
        <UserInputPane note={note} setNote={setNote} modified={point.modified} />
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={loading} variant="danger" onClick={onHide} className="me-auto">Discard</Button>
        <Button disabled={loading} variant="primary" onClick={() => { save(); }}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
}
