import { LocationOn } from "@mui/icons-material";
import { useContext } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { AppContext } from "../../App";
import { setSource } from "../../features/discoverSlice";
import { useAppDispatch } from "../../features/hooks";
import { blockPanel, unblockPanel } from "../../features/panelSlice";
import { point2place } from "../../utils/general";
import { MaybePlace } from "../../utils/grainpath";

type SelectMaybePlaceModalProps = {
  hide: () => void;
  func: (place: MaybePlace) => void;
}

export default function SelectMaybePlaceModal({ hide, func }: SelectMaybePlaceModalProps): JSX.Element {

  const dispatch = useAppDispatch();
  const map = useContext(AppContext).leaflet.newmap!;

  const handleCustom = () => {
    map.getMap().once("click", (e) => {
      const ll = map.getMap().mouseEventToLatLng(e.originalEvent);
      console.log(ll);
      document.getElementById("map")!.style.cursor = "";
      dispatch(setSource(point2place({ lon: ll.lng, lat: ll.lat })));
      dispatch(unblockPanel());
    });
    hide();
    dispatch(blockPanel());
    document.getElementById("map")!.style.cursor = "crosshair";
  };

  return (
    <Modal show onHide={hide}>
      <Modal.Header closeButton />
      <Modal.Body>
        Press <LocationOn fontSize="large" className="other-marker" onClick={handleCustom} /> to select custom point on the map.
        <hr/>
      </Modal.Body>
    </Modal>
  );
}
