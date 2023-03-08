import { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { getThing, saveSolidDatasetAt, setThing } from "@inrupt/solid-client";

import { AppContext } from "../../App";
import { HeavyGrain } from "../../utils/grainpath";
import { useAppSelector } from "../../features/hooks";
import { composeLockerPoint, extractLockerPoint, SOLID_POINTS_DATASET } from "../../utils/solid";
import {
  EntityUserInput,
  LockerGrainInfo,
  maxLockerItemLabelLength,
  maxLockerItemNoteLength,
  standardContainerClassName,
  standardModalProps
} from "../PanelPrimitives";

type SaveModalProps = {
  grain: HeavyGrain;
  onHide: () => void;
};

export default function SaveModal({ grain, onHide }: SaveModalProps): JSX.Element {

  const pod = useAppSelector(state => state.locker.podCurr)!;
  const dataset = useContext(AppContext).locker.data.get(pod)!;
  const olddata = dataset.points;

  const point = extractLockerPoint(grain.id, getThing(olddata, pod + SOLID_POINTS_DATASET + "#" + grain.id));

  const [valid, setValid] = useState(true);
  const [loading, setLoading] = useState(false);

  const [note, setNote] = useState(point.note ?? "");
  const [label, setLabel] = useState(point.label ?? grain.tags.name?.slice(0, maxLockerItemLabelLength) ?? "");

  const conf = {
    valid: valid, setValid: setValid,
    note: note, maxNote: maxLockerItemNoteLength, setNote: setNote,
    label: label, maxLabel: maxLockerItemLabelLength, setLabel: setLabel,
  }

  const save = async () => {

    setLoading(true);

    const newdata = setThing(olddata, composeLockerPoint(label, note, grain));

    try {
      const target = `${pod}${SOLID_POINTS_DATASET}`;
      dataset.points = await saveSolidDatasetAt(target, newdata, { fetch: fetch })
      onHide();
    }
    catch (ex) { alert(ex); }
    finally { setLoading(false);  }
  };

  const confirm = () => {
    if (!label.length) { return setValid(false); }
    save();
  };
console.log(grain.location);
  return (
    <Modal show {...standardModalProps}>
      <Modal.Body>
        <EntityUserInput {...conf} />
        { (point.updated) &&
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <small style={{ opacity: 0.7 }}>{`updated: ${point.updated?.toLocaleString()}`}</small>
          </div>
        }
        { point.grain &&
          <Form.Group className={standardContainerClassName}>
            <Form.Label>Before</Form.Label>
            <LockerGrainInfo grain={point.grain} />
          </Form.Group>
        }
        <Form.Group className={standardContainerClassName}>
          <Form.Label>After</Form.Label>
          <LockerGrainInfo grain={grain} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={loading} variant="danger" onClick={onHide}>Discard</Button>
        <Button disabled={loading} variant="primary" onClick={confirm}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
}
