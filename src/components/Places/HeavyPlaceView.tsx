import { useContext, useEffect, useState } from "react";
import { Badge, Button, Image } from "react-bootstrap";

import { AppContext } from "../../App";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { appendPlace } from "../../features/navigateSlice";
import { point2text } from "../../utils/general";
import { heavy2light, HeavyPlace } from "../../utils/grainpath";
import { keywordBadgeProps } from "../PanelPrimitives";
import SaveModal from "./SaveModal";

type HeavyPlaceViewProps = {
  place: HeavyPlace;
};

export default function HeavyPlaceView({ place }: HeavyPlaceViewProps): JSX.Element {

  const opacity = 0.7;

  const {
    description,
    image
  } = place.features;

  const dispatch = useAppDispatch();
  const sequence = useAppSelector(state => state.navigate.sequence);
  const isLoggedIn = useAppSelector(state => state.logger.isLoggedIn);
  const podCurr = useAppSelector(state => state.locker.podCurr);

  // const leaflet = useContext(AppContext).leaflet;
  const [mod, setMod] = useState(false);

  useEffect(() => {
    // leaflet.map?.clear();
    // leaflet.map?.setHeavyPlace(place);
  }, [//leaflet,
    place]);

  const list = () => { dispatch(appendPlace(heavy2light(place))); };

  return (
    <>
      <h4>{place.name}</h4>
      <hr style={{ opacity: opacity, margin: "0.5rem 0" }}/>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <small style={{ opacity: opacity }}>{point2text(place.location)}</small>
      </div>
      { image &&
        <div>
          <a href={image} rel="noopener noreferrer" target="_blank">
            <Image src={image} className="mt-2 mb-2" style={{ width: "100%", maxHeight: "300px" }} rounded />
          </a>
        </div>
      }
      <div className="mt-2" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        { place.keywords.map((keyword, i) => <Badge key={i} {...keywordBadgeProps}>{keyword}</Badge>) }
      </div>
      { description && <div className="mt-2"><small>{description}</small></div> }
      <div className="mt-2" style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Button disabled={!!sequence.find((p) => p.id === place.id)} onClick={list}>List</Button>
        <Button disabled={!isLoggedIn || !podCurr} onClick={() => setMod(true)}>Save</Button>
      </div>
      { mod && <SaveModal place={place} onHide={() => setMod(false)} /> }
    </>
  );
}
