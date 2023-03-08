import L from "leaflet";
import { LatLng } from "leaflet";
import { useContext, useEffect, useState } from "react";
import { Badge, Button, Image } from "react-bootstrap";

import { AppContext } from "../../App";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { appendPoint } from "../../features/searchSlice";
import { point2view } from "../../utils/general";
import { HeavyGrain } from "../../utils/grainpath";
import { standardContainerClassName } from "../PanelPrimitives";
import SaveModal from "./SaveModal";

type HeavyGrainViewProps = {
  grain: HeavyGrain;
};

export default function HeavyGrainView({ grain }: HeavyGrainViewProps): JSX.Element {

  const opacity = 0.7;
  const point = grain.location;

  const {
    name,
    description,
    image
  } = grain.tags;

  const dispatch = useAppDispatch();
  const sequence = useAppSelector(state => state.search.sequence);
  const isLoggedIn = useAppSelector(state => state.logger.isLoggedIn);
  const podCurr = useAppSelector(state => state.locker.podCurr);

  const leaflet = useContext(AppContext).leaflet;
  const [modal, setModal] = useState(false);

  useEffect(() => {

    leaflet.layerGroup?.clearLayers();

    const l = new LatLng(point.lat, point.lon);
    L.marker(l, { icon: leaflet.views.tagged, draggable: false }).addTo(leaflet.layerGroup!);

    if (grain.polygon) {
      L.polygon(grain.polygon?.map((point) => new LatLng(point.lat, point.lon)), { color: "green" }).addTo(leaflet.layerGroup!);
    }

    leaflet.map?.flyTo(l, leaflet.map?.getZoom());
  }, [leaflet, point.lon, point.lat, grain.polygon]);

  const list = () => {
    dispatch(appendPoint({ id: grain.id, location: point, keywords: grain.keywords, tags: { name: name } }));
  };

  return (
    <>
      <h4>{name}</h4>
      <hr style={{ opacity: opacity, margin: "0.5rem 0" }}/>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <small style={{ opacity: opacity }}>{point2view(point)}</small>
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
      <div className="mt-4" style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Button disabled={!!sequence.find((gs) => gs.id === grain.id)} onClick={list}>Enlist</Button>
        <Button disabled={!isLoggedIn || !podCurr} onClick={() => setModal(true)}>Save</Button>
      </div>
      { modal && <SaveModal grain={grain} onHide={() => setModal(false)} /> }
    </>
  );
}
