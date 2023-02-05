import { useState } from "react";
import { Panel } from './Panel';
import { SearchButton } from "./Button";

export default function Control(): JSX.Element {

  const [panel, setPanel] = useState(false);

  return(
    <>
      <SearchButton onClick={() => setPanel(true)} />
      <Panel visibility={panel} onHide={() => setPanel(false)} />
    </>
  );
}
