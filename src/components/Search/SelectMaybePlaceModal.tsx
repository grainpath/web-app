import { Typography } from "@mui/material";
import { useContext } from "react";
import { Modal } from "react-bootstrap";
import { AppContext } from "../../App";
import { setSource } from "../../features/discoverSlice";
import { useAppDispatch } from "../../features/hooks";
import { blockPanel, unblockPanel } from "../../features/panelSlice";
import { point2place } from "../../utils/general";
import { MaybePlace, Point } from "../../utils/grainpath";
import { PinKind, PlusPinButton } from "../shared-pin-buttons";
import { SteadyModalPropsFactory } from "../shared-types";

type SelectMaybePlaceModalProps = {
  kind: PinKind;
  hide: () => void;
  func: (place: MaybePlace) => void;
}

export default function SelectMaybePlaceModal({ kind, hide, func }: SelectMaybePlaceModalProps): JSX.Element {

  const dispatch = useAppDispatch();
  const map = useContext(AppContext).map!;

  const callback = (point: Point) => {
    func(point2place(point));
    dispatch(unblockPanel());
  };

  const handleCustom = () => {
    hide();
    dispatch(blockPanel());
    map.captureLocation(callback);
  };

  return (
    <Modal show keyboard centered onHide={hide}>
      <Modal.Header closeButton />
      <Modal.Body>
        <Typography>
          Click on <PlusPinButton kind={kind} size="medium" onMarker={handleCustom} /> to select custom point.
        </Typography>
        <hr/>
        Select point from your places and confirm.
      </Modal.Body>
    </Modal>
  );
}
