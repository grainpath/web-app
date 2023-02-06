import { useState } from "react";
import { Panel } from './Panel';
import { PanelButton } from "./Button";

export default function Control(): JSX.Element {

  const [panel, setPanel] = useState(false);

  return(
    <>
      <PanelButton onClick={() => setPanel(true)} />
      <Panel visibility={panel} onHide={() => setPanel(false)} />
    </>
  );
}
