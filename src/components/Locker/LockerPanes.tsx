import { useContext, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { getThingAll, Thing } from "@inrupt/solid-client";

import { AppContext } from "../../App";
import { extractLockerItemName, extractLockerPlaceItem } from "../../utils/solid";
import ListItem from "./ListItem";
import PlaceModal from "./PlaceModal";

type LockerPanesProps = { pod: string };

export default function LockerPanes({ pod }: LockerPanesProps): JSX.Element {

  const [plmod, setPlmod] = useState(false);
  const [rtmod, setRtmod] = useState(false);
  const [thing, setThing] = useState<Thing | undefined>(undefined);

  const { places, routes } = useContext(AppContext).locker.data.get(pod)!;
  const [pls, rts] = [places, routes].map((dataset) => getThingAll(dataset));

  const detailPlace = (t: Thing): void => { setThing(t); setPlmod(true); };

  const detailRoute = (t: Thing): void => { console.log(t.url); };

  return (
    <>
      <Tabs className="mb-4 mt-4" defaultActiveKey="places" fill>
        <Tab eventKey="places" title="Places">
          { pls.map((t, i) => <ListItem key={i} label={extractLockerItemName(t)!} onDelete={() => {}} onDetail={() => detailPlace(t)} />) }
        </Tab>
        <Tab eventKey="routes" title="Routes">
          { rts.map((t, i) => <ListItem key={i} label={extractLockerItemName(t)!} onDelete={() => {}} onDetail={() => detailRoute(t)} />) }
        </Tab>
      </Tabs>
      { plmod && <PlaceModal item={extractLockerPlaceItem(thing!)} onHide={() => setPlmod(false)} /> }
      {/* { rtmod && <RouteModal /> } */}
    </>
  );
};
