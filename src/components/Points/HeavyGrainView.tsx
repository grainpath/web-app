import { useContext, useEffect, useState } from "react";
import { Badge, Button, Image } from "react-bootstrap";

import { AppContext } from "../../App";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { appendPoint } from "../../features/searchSlice";
import { point2view } from "../../utils/general";
import { HeavyGrain } from "../../utils/grainpath";
import { setLeafletHeavyGrain } from "../../utils/leaflet";
import { standardContainerClassName } from "../PanelPrimitives";
import SaveModal from "./SaveModal";

type HeavyGrainViewProps = {
  grain: HeavyGrain;
};

export default function HeavyGrainView({ grain }: HeavyGrainViewProps): JSX.Element {

  const opacity = 0.7;

  const {
    description,
    image
  } = grain.tags;

  const dispatch = useAppDispatch();
  const sequence = useAppSelector(state => state.search.sequence);
  const isLoggedIn = useAppSelector(state => state.logger.isLoggedIn);
  const podCurr = useAppSelector(state => state.locker.podCurr);

  const leaflet = useContext(AppContext).leaflet;
  const [mod, setMod] = useState(false);

  useEffect(() => setLeafletHeavyGrain(leaflet, grain), [leaflet, grain]);

  const list = () => {
    dispatch(appendPoint({ id: grain.id, name: grain.name, location: grain.location, keywords: grain.keywords }));
  };

  return (
    <>
      <h4>{grain.name}</h4>
      <hr style={{ opacity: opacity, margin: "0.5rem 0" }}/>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <small style={{ opacity: opacity }}>{point2view(grain.location)}</small>
      </div>
      { image &&
        <div>
          <a href={image} rel="noopener noreferrer" target="_blank">
            <Image src={image} className="mt-2 mb-2" style={{ width: "100%" }} rounded />
          </a>
        </div>
      }
      <div className={standardContainerClassName} style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        {
          grain.keywords.map((keyword, i) => <Badge key={i} bg="success" style={{ margin: "0 0.2rem", display: "block" }} pill>{keyword}</Badge>)
        }
      </div>
      { description && <div className="mt-2 mb-2"><small>{description}</small></div> }
      <div className="mt-2" style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Button disabled={!!sequence.find((gs) => gs.id === grain.id)} onClick={list}>List</Button>
        <Button disabled={!isLoggedIn || !podCurr} onClick={() => setMod(true)}>Save</Button>
      </div>
      { mod && <SaveModal grain={grain} onHide={() => setMod(false)} /> }
    </>
  );
}
