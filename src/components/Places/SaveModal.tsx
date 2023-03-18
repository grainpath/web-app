import { useContext, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { getThing,  setThing, SolidDataset } from "@inrupt/solid-client";

import { AppContext } from "../../App";
import { HeavyPlace } from "../../utils/grainpath";
import { useAppSelector } from "../../features/hooks";
import {
  composeLockerPlaceItem,
  extractLockerPlaceItem,
  SOLID_PLACES_DATASET,
  storeSolidDataset
} from "../../utils/solid";
import { UserInputPane } from "../PanelPrimitives";
import { SteadyModalPropsFactory } from "../shared-types";

type SaveModalProps = {
  place: HeavyPlace;
  onHide: () => void;
};

export default function SaveModal({ place, onHide }: SaveModalProps): JSX.Element {

  // const pod = useAppSelector(state => state.locker.podCurr)!;
  // const dataset = useContext(AppContext).storage.data.get(pod)!;
  // const olddata = dataset.places;

  // const item = extractLockerPlaceItem(getThing(olddata, pod + SOLID_PLACES_DATASET + "#" + place.id));

  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState(/* item.note ?? */ "");

  const save = () => {
    // storeSolidDataset({
    //   targ: `${pod}${SOLID_PLACES_DATASET}`,
    //   data: setThing(olddata, composeLockerPlaceItem(note, place)),
    //   hide: onHide,
    //   acti: (b: boolean) => setLoading(b),
    //   save: (d: SolidDataset) => dataset.places = d,
    // });
  };

  return (
    <Modal {...SteadyModalPropsFactory.getStandard()} show>
      <Modal.Body>
        <UserInputPane note={note} setNote={setNote} modified={/*item.modified*/undefined} />
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={loading} variant="danger" onClick={onHide} className="me-auto">Discard</Button>
        <Button disabled={loading} variant="primary" onClick={() => { save(); }}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
}
