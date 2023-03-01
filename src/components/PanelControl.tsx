import { Form } from "react-bootstrap";
import { KeyboardCommandKey, LocationOn, Search, Storage } from "@mui/icons-material";
import { marker2view } from "../utils/funcs";
import type { SimpleButtonProps } from "./types";
import { Point } from "../utils/types";
import { ReactElement } from "react";

type StandardButtonProps = {
  title: string;
  icon: ReactElement;
  onClick: React.MouseEventHandler<HTMLElement>;
}

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

export function StandardButton({ icon, ...rest }: StandardButtonProps): JSX.Element {
  return (<button {...rest} className="standard-button">{icon}</button>);
}

export function SearchButton(props: SimpleButtonProps): JSX.Element {
  return (<StandardButton {...props} icon={<Search fontSize="large" />} title="Search panel" />);
}

export function LockerButton(props: SimpleButtonProps): JSX.Element {
  return (<StandardButton {...props} icon={<Storage fontSize="large" />} title="Locker panel" />);
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
        <Form.Control type="text" value={(point) ? marker2view(point) : ""} readOnly />
      </div>
    </div>
  );
}
