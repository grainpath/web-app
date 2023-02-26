import { Form } from "react-bootstrap";
import { KeyboardCommandKey, LocationOn, Search, Storage } from "@mui/icons-material";
import { marker2view } from "../utils/funcs";
import type { SimpleButtonProps } from "./types";
import { Point } from "../utils/types";

type MarkerLineProps = {
  kind: string;
  point?: Point;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

type MarkerButtonProps = SimpleButtonProps & {
  kind: string;
  buttonStyle: React.CSSProperties | undefined;
}

export function PanelButton({ onClick }: SimpleButtonProps): JSX.Element {

  return (
    <div style={{ top: "10px", left: "10px", zIndex: 1000, position: "absolute" }}>
      <button id="panel-button" className="standard-button control-button" onClick={onClick} title="Control panel">
        <KeyboardCommandKey fontSize="large" />
      </button>
    </div>
  );
}

export function QueryButton({ onClick }: SimpleButtonProps): JSX.Element {

  return (
    <button className="standard-button" onClick={onClick} title='Query panel'>
      <Search fontSize="large" />
    </button>
  );
}

export function VaultButton({ onClick }: SimpleButtonProps): JSX.Element {

  return (
    <button className="standard-button" onClick={onClick} title="Vault panel">
      <Storage fontSize="large" />
    </button>
  );
}

export function MarkerButton({ onClick, kind, buttonStyle }: MarkerButtonProps) {

  return (
    <button className="standard-button" onClick={onClick} style={buttonStyle} title="Marker button">
      <LocationOn id={`${kind}-marker`} fontSize="large" />
    </button>
  );
}

export function SteadyMarkerLine({ kind, point, onClick }: MarkerLineProps) {

  return (
    <div className="mt-2 mb-2">
      <div className="marker-line">
        <MarkerButton onClick={onClick} kind={kind} buttonStyle={{ marginRight: "0.5rem" }} />
        <Form.Control type='text' placeholder={(point) ? marker2view(point) : ""} readOnly />
      </div>
    </div>
  );
}
