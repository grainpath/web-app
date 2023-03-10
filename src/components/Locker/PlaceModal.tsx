import { useContext, useState } from "react";
import { Badge, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Link as LinkIcon } from "@mui/icons-material";
import { getThing, removeThing, setThing, SolidDataset } from "@inrupt/solid-client";
import { AppContext } from "../../App";
import { PLACES_ADDR } from "../../utils/general";
import { heavy2light } from "../../utils/grainpath";
import { composeLockerPlaceItem, LockerPlaceItem, SOLID_PLACES_DATASET, storeSolidDataset } from "../../utils/solid";
import {
  keywordBadgeProps,
  standardContainerClassName,
  standardModalProps,
  UserInputPane
} from "../PanelPrimitives";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { appendPlace } from "../../features/searchSlice";

type PlaceModalProps = { item: LockerPlaceItem; onHide: () => void; };

export default function PlaceModal({ item, onHide }: PlaceModalProps): JSX.Element {

  const place = item.place!;

  const pod = useAppSelector(state => state.locker.podCurr)!;
  const dataset = useContext(AppContext).locker.data.get(pod)!;
  const olddata = dataset.places;

  const [note, setNote] = useState(item.note!);
  const [acti, setActi] = useState(false);

  const target = `${pod}${SOLID_PLACES_DATASET}`;
  const actiS = (b: boolean) => setActi(b);
  const saveS = (d: SolidDataset) => dataset.places = d;
  const props = { targ: target, acti: actiS, save: saveS, hide: onHide };

  const dispatch = useAppDispatch();
  const sequence = useAppSelector(state => state.search.sequence);

  const list = () => { dispatch(appendPlace(heavy2light(place))); };

  const save = () => {
    storeSolidDataset({...props, data: setThing(olddata, composeLockerPlaceItem(note, place))});
  };

  const remove = () => {
    storeSolidDataset({...props, data: removeThing(olddata, getThing(olddata, target + '#' + place.id)!)});
  };

  return (
    <Modal show onHide={onHide} {...standardModalProps}>
      <Modal.Header closeButton />
      <Modal.Body>
        <div className={standardContainerClassName}>
          <h5>
            {place.name}
            <sup><Link style={{ fontSize: "large" }} to={PLACES_ADDR + "/" + place.id}><LinkIcon /></Link></sup>
          </h5>
        </div>
        <div className="mt-3 mb-3" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
          { place.keywords.map((keyword, i) => <Badge key={i} {...keywordBadgeProps}>{keyword}</Badge>) }
        </div>
        <UserInputPane note={note} setNote={setNote} modified={item.modified} />
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={acti} onClick={() => { remove(); }} className="me-auto" variant="danger">Delete</Button>
        <Button disabled={!!sequence.find((gs) => gs.id === place.id)} onClick={list}>List</Button>
        <Button disabled={acti} onClick={() => { save(); }}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}
