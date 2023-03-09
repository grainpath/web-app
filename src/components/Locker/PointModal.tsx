import { useState } from "react";
import { Badge, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Link as LinkIcon } from "@mui/icons-material";
import { POINTS_ADDR } from "../../utils/general";
import { LockerPoint } from "../../utils/solid";
import {
  standardContainerClassName,
  standardModalProps,
  UserInputPane
} from "../PanelPrimitives";


type PointModalProps = { point: LockerPoint; onHide: () => void; };

export function PointModal({ point, onHide }: PointModalProps): JSX.Element {
  const [note, setNote] = useState(point.note!);

  const list = () => {};

  const save = () => {};

  return (
    <Modal show onHide={onHide} {...standardModalProps}>
      <Modal.Header closeButton />
      <Modal.Body>
        <div className={standardContainerClassName}>
          <h5>
            {point.grain!.name}
            <sup><Link style={{ fontSize: "large" }} to={POINTS_ADDR + "/" + point.grain!.id}><LinkIcon /></Link></sup>
          </h5>
        </div>
        <div className="mt-3 mb-3" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
          { point.grain!.keywords.map((keyword, i) => <Badge key={i} bg="success" style={{ margin: "0.2rem" }}>{keyword}</Badge>) }
        </div>
        <UserInputPane note={note} setNote={setNote} modified={point.modified} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={list}>List</Button>
        <Button onClick={save}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}
