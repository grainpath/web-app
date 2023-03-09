import { UrlString } from "@inrupt/solid-client";
import { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

import { AppContext } from "../../App";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { setPodCurr } from "../../features/lockerSlice";
import {
  fetchSolidDataset,
  SOLID_POINTS_DATASET,
  SOLID_SHAPES_DATASET
} from "../../utils/solid";

type PodModalProps = { onHide: () => void; };

/**
 * Performs acquisition of both @b points and @b shapes datasets.
 */
export default function PodModal({ onHide }: PodModalProps): JSX.Element {

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
    <Modal show backdrop="static" centered={true} keyboard={false}>
      <Modal.Body>
        <Form.Label>Available Pods</Form.Label>
        <Form.Group>
          <Form.Select value={pod} disabled={loading} onChange={(e) => setPod(e.target.value)}>
            { podList.map((url, i) => <option key={i} value={url}>{url}</option>) }
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
